import matter from "gray-matter"
import yaml from "json-to-pretty-yaml"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import glob from "tiny-glob"
import {
	badgesForPackage,
	getCategoriesForKeyword,
	getFeaturedPackagePriority,
	getOverrides,
} from "./integrations.mjs"
import { fetchDetailsForPackage, fetchDownloadsForPackage } from "./npm.mjs"

function isOfficial(pkg) {
	return pkg.startsWith("@astrojs/")
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

	const repoUrl =
		data.repository?.url &&
		data.repository.url.replace("git+", "").replace(".git", "").replace("git:", "https:")

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
	const pathname = path.resolve(
		path.dirname(fileURLToPath(import.meta.url)),
		"../src/content/integrations/*.md",
	)
	const entries = await glob(pathname)

	for (const entry of entries) {
		const { data } = matter.read(entry)
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

main()
