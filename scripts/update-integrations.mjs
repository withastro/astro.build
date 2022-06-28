import fs from 'node:fs'
import { getCategoriesForKeyword, getOverrides } from './integrations.mjs'
import { parseRepoUrl, orgApi } from './github.mjs'
import {
	fetchDetailsForPackage,
	fetchDownloadsForPackage,
	searchByKeyword,
} from './npm.mjs'

const WHITELIST_PACKAGES = [
	'@astrojs/deno',
	'@astrojs/lit',
	'@astrojs/netlify',
	'@astrojs/node',
	'@astrojs/partytown',
	'@astrojs/preact',
	'@astrojs/react',
	'@astrojs/sitemap',
	'@astrojs/solid-js',
	'@astrojs/svelte',
	'@astrojs/tailwind',
	'@astrojs/turbolinks',
	'@astrojs/vercel',
	'@astrojs/vue',
	'astro-icon',
]

function isOfficial(pkg) {
	return pkg.startsWith('@astrojs/')
}

function normalizePackageDetails(data, pkg) {
	const allCategories = (data.keywords ?? [])
		.map(getCategoriesForKeyword)
		.flat()
	const uniqCategories = Array.from(new Set(allCategories))

	const npmUrl = {
		href: `https://www.npmjs.com/package/${pkg}`,
		text: 'View on NPM',
	}

	const repoUrl = data.repository?.url && {
		href: data.repository.url
			.replace('git+', '')
			.replace('.git', '')
			.replace('git:', 'https:'),
		text: 'View source code',
	}

	const url = data.homepage
		? {
				href: data.homepage,
				text: 'View homepage',
		  }
		: npmUrl

	return {
		slug: data.name,
		title: data.name,
		description: data.description,
		categories: uniqCategories,
		official: isOfficial(pkg),
		repoUrl,
		npmUrl,
		url,
	}
}

async function getStarsForRepo(repoUrl) {
	const { org, repo } = parseRepoUrl(repoUrl) ?? {}

	if (!org || !repo) {
		return 0
	}

	return await orgApi(org).repo(repo).fetchStars()
}

async function fetchDetailsWithOverrides(pkg) {
	const details = await fetchDetailsForPackage(pkg)
	const integrationOverrides = getOverrides(pkg) || {}

	return {
		...normalizePackageDetails(details, pkg),
		...integrationOverrides,
	}
}

async function main() {
	const keyword = 'astro-component,withastro'

	const packagesMap = await searchByKeyword(keyword)
	const packageNames = new Set([...packagesMap.keys(), ...WHITELIST_PACKAGES])

	const data = await Promise.all(
		[...packageNames].map(pkg =>
			Promise.all([
				fetchDetailsWithOverrides(pkg),
				fetchDownloadsForPackage(pkg),
			])
		)
	)

	const npmData = data.map(([details, downloads]) => ({
		...details,
		downloads,
	}))

	// don't fetch stars for official packages, they get a badge instead
	const stars = await Promise.all(
		npmData.map(data =>
			data.official || !data.repoUrl?.href
				? undefined
				: getStarsForRepo(data.repoUrl.href)
		)
	)

	const integrations = npmData
		.map((data, i) => ({
			...data,
			stars: stars[i],
		}))
		.sort(() => 0.5 - Math.random())

	fs.writeFileSync(
		'src/data/integrations.json',
		JSON.stringify(integrations, null, 4)
	)
}

main()
