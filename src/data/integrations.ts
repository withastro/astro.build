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
        const integration = items[slug].default;

        return {
            ...integration,
            slug,
            image: integration.image && {
                src: integration.image,
                alt: integration.description,
            },
            repoUrl: {
                href: integration.repoUrl,
                text: integration.title,
            },
            npmUrl: {
                href: integration.npmUrl,
                text: integration.title,
            },
            url: {
                href: integration.url || integration.npmUrl || integration.repoUrl,
                text: integration.title,
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
