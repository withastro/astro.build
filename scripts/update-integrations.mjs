import fs from 'node:fs'
import { getCategoriesForKeyword, getOverrides } from './integrations.mjs'
import { parseRepoUrl, orgApi } from './github.mjs'
import {
	fetchDetailsForPackage,
	fetchDownloadsForPackage,
	searchByKeyword,
} from './npm.mjs'

const WHITELIST_PACKAGES = [
	"@astrojs/lit",
	"@astrojs/partytown",
	"@astrojs/preact",
	"@astrojs/react",
	"@astrojs/solid-js",
	"@astrojs/svelte",
	"@astrojs/tailwind",
	"@astrojs/turbolinks",
	"@astrojs/vue",
	'astro-icon'
];

function isOfficial(pkg) {
	return pkg.startsWith('@astrojs/')
}

function normalizePackageDetails(data, pkg) {
	const allCategories = (data.keywords ?? [])
		.map(getCategoriesForKeyword)
		.flat()
	const uniqCategories = Array.from(new Set(allCategories))

	if (!data.repository) {
		console.log(pkg, data);
	}

	return {
		slug: data.name,
		title: data.name,
		description: data.description,
		categories: uniqCategories,
		official: isOfficial(pkg),
		repoUrl: {
			href: data.repository.url
				.replace('git+', '')
				.replace('.git', '')
				.replace('git:', 'https:'),
			text: 'View source code',
		},
		npmUrl: {
			href: `https://www.npmjs.com/package/${pkg}`,
			text: 'View on NPM',
		},
		url: {
			href: data.homepage,
			text: 'View homepage',
		},
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
	const keyword = 'astro-component'

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
			data.official ? undefined : getStarsForRepo(data.repoUrl.href)
		)
	)

	const integrations = npmData
		.map((data, i) => ({
			...data,
			stars: stars[i],
		}))
		.sort((a, b) => b.downloads - a.downloads)

	fs.writeFileSync(
		'src/data/integrations.json',
		JSON.stringify(integrations, null, 4)
	)
}

main()
