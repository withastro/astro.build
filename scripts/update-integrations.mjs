import matter from "gray-matter"
import yaml from "json-to-pretty-yaml"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import slugify from "slugify"
import glob from "tiny-glob"
import {
	allowlist,
	badgesForPackage,
	blocklist,
	getCategoriesForKeyword,
	getFeaturedPackagePriority,
	getOverrides,
} from "./integrations.mjs"
import { fetchDetailsForPackage, fetchDownloadsForPackage, searchByKeyword } from "./npm.mjs"

function isOfficial(pkg) {
	return pkg.startsWith("@astrojs/")
}

function sanitizeGitHubUrl(url) {
	return url
		.replace("git+", "")
		.replace(".git", "")
		.replace("git:", "https:")
		.replace("git@github.com:", "https://github.com/")
}

function normalizePackageDetails(data, pkg) {
	const keywordCategories = (data.keywords ?? []).map(getCategoriesForKeyword).flat()

	const featured = getFeaturedPackagePriority(pkg)

	const otherCategories = [
		isOfficial(pkg) ? "official" : undefined,
		!!featured ? "featured" : undefined,
	].filter(Boolean)

	const uniqCategories = Array.from(new Set([...keywordCategories, ...otherCategories]))

	const npmUrl = `https://www.npmjs.com/package/${pkg}`

	const repoUrl = data.repository?.url && sanitizeGitHubUrl(data.repository.url)

	const homepageUrl = data.homepage || npmUrl

	return {
		name: data.name,
		title: data.name,
		description: data.description,
		categories: uniqCategories,
		npmUrl,
		repoUrl,
		homepageUrl,
	}
}

async function fetchWithOverrides(pkg) {
	const details = await fetchDetailsForPackage(pkg)
	const integrationOverrides = getOverrides(pkg) || {}

	const downloads = await fetchDownloadsForPackage(pkg)
	const badges = badgesForPackage(details)
	const featured = getFeaturedPackagePriority(pkg)

	return {
		...normalizePackageDetails(details, pkg),
		...integrationOverrides,
		downloads,
		badges: badges.length > 0 ? badges : undefined,
		featured,
	}
}

async function main() {
	const keyword = "astro-component,withastro"

	const packagesMap = await searchByKeyword(keyword)
	const searchResults = new Set(
		[...packagesMap.keys(), ...allowlist].filter((pkg) => !blocklist.includes(pkg)),
	)

	const pathname = path.resolve(
		path.dirname(fileURLToPath(import.meta.url)),
		"../src/content/integrations/*.md",
	)
	const entries = await glob(pathname)

	const existingIntegrations = new Set()
	const deprecatedIntegrations = []

	// loop through all integrations already published to the catalog
	for (const entry of entries) {
		const { data } = matter.read(entry)
		existingIntegrations.add(data.name)

		if (!searchResults.has(data.name)) {
			// the integration was deprecated or removed from NPM
			deprecatedIntegrations.push(data.name)
			fs.rmSync(entry)
		} else {
			// fetch the latest NPM data, keeping any local overrides like description or icon
			const details = await fetchWithOverrides(data.name)

			const frontmatter = yaml.stringify({
				...data,
				...details,
			})

			fs.writeFileSync(
				entry,
				`---
${frontmatter}---\n`,
			)
		}
	}

	// find new integrations that haven't been published yet
	const newIntegrations = Array.from(searchResults.keys()).filter(
		(pkg) => !existingIntegrations.has(pkg),
	)

	for (const entry of newIntegrations) {
		const details = await fetchWithOverrides(entry)

		const frontmatter = yaml.stringify(details)

		const slug = slugify(entry)
		const file = path.resolve(
			path.dirname(fileURLToPath(import.meta.url)),
			`../src/content/integrations/${slug}.md`,
		)

		fs.writeFileSync(
			file,
			`---
${frontmatter}---\n`,
		)
	}

	// logging in case we need to audit the nightly job
	let stats = `\n--- Update Integrations ---
Updated: ${existingIntegrations.size - deprecatedIntegrations.length} integrations`

	if (newIntegrations.length) {
		stats += `\n\nAdded:${newIntegrations.map((pkg) => `\n  + ${pkg}`)}`
	}

	if (deprecatedIntegrations.length) {
		stats += `\n\nRemoved:${deprecatedIntegrations.map((pkg) => `\n  - ${pkg}`)}`
	}

	stats += "\n---------------------------"

	console.info(stats)
}

main()
