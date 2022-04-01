import { contains } from '../utils/contains'
import { uniq } from '../utils/uniq'

interface ThemeData {
	title: string
	description: string
	image: string
	categories: string[]
	tags?: App.ThemeTag[]
	repoUrl: string
	npmUrl?: string
	demoUrl?: string
	official?: boolean
}

export interface Collection {
	text: string
	slug: string
}

let _loadThemes: Promise<App.Theme[]>
async function loadThemes(): Promise<App.Theme[]> {
	const items = import.meta.globEager<{ [slug: string]: ThemeData }>(
		'./themes/*.json'
	)

	return Object.keys(items)
		.map(slug => {
			const theme = items[slug].default

			return {
				...theme,
				slug,
				image: {
					src: theme.image,
					alt: theme.description,
				},
				tags: theme.tags || [],
				repoUrl: {
					href: theme.repoUrl,
					text: theme.title,
				},
				npmUrl: theme.npmUrl && {
					href: theme.npmUrl,
					text: theme.title,
				},
				demoUrl: theme.demoUrl && {
					href: theme.demoUrl,
					text: theme.title,
				},
			}
		})
		.sort(() => 0.5 - Math.random())
}

export async function fetchThemes() {
	_loadThemes = _loadThemes || loadThemes()
	return _loadThemes
}

export async function fetchThemesForCollection(collection: string) {
	const allThemes = await fetchThemes()

	const containsCollection = contains(collection)

	return allThemes.filter(theme => containsCollection(theme.categories))
}

export async function fetchCollections(): Promise<Collection[]> {
	const themes = await fetchThemes()

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
			text: category.replace('+', ' + '),
		}))
}
