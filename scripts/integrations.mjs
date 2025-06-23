// @ts-check

import { differenceInDays } from 'date-fns';
import integrations from './integrations.json' with { type: 'json' };

const NEW_THRESHOLD_DAYS = 28;

const keywordToCategories = Object.entries(integrations.categories).reduce(
	(acc, [key, value]) => {
		const { keywords = [] } = value;

		for (const keyword of keywords) {
			const set = acc.get(keyword) || new Set();
			set.add(key);
			acc.set(keyword, set);
		}

		return acc;
	},
	/** @type {Map<string, Set<string>>} */ (new Map()),
);

/** @param {{ time?: { created: string } }} pkg  */
export function isNewPackage(pkg) {
	if (!pkg.time?.created) {
		return false;
	}

	const date = new Date(pkg.time.created);
	const today = new Date();
	return differenceInDays(today, date) <= NEW_THRESHOLD_DAYS;
}

export const blocklist = integrations.blocklist;

/**
 * Gets the overridden integration properties for an npm package, or undefined if not found.
 *
 * @param {string} packageName Name of the NPM package
 * @returns {undefined | { image?: string; description?: string; repoUrl?: string; homepageUrl?: string; categories?: string[] }}
 */
export function getOverrides(packageName) {
	return packageName in integrations.overrides
		? integrations.overrides[/** @type {keyof typeof integrations.overrides} */ (packageName)]
		: undefined;
}

/**
 * Gets a list of integration categories for an npm keyword.
 *
 * @param {string} keyword NPM package keyword
 * @returns {string[]}
 */
export function getCategoriesForKeyword(keyword) {
	return [...(keywordToCategories.get(keyword) || [])];
}

/** @param {Parameters<typeof isNewPackage>[0]} pkg */
export function badgeForPackage(pkg) {
	if (isNewPackage(pkg)) {
		return 'new';
	}

	return undefined;
}

/** @param {string} pkg */
export function getToolbarPackagePriority(pkg) {
	const index = integrations.toolbar.indexOf(pkg) + 1;
	return index > 0 ? index : undefined;
}
