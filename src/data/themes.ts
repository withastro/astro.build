import themes from './themes.json'

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
		.sort((a, b) => 
			b.count === a.count
				? a.category.localeCompare(b.category)
				: b.count - a.count
		)
		.map(({ category }) => ({
			slug: category,
			text: category.replace('+', ' + ')
		}))
}

export const collections = getCollections()

export function getThemesForCollection(collection: string) {
	return themes.filter(({ categories }) => categories.indexOf(collection) >= 0)
}
