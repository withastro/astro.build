// @ts-check

import { z } from 'astro/zod';
import { limitedFetch } from './fetch.mjs';

/**
 * @param {string | URL} url
 */
async function fetchJson(url) {
	const res = await limitedFetch(url);
	return await res.json();
}

const REGISTRY_BASE_URL = 'https://registry.npmjs.org/';
const PAGE_SIZE = 100;

const npmRegistrySchema = z.object({
	time: z.object({ created: z.string() }),
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
		}),
	})
	// Transform the data into the same shape returned by the single package endpoint.
	.transform((data) => ({
		name: data.package.name,
		description: data.package.description,
		homepage: data.package.links.homepage,
		keywords: data.package.keywords,
		repository: data.package.links.repository,
		downloads: data.downloads.monthly,
	}));

/**
 * Gets details for a package from the npm registry
 *
 * @param {string} pkg Name of the package published to npm
 * @returns JSON data as returned by the npm registry
 */
export async function fetchPackageCreationTime(pkg) {
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
