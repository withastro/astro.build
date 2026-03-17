// @ts-check

import { z } from 'astro/zod';
import { format, subDays } from 'date-fns';
import { limitedFetch } from './fetch.mjs';

/**
 * @param {string | URL} url
 */
async function fetchJson(url) {
	const res = await limitedFetch(url);
	return await res.json();
}

const API_BASE_URL = 'https://api.npmjs.org/';
const REGISTRY_BASE_URL = 'https://registry.npmjs.org/';

const END_DATE = format(new Date(), 'yyyy-MM-dd');
const START_DATE = format(subDays(new Date(), 30), 'yyyy-MM-dd');

const PAGE_SIZE = 100;

/**
 * Gets the number of weekly downloads for an npm package.
 *
 * @param {string} pkg Name of the package published on npm
 * @returns {Promise<number>} The number of weekly downloads for the package
 */
export async function fetchDownloadsForPackage(pkg) {
	return fetchJson(`${API_BASE_URL}downloads/point/${START_DATE}:${END_DATE}/${pkg}`)
		.then((res) => res.downloads)
		.catch(() => 0);
}

const npmRegistrySchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	homepage: z.url().optional(),
	keywords: z.string().array().default([]),
	repository: z
		.union([
			z.string(),
			// If the package.json’s repo field is an object, convert it to a string:
			z.object({ url: z.string() }).transform(({ url }) => url),
		])
		.optional(),
	time: z.object({ created: z.string(), modified: z.string() }),
});

const npmSearchObjectSchema = z
	.object({
		downloads: z.object({ monthly: z.number() }),
		package: z.object({
			name: z.string(),
			description: z.string().optional(),
			keywords: z.string().array().default([]),
			links: z.object({
				homepage: z.string().optional(),
				repository: z.string().optional(),
			}),
			/** Date the latest version was published */
			date: z.string(),
		}),
	})
	// Transform the data into the same shape returned by the single package endpoint.
	.transform((data) => ({
		name: data.package.name,
		description: data.package.description,
		homepage: data.package.links.homepage,
		keywords: data.package.keywords,
		repository: data.package.links.repository,
		time: { modified: data.package.date },
		downloads: data.downloads.monthly,
	}));

/**
 * Gets details for a package from the npm registry
 *
 * @param {string} pkg Name of the package published to npm
 * @returns JSON data as returned by the npm registry
 */
export async function fetchDetailsForPackage(pkg) {
	const registryData = await fetchJson(`${REGISTRY_BASE_URL}${pkg}`);
	const result = npmRegistrySchema.safeParse(registryData);
	if (result.success) {
		return result.data;
	}
	const { message, path } = result.error.issues[0];
	console.error(`Failed to parse metadata for "${pkg}": ${message} at ${path.join('.')}`);
	return;
}

/**
 * Searches npm for a specific keyword and returns a map, keyed by package name.
 *
 * @param {string[]} keywords The keywords used to search npm, ex: `astro-component`
 * @param {string | undefined} ranking The sort order for results, default: `quality`
 * @returns Map of search results, keyed by package name
 */
export async function searchByKeywords(keywords, ranking = 'quality') {
	const objects = [];

	for (const keyword of keywords) {
		const keywordObjects = [];
		let total = -1;
		let page = 0;

		do {
			const url = new URL(`${REGISTRY_BASE_URL}-/v1/search`);
			url.searchParams.set('text', `keywords:${keyword}`);
			url.searchParams.set('ranking', ranking);
			url.searchParams.set('size', String(PAGE_SIZE));
			url.searchParams.set('from', String(page++ * PAGE_SIZE));

			const results = await fetchJson(url.toString());

			// just in case, bail if no objects were returned for the page
			if (results.objects.length === 0) {
				break;
			}

			keywordObjects.push(...results.objects);
			total = results.total;
		} while (total > keywordObjects.length);

		objects.push(...keywordObjects);
	}

	return z
		.array(npmSearchObjectSchema)
		.parse(objects)
		.filter(({ repository, name }) => {
			// remove any published forks of official @astrojs integrations
			return repository !== 'https://github.com/withastro/astro' || name.startsWith('@astrojs/');
		});
}
