// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { limitedFetch } from './fetch.mjs';
import {
	badgeForPackage,
	blocklist,
	getCategoriesForKeyword,
	getOverrides,
	getToolbarPackagePriority,
	isNewPackage,
} from './integrations.mjs';
import { markdownToPlainText } from './markdown.mjs';
import { fetchDetailsForPackage, fetchDownloadsForPackage, searchByKeywords } from './npm.mjs';

/** @param {string} pkg */
function isOfficial(pkg) {
	return pkg.startsWith('@astrojs/');
}

/** @param {string} url */
function sanitizeGitHubUrl(url) {
	return url
		.replace('git+', '')
		.replace('.git', '')
		.replace('git:', 'https:')
		.replace('git@github.com:', 'https://github.com/');
}

function updateLastModified() {
	const pathname = path.resolve(
		path.dirname(fileURLToPath(import.meta.url)),
		'../src/data/last-modified.json',
	);
	const json = fs.readFileSync(pathname, { encoding: 'utf8' });
	const data = JSON.parse(json);
	data.integrations = new Date().toUTCString();
	fs.writeFileSync(pathname, JSON.stringify(data, null, '\t'), { encoding: 'utf8' });
}

/**
 * @typedef {NonNullable<Awaited<ReturnType<typeof fetchWithOverrides>>>} IntegrationData
 */

/**
 * @returns {IntegrationData[]}
 */
function getIntegrationsData() {
	try {
		const rawJson = fs.readFileSync('src/content/integrations.json', 'utf-8');
		return JSON.parse(rawJson);
	} catch (error) {
		console.error('Error reading integrations data:', error);
		return [];
	}
}

/**
 * @param {IntegrationData[]} data
 */
function setIntegrationsData(data) {
	// Sort by package name to ensure consistent order and clean git diffs.
	data.sort((a, b) => a.name.localeCompare(b.name));
	fs.writeFileSync('src/content/integrations.json', JSON.stringify(data, null, '\t'), 'utf-8');
}

/**
 * @param {NonNullable<Awaited<ReturnType<typeof fetchDetailsForPackage>>>} data
 * @param {string} pkg
 */
function normalizePackageDetails(data, pkg) {
	const keywordCategories = (data.keywords ?? []).flatMap(getCategoriesForKeyword);

	if (keywordCategories.length === 0) {
		keywordCategories.push('uncategorized');
	}

	const toolbar = getToolbarPackagePriority(pkg);
	const official = isOfficial(pkg);

	const otherCategories = [
		official ? 'official' : undefined,
		toolbar ? 'toolbar' : undefined,
		isNewPackage(data) ? 'recent' : undefined,
	].filter(Boolean);

	const uniqCategories = Array.from(new Set([...keywordCategories, ...otherCategories]));

	const npmUrl = `https://www.npmjs.com/package/${pkg}`;

	const repoUrl = data.repository && sanitizeGitHubUrl(data.repository);

	let homepageUrl = npmUrl;
	// The `homepage` field is user-authored, so sometimes funky values can end up here.
	// This is just a brief sanity check that things looks vaguely like a URL.
	if (data.homepage?.toLowerCase().startsWith('https')) {
		homepageUrl = data.homepage;
	}

	return {
		id: data.name,
		name: data.name,
		title: data.name,
		description: markdownToPlainText(data.description),
		categories: uniqCategories,
		npmUrl,
		repoUrl,
		homepageUrl,
		official: official === true ? true : undefined,
	};
}

/** @param {string} pkg */
async function fetchWithOverrides(pkg, includeDownloads = true) {
	const details = await fetchDetailsForPackage(pkg);
	if (!details) return;
	const integrationOverrides = getOverrides(pkg) || {};

	const badge = badgeForPackage(details);
	const toolbar = getToolbarPackagePriority(pkg);

	return {
		...normalizePackageDetails(details, pkg),
		...integrationOverrides,
		badge,
		toolbar,
		...(includeDownloads ? { downloads: await fetchDownloadsForPackage(pkg) } : {}),
	};
}

async function unsafeUpdateAllIntegrations() {
	const keywords = ['astro-component', 'withastro', 'astro-integration'];

	const packagesMap = await searchByKeywords(keywords);
	const searchResults = new Set([...packagesMap.keys()].filter((pkg) => !blocklist.includes(pkg)));

	const existingEntries = getIntegrationsData();

	const existingPackageNames = new Set();
	/** @type {string[]} */
	const deprecatedIntegrations = [];

	// loop through all integrations already published to the catalog
	const updatedEntries = await Promise.all(
		existingEntries.map(async (data) => {
			existingPackageNames.add(data.name);

			if (!searchResults.has(data.name)) {
				// the integration was deprecated or removed from NPM
				deprecatedIntegrations.push(data.name);
				return null;
			}
			// fetch the latest NPM data, keeping any local overrides like description or icon
			// skipping download counts here since existing integrations will be updated
			// automatically in a separate GitHub Action.
			const updatedData = await fetchWithOverrides(data.name, false);
			if (!updatedData) return data;

			// check if the homepageurl is valid
			// if not, replace it by the link to the package on npm
			let fixHomepageUrl = false;
			try {
				const homepageUrl = new URL(updatedData.homepageUrl);
				if (homepageUrl.hostname === 'www.npmjs.com') {
					fixHomepageUrl = homepageUrl.pathname !== `/package/${data.id}`;
				} else {
					const response = await limitedFetch(updatedData.homepageUrl, { method: 'HEAD' });
					fixHomepageUrl = response.status >= 400;
				}
			} catch {
				// such an error may occur when the hostname is unknown
				fixHomepageUrl = true;
			}
			if (fixHomepageUrl) {
				updatedData.homepageUrl = `https://www.npmjs.com/package/${data.name}`;
			}

			return { ...data, ...updatedData };
		}),
	);

	// find new integrations that haven't been published yet
	const newIntegrations = Array.from(searchResults.keys()).filter(
		(pkg) => !existingPackageNames.has(pkg),
	);

	for (const entry of newIntegrations) {
		const details = await fetchWithOverrides(entry);
		if (details) {
			updatedEntries.push(details);
		}
	}

	setIntegrationsData(updatedEntries.filter((entry) => entry !== null));
	updateLastModified();

	// logging in case we need to audit the nightly job
	let stats = `\n--- Update Integrations ---
Updated: ${existingPackageNames.size - deprecatedIntegrations.length} integrations`;

	if (newIntegrations.length) {
		stats += `\n\nAdded:\n${newIntegrations.map((pkg) => `+ ${pkg}`).join('\n')}`;
	}

	if (deprecatedIntegrations.length) {
		stats += `\n\nRemoved:\n${deprecatedIntegrations.map((pkg) => `- ${pkg}`).join('\n')}`;
	}

	stats += '\n---------------------------';

	console.info(stats);
}

async function safeUpdateExistingIntegrations() {
	const entries = getIntegrationsData();

	for (const entry of entries) {
		// only override NPM download stats for safe updates
		entry.downloads = await fetchDownloadsForPackage(entry.name);
	}

	setIntegrationsData(entries);
}

const args = process.argv.slice(2);

// only fetch unsafe changes like new and deprecated integrations,
// and fix wrong homepageurl (response>=400 or not responding)
// if the --unsafe CLI flag was provided
if (args.includes('--unsafe')) {
	await unsafeUpdateAllIntegrations();
} else {
	await safeUpdateExistingIntegrations();
}
