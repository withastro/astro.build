import fetch from 'node-fetch'
import { format, subDays } from 'date-fns'

function fetchJson(url) {
	return fetch(url).then(res => res.json())
}

const API_BASE_URL = 'https://api.npmjs.org/'
const REGISTRY_BASE_URL = 'https://registry.npmjs.org/'

const END_DATE = format(new Date(), 'yyyy-MM-dd')
const START_DATE = format(subDays(new Date(), 7), 'yyyy-MM-dd')

/**
 * Gets the number of weekly downloads for an npm package.
 *
 * @param {String} pkg Name of the package published on npm
 * @returns {Number} The number of weekly downloads for the package
 */
export function fetchDownloadsForPackage(pkg) {
	return fetchJson(
		`${API_BASE_URL}downloads/point/${START_DATE}:${END_DATE}/${pkg}`
	).then(res => res.downloads)
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
export async function searchByKeyword(keyword, ranking = 'quality') {
	const url = new URL(`${REGISTRY_BASE_URL}-/v1/search`)
	url.searchParams.set('text', `keywords:${keyword}`)
	url.searchParams.set('ranking', ranking)
	url.searchParams.set('size', '100')

	// TODO: add paging support

	const { objects, total } = await fetchJson(url.toString())

	return objects.reduce((acc, next) => {
		acc.set(next.package.name, next)
		return acc
	}, new Map())
}
