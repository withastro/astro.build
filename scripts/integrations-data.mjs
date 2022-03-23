import { readFileSync } from 'fs'

const integrations = JSON.parse(
	readFileSync(new URL('./integrations.json', import.meta.url))
)

const keywordToCategories = Object.entries(integrations.categories).reduce(
	(acc, [key, value]) => {
		const { keywords } = value

		for (const keyword of keywords) {
			const set = acc.has(keyword) ? acc.get(keyword) : new Set()
			set.add(key)
			acc.set(keyword, set)
		}

		return acc
	},
	new Map()
)

/**
 * Gets the overridden integration properties for an npm package, or undefined if not found.
 *
 * @param {String} packageName Name of the NPM package
 * @returns {Partial<AppendMode.Integration> | undefined}
 */
export function getOverrides(packageName) {
	return packageName in integrations.overrides
		? integrations.overrides[packageName]
		: undefined
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

	return categories.length ? categories : ['css+ui']
}
