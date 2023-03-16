import matter from "gray-matter"
import yaml from "json-to-pretty-yaml"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import glob from "tiny-glob"
import { orgApi, parseRepoUrl } from "./github.mjs"

function isOfficial(theme) {
	return theme.categories.includes("official")
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
		const frontmatter = yaml.stringify({
			...data,
			...details,
		})

		fs.writeFileSync(
			entry,
			`---
${frontmatter}---\n${content}`,
		)
	}
}

main()
