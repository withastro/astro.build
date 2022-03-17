import { format, subDays } from 'date-fns';
import fs from 'node:fs';
import fetch from 'node-fetch';
import { keywords, overrides } from './integrations.mjs';

if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN env variable must be set to run.');
}

function canGetStars(repoUrl) {
    try {
    const url = new URL(repoUrl)
    return url.pathname.split('/').filter(Boolean).length === 2
    } catch (err) {
        console.error(repoUrl, err);
        return false;
    }
}

async function getStarsForRepo(repoUrl) {
    if (!canGetStars(repoUrl)) {
        return undefined;
    }

    const stars = fetch(
            repoUrl.replace('https://github.com/', 'https://api.github.com/repos/'),
            {
                headers: { Authorization: 'token ' + process.env.GITHUB_TOKEN }
            }
        )
        .then(res => res.json())
        .then(res => {
            return res
        })
        .then(res => res.stargazers_count)
        .catch(err => {
            console.error(repoUrl, err);
            return 0;
        })

    return await stars;
}

const END_DATE = format(new Date(), 'yyyy-MM-dd');
const START_DATE = format(
    subDays(new Date(), 7),
    'yyyy-MM-dd'
);
// https://api.npmjs.org/search?text=keywords%3Aastro-component&ranking=quality
const API_URL = 'https://api.npmjs.org/';
const DOWNLOADS_URL = `${API_URL}downloads/point/${START_DATE}:${END_DATE}/`;
const SEARCH_URL = `${API_URL}search?text=keywords%3A{keyword}&ranking=quality`

const REGISTRY_URL = 'https://registry.npmjs.org/';

async function getDownloadsForPackage(pkg) {
    const downloads = fetch(`${DOWNLOADS_URL}${pkg}`)
        .then(res => res.json())
        .then(res => res.downloads)
        .catch((err) => {
            console.error('getDownloadsForPackage', err);
            return 0;
        });

    return await downloads;
}

async function getDetailsForPackage(pkg) {
    const data = await fetch(`${REGISTRY_URL}${pkg}`).then(res => res.json());
    const integration = {
        slug: data.name,
        title: data.name,
        description: data.description,
        repoUrl: {
            href: data.repository.url
                .replace('git+', '')
                .replace('.git', '')
                .replace('git:', 'https:'),
            text: 'View source code'
        },
        npmUrl: {
            href: `https://www.npmjs.com/package/${pkg}`,
            text: 'View on NPM'
        },
        url: {
            href: data.homepage,
            text: 'View homepage'
        }
    };

    const integrationOverrides = overrides[pkg] || {};

    return {
        ...integration,
        ...integrationOverrides
    };
}

async function searchByKeyword(keyword) {
    const { objects } = await fetch(SEARCH_URL.replace('{keyword}', keyword)).then(res => res.json());

    return objects.map(({ package: pkg }) => pkg.name);
}

async function main() {
    const keyword = 'astro-component';

    const packageNames = await searchByKeyword(keyword);

    const data = await Promise.all(packageNames.map(pkg => Promise.all([
        getDetailsForPackage(pkg),
        getDownloadsForPackage(pkg),
    ])));

    const npmData = data.map(([details, downloads]) => ({
        ...keywords[keyword],
        ...details,
        downloads
    }));

    const stars = await Promise.all(npmData.map(data => getStarsForRepo(data.repoUrl.href)));
   
    const integrations = npmData.map((data, i) => ({
        ...data,
        stars: stars[i]
    })).sort((a, b) => b.downloads - a.downloads);

    fs.writeFileSync('src/data/integrations.json', JSON.stringify(integrations, null, 4));
}

main();