import type { ImageMetadata } from '@astrojs/image/dist/vite-plugin-astro-image.js'
import { z } from 'zod'
import data from '../themes.json'
import { Link, Theme, ThemeSchema, ThemeTag } from '../../types.js'

interface ThemeData {
    title: string
    description: string
    fullDescription?: string
    image: { src: string; alt: string; }
    images?: { src: string; alt: string; }[]
    repoUrl: Link
    npmUrl?: Link
    demoUrl?: Link
    links?: Link[]
    categories: string[]
    featured?: number
    slug: string
    stars: number
    tags?: string[]
}

const allImages = import.meta.glob('./images/*.{png,jpg,jpeg}') as { [key: string]: () => Promise<{ default: ImageMetadata }> }

async function resolveImage(src: string) {
    if (!(src in allImages)) {
        throw new Error(`[loadThemes] "${src}" image not found! Does it exist in /src/data/themes/images?`)
    }

    const mod = await allImages[src]()

    return mod.default
}

let allThemes: Promise<Theme[]>
async function loadThemes(): Promise<Theme[]> {
    return Promise.all(
        (data as ThemeData[]).map(async (theme) => {
            if (!(theme.image.src in allImages)) {
                console.log(`[themes] Image for "${theme.title}" not found! Provided: "${theme.image.src}", is there a typo?`)
            }
            
            const images = theme.images || []

            const test = ThemeSchema.passthrough().safeParse({
                ...theme,
                tags: theme.tags as ThemeTag[],
                image: await resolveImage(theme.image.src),
                images: await Promise.all(images.map(({ src }) => resolveImage(src)))
            })

            if (!test.success) {
                console.log(theme.slug, test)
            }

            return ThemeSchema.passthrough().parse({
                ...theme,
                tags: theme.tags as ThemeTag[],
                image: await resolveImage(theme.image.src),
                images: await Promise.all(images.map(({ src }) => resolveImage(src)))
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
            if (collectionsMap.has(category)) {
                collectionsMap.set(category, collectionsMap.get(category) + 1)
            } else {
                collectionsMap.set(category, 1)
            }
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
            text: category.replace('+', ' + ')
        }))
}

export const collections = getCollections()

export async function getThemesForCollection(collection: string) {
    const themes = await getThemes()

    return collection === 'featured'
        ? themes
              .filter(({ featured }) => !!featured)
              .sort((a, b) => a.featured - b.featured)
        : themes.filter(({ categories }) => categories.indexOf(collection) >= 0)
}
