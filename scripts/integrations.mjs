import { differenceInDays } from "date-fns"
import integrations from "./integrations.json" assert { type: "json" }

const NEW_THRESHOLD_DAYS = 14

const KEYWORD_CATEGORIES = {
	accessibility: {
		keywords: ["a11y", "accessibility"],
	},
	adapters: {
		keywords: ["astro-adapter"],
	},
	analytics: {
		keywords: ["analytics"],
	},
	"css+ui": {
		keywords: ["css", "ui", "icon", "icons", "renderer"],
	},
	frameworks: {
		keywords: ["renderer"],
	},
	"performance+seo": {
		keywords: ["seo", "performance", "perf", "optimization"],
	},
}

const FEATURED = [
	"@astrojs/tailwind",
	"astro-imagetools",
	"@astrojs/partytown",
	"astro-compress",
	"@storyblok/astro",
	"astro-icon",
	"astro-eleventy-img",
	"@astrojs/sitemap",
	"astro-robots-txt",
	"astro-seo",
	"astro-xelement",
	"@astrojs/image",
	"astro-spa",
	"astro-katex",
	"@astrojs/mdx",
	"accessible-astro-components",
	"astro-i18next",
	"@astropub/icons",
	"astro-json-element",
]

const keywordToCategories = Object.entries(KEYWORD_CATEGORIES).reduce((acc, [key, value]) => {
	const { keywords = [] } = value

	for (const keyword of keywords) {
		const set = acc.has(keyword) ? acc.get(keyword) : new Set()
		set.add(key)
		acc.set(keyword, set)
	}

	return acc
}, new Map())

function isNewPackage(pkg) {
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

export function badgesForPackage(pkg) {
	const badges = new Set()

	if (FEATURED.includes(pkg.name)) {
		badges.add("featured")
	}

	if (isNewPackage(pkg)) {
		badges.add("new")
	}

	return Array.from(badges)
}

export function getFeaturedPackagePriority(pkg) {
	const index = FEATURED.indexOf(pkg) + 1
	return index > 0 ? index : undefined
}
