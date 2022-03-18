import integrations from './integrations.json';

export interface Collection {
    text: string;
    slug: string;
}

function getCollections(): Collection[] {
    const collectionsMap = new Map<string, number>();

    for (const integration of integrations) {
        for (const category of integration.categories) {
            if (collectionsMap.has(category)) {
                collectionsMap.set(category, collectionsMap.get(category) + 1);
            } else {
                collectionsMap.set(category, 1);
            }
        }
    }

    return Array.from(collectionsMap.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count === a.count ? a.category.localeCompare(b.category) : b.count - a.count)
        .map(({ category }) => ({
            slug: category,
            text: category.replace('+', ' + ')
        }));
}

export const collections = getCollections();

export function getIntegrationsForCollection(collection: string) {
    return integrations.filter(({ categories }) => categories.indexOf(collection) >= 0);
}