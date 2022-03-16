import { contains } from "../utils/contains";
import { uniq } from "../utils/uniq";

interface IntegrationData {
    title: string;
    description: string;
    image: string;
    categories: string[];
    repoUrl: string;
    npmUrl: string;
    url?: string;
}

let _loadIntegrations: Promise<App.Integration[]>;
async function loadIntegrations(): Promise<App.Integration[]> {
    const items = import.meta.globEager<{ [slug: string]: IntegrationData }>('./integrations/*.json');

    return Object.keys(items).map(slug => {
        const theme = items[slug].default;

        return {
            ...theme,
            slug,
            image: {
                src: theme.image,
                alt: theme.description,
            },
            repoUrl: {
                href: theme.repoUrl,
                text: theme.title,
            },
            npmUrl: {
                href: theme.npmUrl,
                text: theme.title,
            },
            url: {
                href: theme.url || theme.npmUrl || theme.repoUrl,
                text: theme.title,
            }
        }
    })
}

export async function fetchIntegrations() {
    _loadIntegrations = _loadIntegrations || loadIntegrations();
    return _loadIntegrations;
}

export async function fetchIntegrationsForCollection(collection: string) {
    const allIntegrations = await fetchIntegrations();

    const containsCollection = contains(collection);

    return allIntegrations.filter(integration => containsCollection(integration.categories))
}

export async function fetchCollections(): Promise<string[]> {
    const integrations = await fetchIntegrations();

    return uniq(
        integrations.map(integration => integration.categories).flat()
    );
}
