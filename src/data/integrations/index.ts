import data from '../integrations.json'
import type { Integration } from '../../types.js'

// collections in this list will always be sorted first
const COLLECTION_PRIORITY = {
    featured: 1,
    official: 2,
    frameworks: 3,
    adapters: 4,
    other: -1 // always pushed to the end
}

let integrations: Promise<Integration[]>
async function loadIntegrations() {
    return data as Integration[]
}

async function getIntegrations() {
    if (!integrations) {
        integrations = loadIntegrations()
    }

    return integrations
}

export interface Collection {
    text: string
    slug: string
}

async function loadCollections(): Promise<Collection[]> {
    const integrations = await getIntegrations()
    const collectionsMap = new Map<string, number>()

    collectionsMap.set(
        'featured',
        integrations.filter(({ featured }) => !!featured).length
    )

    for (const integration of integrations) {
        for (const category of integration.categories) {
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

let collections: Promise<Collection[]>
export function getCollections() {
    if (!collections) {
        collections = loadCollections()
    }
    return collections
}

export async function getIntegrationsForCollection(collection: string) {
    const integrations = await getIntegrations()

    return collection === 'featured'
        ? integrations
              .filter(({ featured }) => !!featured)
              .sort((a, b) => a.featured - b.featured)
        : integrations.filter(
              ({ categories }) => categories.indexOf(collection) >= 0
          )
}
