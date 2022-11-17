import { Person, PersonSchema } from '../../types.js'

interface Author {
    name: string
    title: string
    image: string
    twitter?: string
}

const allAuthors = import.meta.glob('./*.json')
const allImages = import.meta.glob('./*{png,jpg,jpeg}')

const cache = new Map<string, Person>()

export async function getAuthor(id: string): Promise<Person | undefined> {
    if (cache.has(id)) {
        return cache.get(id)
    }

    const key = `./${id}.json`

    if (!(key in allAuthors)) {
        return undefined
    }

    const mod = (await allAuthors[key]()) as { default: Author }

    if (!mod?.default) {
        return undefined
    }

    const imageMod = (await allImages[mod.default.image]()) as { default: any }

    const author = PersonSchema.parse({
        ...mod.default,
        image: {
            src: imageMod.default,
            alt: mod.default.name
        }
    }) as Person

    cache.set(id, author)
    return author
}
