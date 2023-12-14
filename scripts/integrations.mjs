import { differenceInDays } from "date-fns"
import integrations from "./integrations.json" assert { type: "json" }

const NEW_THRESHOLD_DAYS = 28

const keywordToCategories = Object.entries(integrations.categories).reduce((acc, [key, value]) => {
	const { keywords = [] } = value

	for (const keyword of keywords) {
		const set = acc.has(keyword) ? acc.get(keyword) : new Set()
		set.add(key)
		acc.set(keyword, set)
	}

	return acc
}, new Map())

export function isNewPackage(pkg) {
	if (!pkg.time?.created) {
		return false
	}

	const date = new Date(pkg.time.created)
	const today = new Date()
	return differenceInDays(today, date) <= NEW_THRESHOLD_DAYS
}

export const allowlist = integrations.allowlist
export const blocklist = integrations.blocklist

/**
 * Gets the overridden integration properties for an npm package, or undefined if not found.
 *
 * @param {String} packageName Name of the NPM package
 * @returns {Partial<AppendMode.Integration> | undefined}
 */
export function getOverrides(packageName) {
	return packageName in integrations.overrides ? integrations.overrides[packageName] : undefined
}

/**
 * Gets a list of integration categories for an npm keyword.
 *
 * @param {String} keyword NPM package keyword
 * @returns {String[]}
 */
export function getCategoriesForKeyword(keyword) {
	const categories = keywordToCategories.has(keyword)
		? Array.from(keywordToCategories.get(keyword))
		: []

	return categories.length ? categories : ["css+ui"]
}

export function badgeForPackage(pkg) {
	if (isNewPackage(pkg)) {
		return "new"
	}

	return undefined
}

export function getFeaturedPackagePriority(pkg) {
	const index = integrations.featured.indexOf(pkg) + 1
	return index > 0 ? index : undefined
}

export function getToolbarPackagePriority(pkg) {
	const index = integrations.toolbar.indexOf(pkg) + 1
	return index > 0 ? index : undefined
}
