import data from '../sponsors.json'
import type { Sponsor } from '../../types'

interface SponsorData {
    id: number
    name: string
    image?: string
    initials: string
    href?: string
}

const allImages: { [key: string]: () => Promise<{ default: ImageMetadata }> } =
    import.meta.glob('./images/*.{png,jpg,jpeg}')

let _loadSponsors: Promise<Sponsor[]>
async function loadSponsors() {
    const { members } = data

    return await Promise.all(members.map(async (sponsor: SponsorData) => {
        if (!sponsor.image) { return sponsor as unknown as Sponsor }

        const imageMod = await allImages[sponsor.image]()

        return {
            ...sponsor,
            image: imageMod.default
        } as Sponsor
    }))
}

export async function getSponsors() {
    if (!_loadSponsors) {
        _loadSponsors = loadSponsors()
    }

    return _loadSponsors
}
