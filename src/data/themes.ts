import themes from './themes.json'

// collections in this list will always be sorted first
const COLLECTION_PRIORITY = {
	'featured': 1,
	'official': 2,
	'other': -1 // always pushed to the end
}

export interface Collection {
	text: string
	slug: string
}

export function getCollections(): Collection[] {
	const collectionsMap = new Map<string, number>()

	for (const theme of themes) {
		for (const category of theme.categories) {
			if (collectionsMap.has(category)) {
				collectionsMap.set(category, collectionsMap.get(category) + 1)
			} else {
				collectionsMap.set(category, 1)
			}
		}
	}

	return Array.from(collectionsMap.entries())
		.map(([category, count]) => ({ category, count }))
		.sort((a, b) => {
			const aPriority = COLLECTION_PRIORITY[a.category]
			const bPriority = COLLECTION_PRIORITY[b.category]

			if (aPriority >= 0 && bPriority >=0) {
				return aPriority - bPriority
			} else if (aPriority >= 0 || bPriority === -1) {
				return -1
			} else if (bPriority >= 0 || aPriority === -1) {
				return 1
			} else if (a.count !== b.count) {
				return b.count - a.count
			} else {
				return a.category.localeCompare(b.category)
			}
		})
		.map(({ category }) => ({
			slug: category,
			text: category.replace('+', ' + ')
		}))
}

export const collections = getCollections()

export function getThemesForCollection(collection: string) {
	return themes.filter(({ categories }) => categories.indexOf(collection) >= 0)
}
