import { format, subDays } from 'date-fns'

const END_DATE = format(new Date(), 'yyyy-MM-dd')
const START_DATE = format(subDays(new Date(), 7), 'yyyy-MM-dd')

// https://api.npmjs.org/search?text=keywords%3Aastro-component&ranking=quality
const API_URL = 'https://api.npmjs.org/'
const DOWNLOADS_URL = `${API_URL}downloads/point/${START_DATE}:${END_DATE}/`
const SEARCH_URL = `${API_URL}search?text=keywords%3A{keyword}&ranking=quality`

const REGISTRY_URL = 'https://registry.npmjs.org/'

const formatter = Intl.NumberFormat('en', { notation: 'compact' })

const downloadsMap = new Map<string, Promise<string>>()

export async function getDownloadsForPackage(pkg: string) {
	if (downloadsMap.has(pkg)) {
		return downloadsMap.get(pkg)
	}

	const downloads = fetch(`${DOWNLOADS_URL}${pkg}`)
		.then(res => res.json())
		.then(res => formatter.format(res.downloads))
		.catch(err => {
			console.error('getDownloadsForPackage', err)
			return undefined
		})

	downloadsMap.set(pkg, downloads)

	return await downloads
}

const detailsMap = new Map<string, Promise<App.Integration>>()
export async function getDetailsForPackage(
	pkg: string
): Promise<App.Integration> {
	if (detailsMap.has(pkg)) {
		return detailsMap.get(pkg)
	}

	const details = fetch(`${REGISTRY_URL}${pkg}`)
		.then(res => res.json())
		.then(res => {
			return {
				slug: res.name,
				title: res.name,
				description: res.description,
				repoUrl: {
					href: res.repository.url.replace('git+', '').replace('.git', ''),
					text: 'View source code',
				},
				npmUrl: {
					href: `https://www.npmjs.com/package/${pkg}`,
					text: 'View on NPM',
				},
				url: {
					href: res.homepage,
					text: 'View homepage',
				},
			}
		})
		.catch(err => {
			console.error('getDetailsForPackage', err)
			return undefined
		})

	detailsMap.set(pkg, details)

	return await details
}

const keywordsMap = new Map<string, Promise<App.Integration>>()
export async function searchByKeyword(keyword: string = 'astro-component') {
	if (keywordsMap.has(keyword)) {
		return keywordsMap.get(keyword)
	}

	const results = fetch(SEARCH_URL.replace('{keyword}', keyword))
		.then(res => res.json())
		.then(({ objects }) =>
			objects.map(({ package: pkg }) => {
				return {
					slug: pkg.name,
					title: pkg.name,
					description: pkg.description,
					repoUrl: {
						href: pkg.links.repository,
						text: 'View source code',
					},
					npmUrl: {
						href: pkg.links.npm,
						text: 'View on NPM',
					},
					url: {
						href: pkg.links.homepage,
						text: 'View homepage',
					},
				}
			})
		)
		.catch(err => {
			console.error('searchByKeyword', err)
			return []
		})

	keywordsMap.set(keyword, results)

	return await results
}
