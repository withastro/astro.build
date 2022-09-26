import type { ShowcaseSite } from '../../types.js'

const allImages: { [key: string]: () => Promise<{ default: ImageMetadata }> } =
    import.meta.glob('./images/*.{png,jpg,jpeg}')

interface ShowcaseSiteData {
    title: string
    image: string
    url: string
    featured?: number
    highlight?: boolean
}

export interface Collection {
    text: string
    slug: string
}

let _loadShowcase: Promise<ShowcaseSite[]>
async function loadShowcase(): Promise<ShowcaseSite[]> {
    const data: { [slug: string]: { default: ShowcaseSiteData } } =
        import.meta.globEager<{ [slug: string]: ShowcaseSiteData }>('./*.json')

    const items = await Promise.all(
        Object.entries(data).map(async ([slug, { default: site }]) => {
            if (!(site.image in allImages)) {
                console.log(`[showcase] Image for "${site.title}" not found! Provided: "${site.image}", is there a typo?`)
            }

            const { default: image } = await allImages[site.image]()

            return {
                ...site,
                slug,
                image,
                url: {
                    href: site.url,
                    text: site.title
                }
            }
        })
    )

    return items.sort((a, b) => {
        // prioritize featured sites
        if (a.featured && !b.featured) {
            return -1
        } else if (b.featured && !a.featured) {
            return 1
        } else if (a.featured && b.featured) {
            return a.featured - b.featured
        }

        return 0.5 - Math.random()
    })
}

export async function getShowcase() {
    _loadShowcase = _loadShowcase || loadShowcase()
    return _loadShowcase
}
