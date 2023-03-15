import { format, subDays } from "date-fns"

async function fetchJson(url) {
	const res = await fetch(url)

	if (!res.ok) {
		console.error(`[${url}] ${res.status} ${res.statusText}`)
		throw new Error()
	}

	return await res.json()
}

const API_BASE_URL = "https://api.npmjs.org/"
const REGISTRY_BASE_URL = "https://registry.npmjs.org/"

const END_DATE = format(new Date(), "yyyy-MM-dd")
const START_DATE = format(subDays(new Date(), 30), "yyyy-MM-dd")

const PAGE_SIZE = 100

/**
 * Gets the number of weekly downloads for an npm package.
 *
 * @param {String} pkg Name of the package published on npm
 * @returns {Number} The number of weekly downloads for the package
 */
export function fetchDownloadsForPackage(pkg) {
	return fetchJson(`${API_BASE_URL}downloads/point/${START_DATE}:${END_DATE}/${pkg}`)
		.then((res) => res.downloads)
		.catch(() => 0)
}

/**
 * Gets details for a package from the npm registry
 *
 * @param {String} pkg Name of the package published to npm
 * @returns {Object} JSON data as returned by the npm registry
 */
export function fetchDetailsForPackage(pkg) {
	return fetchJson(`${REGISTRY_BASE_URL}${pkg}`)
}

/**
 * Searches npm for a specific keyword and returns a map, keyed by package name.
 *
 * @param {String} keyword The keyword used to search npm, ex: `astro-component`
 * @param {String | undefined} ranking The sort order for results, default: `quality`
 * @returns {Map} Map of search results, keyed by package name
 */
export async function searchByKeyword(keyword, ranking = "quality") {
	let objects = []
	let total = -1
	let page = 0

	do {
		const url = new URL(`${REGISTRY_BASE_URL}-/v1/search`)
		url.searchParams.set("text", `keywords:${keyword}`)
		url.searchParams.set("ranking", ranking)
		url.searchParams.set("size", PAGE_SIZE)
		url.searchParams.set("from", page++ * PAGE_SIZE)

		const results = await fetchJson(url.toString())

		// just in case, bail if no objects were returned for the page
		if (results.objects.length === 0) {
			break
		}

		objects.push(...results.objects)
		total = results.total
	} while (total > objects.length)

	return objects
		.filter(({ package: pkg }) => {
			// remove any published forks of official @astrojs integrations
			return (
				pkg.links.repository !== "https://github.com/withastro/astro" ||
				pkg.name.startsWith("@astrojs/")
			)
		})
		.reduce((acc, next) => {
			acc.set(next.package.name, next)
			return acc
		}, new Map())
}
