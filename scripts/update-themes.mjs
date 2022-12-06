import { promises as fs } from 'node:fs'
import path from 'node:path'
import glob from 'fast-glob'
import { parseRepoUrl, orgApi } from './github.mjs'

async function withStars(theme) {
    if (theme.official || !theme.repoUrl) {
        return theme
    }

    const { org, repo } = parseRepoUrl(theme.repoUrl.href) ?? {}

    if (!org || !repo) {
        return theme
    }

    const stars = await orgApi(org).repo(repo).fetchStars()

    return {
        ...theme,
        stars
    }
}

async function withUser(theme) {
    if (!theme.repoUrl || !!theme.author) {
        return theme
    }

    const { org } = parseRepoUrl(theme.repoUrl.href) ?? {}

    if (!org) {
        console.log('notfound::', theme.repoUrl.href)

        return theme
    }

    let author = {
        text: org,
        href: `https://github.com/${org}/`
    }

    try {
        const userJson = await orgApi(org).user().fetchUser()
        author = {
            text: userJson.login,
            href: userJson.html_url,
            avatar: userJson.avatar_url
        }
    } catch { }

    if (!author) {
        try {
            const orgJson = await orgApi(org).org().fetchOrg()
            author = {
                text: orgJson.login,
                href: orgJson.html_url,
                avatar: orgJson.avatar_url
            }
        } catch { }
    }

    if (!author) {
        console.log('notfound::', theme.repoUrl.href)
    }

    return {
        ...theme,
        author,
    }
}

async function withStarsAndUser(theme) {
    return withStars(theme).then(withUser)
}

async function loadTheme(pathname) {
    const data = JSON.parse(await fs.readFile(pathname, 'utf-8'))
    const slug = path.basename(pathname, '.json')

    return {
        ...data,
        slug,
        image: {
            src: data.image,
            alt: data.description
        },
        images: (data.images || []).map((src) => ({
            src,
            alt: data.description,
        })),
        repoUrl: data.repoUrl && {
            href: data.repoUrl,
            text: data.title
        },
        npmUrl: data.npmUrl && {
            href: data.npmUrl,
            text: data.title
        },
        demoUrl: data.demoUrl && {
            href: data.demoUrl,
            text: data.title
        },
        buyUrl: data.buyUrl && {
            href: data.buyUrl,
            text: 'Buy now'
        }
    }
}

async function loadThemes() {
    const promises = glob.sync('src/data/themes/*.json').map(loadTheme)

    return await Promise.all(promises)
}

function themeComparer(a, b) {
    /** TEMP: sorting paid themes to the top since they won't have stars */
    // return b.stars = a.stars

    return a.fullDescription && !b.fullDescription
        ? -1
        : !a.fullDescription && b.fullDescription
            ? 1
            : b.stars - a.stars
}

async function main() {
    // load all themes JSON from src/data
    const data = await loadThemes()

    const themes = await Promise.all(data.map(withStarsAndUser))

    await fs.writeFile(
        'src/data/themes.json',
        JSON.stringify(themes.sort(themeComparer), null, 4)
    )
}

main()

