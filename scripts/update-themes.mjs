import { differenceInDays } from "date-fns"
import matter from "gray-matter"
import yaml from "json-to-pretty-yaml"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import glob from "tiny-glob"
import { orgApi, parseRepoUrl } from "./github.mjs"

const NEW_THRESHOLD_DAYS = 28

function isOfficial(theme) {
	return theme.categories.includes("official")
}

function isNewTheme(theme) {
	if (!theme.publishDate) {
		return false
	}

	const date = new Date(theme.publishDate)
	const today = new Date()
	return differenceInDays(today, date) <= NEW_THRESHOLD_DAYS
}

function badgeForTheme(theme) {
	if (isNewTheme(theme)) {
		return "new"
	}

	return undefined
}

async function withStars(theme) {
	if (isOfficial(theme) || !theme.repoUrl) {
		return theme
	}

	const { org, repo } = parseRepoUrl(theme.repoUrl) ?? {}

	if (!org || !repo) {
		return theme
	}

	const stars = await orgApi(org).repo(repo).fetchStars()

	return {
		...theme,
		stars,
	}
}

async function withUser(theme) {
	if (!theme.repoUrl || !!theme.author) {
		return theme
	}

	const { org } = parseRepoUrl(theme.repoUrl) ?? {}

	if (!org) {
		console.log("notfound::", theme.repoUrl)

		return theme
	}

	let author = {
		name: org,
		url: `https://github.com/${org}/`,
	}

	try {
		const userJson = await orgApi(org).user().fetchUser()
		author = {
			name: userJson.login,
			url: userJson.html_url,
			avatar: userJson.avatar_url,
		}
	} catch {}

	if (!author) {
		try {
			const orgJson = await orgApi(org).org().fetchOrg()
			author = {
				name: orgJson.login,
				url: orgJson.html_url,
				avatar: orgJson.avatar_url,
			}
		} catch {}
	}

	if (!author) {
		console.log("notfound::", theme.repoUrl.href)
	}

	return {
		...theme,
		author,
	}
}

async function withStarsAndUser(theme) {
	return withStars(theme).then(withUser)
}

async function main() {
	// load all themes from src/content/themes
	const pathname = path.resolve(
		path.dirname(fileURLToPath(import.meta.url)),
		"../src/content/themes/*.md",
	)
	const entries = await glob(pathname)

	for (const entry of entries) {
		const { data, content } = matter.read(entry)

		const details = await withStarsAndUser(data)

		// update the Recently Added category
		details.categories = isNewTheme(details)
			? Array.from(new Set([...details.categories, "recent"]))
			: details.categories.filter((c) => c !== "recent")

		const frontmatter = yaml.stringify({
			...data,
			...details,
			badge: badgeForTheme(details),
		})

		fs.writeFileSync(
			entry,
			`---
${frontmatter}---\n${content}`,
		)
	}
}

main()
