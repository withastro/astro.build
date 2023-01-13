import { z } from 'astro:content'
import { ImageSchema, Person, PersonSchema } from '../../types.js'

export const authors = import.meta.glob('./*.json', { eager: true })
export const images = import.meta.glob('./*{png,jpg,jpeg}', { eager: true })

const jsonBase = './'
const jsonExt = '.json'

export function toJsonSlug(key: string) {
    return key.replace(jsonBase, '').replace(jsonExt, '')
}
function toJsonPath(key: string) {
    return `${jsonBase}${key}${jsonExt}`
}

const cache = new Map<string, Person>()
export function getAuthor(id: string): Person {
    if (cache.has(id)) return cache.get(id)!

    const authorMod = authors[toJsonPath(id)]
    if (!authorMod) throw new Error(`Author ${JSON.stringify(id)} not found.`)
    const parsedAuthor = PersonSchema.extend({ image: z.string() }).safeParse(
        authorMod
    )
    if (!parsedAuthor.success) {
        throw new Error(
            `Author ${JSON.stringify(id)} has invalid JSON. Full error: ${
                parsedAuthor.error
            }`
        )
    }
    const author = parsedAuthor.data
    const image = images[author.image] as { default: any }
    if (!image) {
        throw new Error(`Image ${JSON.stringify(author.image)} not found.`)
    }
    const parsedImage = ImageSchema.safeParse({
        src: image.default,
        alt: author.name
    })
    if (!parsedImage.success) {
        throw new Error(
            `Author ${JSON.stringify(id)} has invalid image. Full error: ${
                parsedImage.error
            }`
        )
    }
    const person: Person = {
        image: parsedImage.data,
        name: author.name,
        twitter: author.twitter
    }
    cache.set(id, person)
    return person
}
