import { contains } from '../utils/contains'
import { uniq } from '../utils/uniq'

interface ShowcaseSiteData {
	title: string
	image: string
    url: string
}

export interface Collection {
	text: string
	slug: string
}

let _loadShowcase: Promise<App.ShowcaseSite[]>
async function loadShowcase(): Promise<App.ShowcaseSite[]> {
	const items = import.meta.globEager<{ [slug: string]: ShowcaseSiteData }>(
		'./showcase/*.json'
	)

	return Object.keys(items)
		.map(slug => {
			const site = items[slug].default

			return {
				...site,
				slug,
                image: {
                    src: site.image,
                    alt: site.title,
                },
				url: {
					href: site.url,
					text: site.title,
				},
			}
		})
		.sort(() => 0.5 - Math.random())
}

export async function fetchShowcase() {
	_loadShowcase = _loadShowcase || loadShowcase()
	return _loadShowcase
}

export async function fetchSitesForCollection(collection: string) {
	const allSites = await fetchShowcase()

	const containsCollection = contains(collection)

	return allSites.filter(site => containsCollection(site.categories))
}

export async function fetchCollections(): Promise<Collection[]> {
	const sites = await fetchShowcase()

	const collectionsMap = new Map<string, number>()

	for (const site of sites) {
		for (const category of site.categories) {
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
