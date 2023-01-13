import { defineCollection, z } from 'astro:content'
import social from '../assets/social.png'
import { authors, toJsonSlug } from '../data/authors'

type ArrayWithAtLeastOneEl = [string, ...string[]]
const validAuthors = Object.keys(authors).map(
    toJsonSlug
) as ArrayWithAtLeastOneEl

const blog = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        publishDate: z
            .string()
            .or(z.date())
            .transform((val) => new Date(val)),
        authors: z.array(z.enum(validAuthors)),
        socialImage: z.string().optional().default(social.src),
        coverImage: z.string().optional(),
        lang: z.enum(['en']).default('en')
    })
})

export const collections = { blog }
