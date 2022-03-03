import { contains } from "../utils/contains";
import { uniq } from "../utils/uniq";
import { getStars, getStarsForRepo } from '../utils';

interface ThemeData {
    title: string;
    description: string;
    image: string;
    categories: string[];
    tags?: App.ThemeTag[];
    repoUrl: string;
    npmUrl?: string;
    demoUrl?: string;
}

let _loadThemes: Promise<App.Theme[]>;
async function loadThemes(): Promise<App.Theme[]> {
    const items = import.meta.globEager<{ [slug: string]: ThemeData }>('./themes/*.json');

    return Object.keys(items).map(slug => {
        const theme = items[slug].default;

        return {
            ...theme,
            slug,
            image: {
                src: theme.image,
                alt: theme.description,
            },
            tags: theme.tags || [],
            repoUrl: {
                href: theme.repoUrl,
                text: theme.title,
            },
            npmUrl: theme.npmUrl && {
                href: theme.npmUrl,
                text: theme.title,
            },
            demoUrl: theme.demoUrl && {
                href: theme.demoUrl,
                text: theme.title,
            }
        }
    })
}

export async function fetchThemes() {
    _loadThemes = _loadThemes || loadThemes();
    return _loadThemes;
}

export async function fetchThemesForCollection(collection: string) {
    const allThemes = await fetchThemes();

    const containsCollection = contains(collection);

    return allThemes.filter(theme => containsCollection(theme.categories))
}

export async function fetchCollections(): Promise<string[]> {
    const themes = await fetchThemes();

    return uniq(
        themes.map(theme => theme.categories).flat()
    );
}
