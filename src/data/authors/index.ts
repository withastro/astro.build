import { z } from 'astro:content'
import { ImageSchema, Person } from '../../types.js'

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

export function getAuthor(id: string): Person {
    const authorMod = authors[toJsonPath(id)]
    if (!authorMod) throw new Error(`Author ${JSON.stringify(id)} not found.`)
    const parsedAuthor = z
        .object({
            name: z.string(),
            image: z.string(),
            twitter: z.string().optional()
        })
        .safeParse(authorMod)
    if (!parsedAuthor.success) {
        throw new Error(
            `Author ${JSON.stringify(id)} has invalid JSON. Full error: ${
                parsedAuthor.error
            }`
        )
    }
    const author = parsedAuthor.data
    const parsedImage = ImageSchema.safeParse({
        src: (images[author.image] as any)?.default,
        alt: author.name
    })
    if (!parsedImage.success) {
        throw new Error(
            `Author ${JSON.stringify(id)} has invalid image. Full error: ${
                parsedImage.error
            }`
        )
    }
    return {
        image: parsedImage.data,
        name: author.name,
        twitter: author.twitter
    }
}
