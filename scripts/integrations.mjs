import { readFileSync } from 'fs'
import { differenceInDays } from 'date-fns'

const NEW_THRESHOLD_DAYS = 14

const integrations = JSON.parse(
    readFileSync(new URL('./integrations.json', import.meta.url))
)

const keywordToCategories = Object.entries(integrations.categories).reduce(
    (acc, [key, value]) => {
        const { keywords = [] } = value

        for (const keyword of keywords) {
            const set = acc.has(keyword) ? acc.get(keyword) : new Set()
            set.add(key)
            acc.set(keyword, set)
        }

        return acc
    },
    new Map()
)

function isNewPackage(pkg) {
    if (!pkg.time?.created) {
        return false
    }

    const date = new Date(pkg.time.created)
    const today = new Date()
    return differenceInDays(today, date) <= NEW_THRESHOLD_DAYS
}

export const whitelist = integrations.whitelist
export const blacklist = integrations.blacklist

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

export function badgesForPackage(pkg) {
    const badges = new Set()

    if (integrations.featured.includes(pkg.name)) {
        badges.add('featured')
    }

    if (isNewPackage(pkg)) {
        badges.add('new')
    }

    return Array.from(badges)
}

export function getFeaturedPackagePriority(pkg) {
    const index = integrations.featured.indexOf(pkg) + 1
    return index > 0 ? index : undefined
}
