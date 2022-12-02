import { z } from 'astro:content'
import { Person } from '../../types.js'

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

export function getAuthor(id: string): Person | Error {
    const authorMod = authors[toJsonPath(id)]
    if (!authorMod) return new Error(`Author ${JSON.stringify(id)} not found.`)
    const parsedAuthor = z
        .object({
            name: z.string(),
            image: z.string(),
            twitter: z.string().optional()
        })
        .safeParse(authorMod)
    if (!parsedAuthor.success) {
        return new Error(
            `Author ${JSON.stringify(id)} has invalid JSON. Full error: ${
                parsedAuthor.error
            }`
        )
    }
    const author = parsedAuthor.data
    const { default: image } = images[author.image] as {
        default: any
    }
    return {
        image,
        name: author.name,
        twitter: author.twitter
    }
}
