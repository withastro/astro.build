const formatter = Intl.NumberFormat('en', { notation: 'compact' });

export async function getStars() {
    return await getStarsForRepo('https://github.com/withastro/astro');
}

const starsMap = new Map<string, Promise<string>>();

export async function getStarsForRepo(repoUrl: string) {
    if (starsMap.has(repoUrl)) {
        return starsMap.get(repoUrl);
    }

    const stars = fetch(repoUrl.replace('https://github.com/', 'https://api.github.com/repos/'))
        .then(res => res.json())
        .then(res => formatter.format(res.stargazers_count))

    starsMap.set(repoUrl, stars);

    return await stars;
}