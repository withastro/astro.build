import { contains } from '../utils/contains'
import { uniq } from '../utils/uniq'

interface ShowcaseData {
	title: string
	image: string
    url: string
}

let _loadShowcase: Promise<App.Showcase[]>
async function loadShowcase(): Promise<App.Showcase[]> {
	const items = import.meta.globEager<{ [slug: string]: ShowcaseData }>(
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
