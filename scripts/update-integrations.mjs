import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import slugify from 'slugify';
import glob from 'tiny-glob';
import * as yaml from 'yaml';
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

async function getIntegrationFiles() {
	return await glob('src/content/integrations/*.md', {
		cwd: path.resolve(fileURLToPath(import.meta.url), '../..'),
	});
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

	const entries = await getIntegrationFiles();

	const existingIntegrations = new Set();
	/** @type {string[]} */
	const deprecatedIntegrations = [];

	// loop through all integrations already published to the catalog
	await Promise.all(
		entries.map(async (entry) => {
			const { data } = matter.read(entry);
			existingIntegrations.add(data.name);

			if (!searchResults.has(data.name)) {
				// the integration was deprecated or removed from NPM
				deprecatedIntegrations.push(data.name);
				fs.rmSync(entry);
			} else {
				// fetch the latest NPM data, keeping any local overrides like description or icon
				// skipping download counts here since existing integrations will be updated
				// automatically in a separate GitHub Action.
				const details = await fetchWithOverrides(data.name, false);
				if (!details) return;

				// check if the homepageurl is valid
				// if not, replace it by the link to the package on npm
				let fixHomepageUrl = false;
				try {
					const response = await fetch(details.homepageUrl, { method: 'HEAD' });
					fixHomepageUrl = response.status >= 400;
				} catch {
					// such an error may occur when the hostname is unknown
					fixHomepageUrl = true;
				}
				if (fixHomepageUrl) {
					details.homepageUrl = `https://www.npmjs.com/package/${data.name}`;
				}

				const frontmatter = yaml.stringify({
					...data,
					...details,
					badges: undefined,
				});

				fs.writeFileSync(
					entry,
					`---
${frontmatter}---\n`,
				);
			}
		}),
	);

	// find new integrations that haven't been published yet
	const newIntegrations = Array.from(searchResults.keys()).filter(
		(pkg) => !existingIntegrations.has(pkg),
	);

	await Promise.all(
		newIntegrations.map(async (entry) => {
			const details = await fetchWithOverrides(entry);
			if (!details) return;

			const frontmatter = yaml.stringify(details);

			const slug = slugify(entry);
			const file = path.resolve(
				path.dirname(fileURLToPath(import.meta.url)),
				`../src/content/integrations/${slug}.md`,
			);

			fs.writeFileSync(
				file,
				`---
${frontmatter}---\n`,
			);
		}),
	);

	updateLastModified();

	// logging in case we need to audit the nightly job
	let stats = `\n--- Update Integrations ---
Updated: ${existingIntegrations.size - deprecatedIntegrations.length} integrations`;

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
	const entries = await getIntegrationFiles();

	for (const entry of entries) {
		const { data } = matter.read(entry);

		// only override NPM download stats for safe updates
		const downloads = await fetchDownloadsForPackage(data.name);

		const frontmatter = yaml.stringify({
			...data,
			downloads,
			badges: undefined,
		});

		fs.writeFileSync(
			entry,
			`---
${frontmatter}---\n`,
		);
	}
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
