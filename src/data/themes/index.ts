import type { ImageMetadata } from '@astrojs/image'
import { z } from 'zod'
import type { Theme } from '../../types.js'
import { ThemeSchema, ThemeTag } from '../../types.js'
import data from '../themes.json'

const imageSchema = z.object({
    src: z.string(),
    alt: z.string()
})

const linkSchema = z.object({
    href: z.string(),
    text: z.string()
})

export const themeDataSchema = z.object({
    title: z.string(),
    description: z.string(),
    fullDescription: z.string().optional(),
    image: imageSchema,
    images: z.array(imageSchema).optional(),
    repoUrl: linkSchema.optional(),
    npmUrl: linkSchema.optional(),
    demoUrl: linkSchema.optional(),
    links: z.array(linkSchema).optional(),
    categories: z.array(z.string()),
    featured: z.number().optional(),
    slug: z.string(),
    stars: z.number().optional(),
    tags: z.array(z.string()).optional()
})
export type ThemeData = z.infer<typeof themeDataSchema>

const allImages = import.meta.glob('./images/*.{png,jpg,jpeg}') as {
    [key: string]: () => Promise<{ default: ImageMetadata }>
}

async function resolveImage(src: string) {
    if (!(src in allImages)) {
        throw new Error(
            `[loadThemes] "${src}" image not found! Does it exist in /src/data/themes/images?`
        )
    }

    const mod = await allImages[src]!()
    return mod.default
}

let allThemes: Promise<Theme[]>
async function loadThemes(): Promise<Theme[]> {
    return Promise.all(
        (data as ThemeData[]).map(async (theme) => {
            if (!(theme.image.src in allImages)) {
                console.log(
                    `[themes] Image for "${theme.title}" not found! Provided: "${theme.image.src}", is there a typo?`
                )
            }

            const images = theme.images || []

            return ThemeSchema.parse({
                ...theme,
                tags: theme.tags as ThemeTag[],
                image: await resolveImage(theme.image.src),
                images: await Promise.all(
                    images.map(({ src }) => resolveImage(src))
                )
            }) as Theme
        })
    )
}

export async function getThemes() {
    if (!allThemes) {
        allThemes = loadThemes()
    }

    return allThemes
}

// collections in this list will always be sorted first
const COLLECTION_PRIORITY = {
    featured: 1,
    official: 2,
    blog: 3,
    'landing-page': 4,
    portfolio: 5,
    docs: 6,
    other: -1 // always pushed to the end
}

export interface Collection {
    text: string
    slug: string
}

export async function getCollections(): Promise<Collection[]> {
    const collectionsMap = new Map<string, number>()

    const themes = await getThemes()

    collectionsMap.set(
        'featured',
        themes.filter(({ featured }) => !!featured).length
    )

    for (const theme of themes) {
        for (const category of theme.categories) {
            collectionsMap.set(
                category,
                (collectionsMap.get(category) ?? 0) + 1
            )
        }
    }

    return Array.from(collectionsMap.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => {
            const aPriority = COLLECTION_PRIORITY[a.category]
            const bPriority = COLLECTION_PRIORITY[b.category]

            if (aPriority >= 0 && bPriority >= 0) {
                return aPriority - bPriority
            } else if (aPriority >= 0 || bPriority === -1) {
                return -1
            } else if (bPriority >= 0 || aPriority === -1) {
                return 1
            } else if (a.count !== b.count) {
                return b.count - a.count
            } else {
                return a.category.localeCompare(b.category)
            }
        })
        .map(({ category }) => ({
            slug: category,
            text: category.replace('+', ' + ').replace('-', ' ')
        }))
}

export const collections = getCollections()

export async function getThemesForCollection(collection: string) {
    const themes = await getThemes()

    return collection === 'featured'
        ? themes
              .filter(({ featured }) => !!featured)
              .sort((a, b) => a.featured! - b.featured!)
        : themes.filter(({ categories }) => categories.indexOf(collection) >= 0)
}
