import { defineCollection, z } from 'astro:content'
import social from '../assets/social.png'
import { authors, getAuthor, toJsonSlug } from '../data/authors'
import { Person } from '../types'

type ArrayWithAtLeastOneEl = [string, ...string[]]
const validAuthors = Object.keys(authors).map(
    toJsonSlug
) as ArrayWithAtLeastOneEl

const blog = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        publishDate: z.string().transform((str) => new Date(str)),
        authors: z
            .array(z.enum(validAuthors))
            .transform(async (authors): Promise<Person[]> => {
                return authors.map((id) => {
                    const author = getAuthor(id)
                    if (author instanceof Error) throw author
                    return author
                })
            }),
        socialImage: z.string().optional().default(social.src),
        coverImage: z.string().optional(),
        lang: z.enum(['en']).default('en')
    })
})

export const collections = { blog }
