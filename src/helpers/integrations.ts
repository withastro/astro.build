import { getCollection, type CollectionEntry } from "astro:content"
import { IntegrationCategories } from "~/content/config.js"
import type { MapKeys } from "./types.ts"

export interface IntegrationOptions {
	search?: string | null
	categories?: MapKeys<typeof IntegrationCategories> | null
	toolbar?: boolean
}

export async function getFilteredIntegrations(options: IntegrationOptions = {}) {
	const { categories: selectedCategories = [], toolbar = false, search } = options
	const searchRegex = search && new RegExp(search, "i")
	function integrationsFilter(integration: CollectionEntry<"integrations">) {
		// Overlay doesn't support categories or search (for now)
		if (toolbar) {
			return integration.data.toolbar !== undefined
		}
		// if at least one category filter is applied, hide integrations that don't match
		if (selectedCategories && selectedCategories.length > 0) {
			if (
				!integration.data.categories.some((c) =>
					selectedCategories.includes(c as MapKeys<typeof IntegrationCategories>[number]),
				)
			) {
				return false
			}
		}

		// if a search term was used, filter down checking name/title/description
		if (searchRegex) {
			return (
				searchRegex.test(integration.data.name) ||
				searchRegex.test(integration.data.title) ||
				(integration.data.description && searchRegex.test(integration.data.description))
			)
		}

		return true
	}

	// get integrations, filtered by the applied search & filter, then sort the matches
	return await getCollection("integrations", integrationsFilter).then((entries) =>
		entries.sort(sortIntegrations),
	)
}

export const validCategories = Array.from(IntegrationCategories.keys())

export function validateCategories(
	selectedCategories: string[],
): selectedCategories is MapKeys<typeof IntegrationCategories> {
	for (const selectedCategory of selectedCategories) {
		if (
			!validCategories.includes(selectedCategory as MapKeys<typeof IntegrationCategories>[number])
		) {
			return false
		}
	}
	return true
}

// Sorting priority: featured first, then compare downloads, then sort alphabetically
function sortIntegrations(a: CollectionEntry<"integrations">, b: CollectionEntry<"integrations">) {
	if (a.data.featured && b.data.featured) {
		return a.data.featured - b.data.featured
	}

	if (a.data.featured && !b.data.featured) {
		return -1
	}

	if (!a.data.featured && b.data.featured) {
		return 1
	}

	if (a.data.downloads === b.data.downloads) {
		return b.data.name.localeCompare(a.data.name)
	}

	return b.data.downloads - a.data.downloads
}
