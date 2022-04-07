import { promises as fs } from 'node:fs'
import path from 'node:path'
import glob from 'fast-glob'
import { parseRepoUrl, orgApi } from './github.mjs'

async function withStars(theme) {
    if (theme.official) {
        return theme
    }

    const { org, repo } = parseRepoUrl(theme.repoUrl.href) ?? {}

	if (!org || !repo) {
		return theme
	}

	const stars = await orgApi(org).repo(repo).fetchStars()
    console.log(theme.title, stars)

    return {
        ...theme,
        stars
    }
}

async function loadTheme(pathname) {
    const data = JSON.parse(await fs.readFile(pathname, 'utf-8'))
    const slug = path.basename(pathname, '.json')

    return {
        ...data,
        slug,
        image: {
            src: data.image,
            alt: data.description,
        },
        tags: data.tags || [],
        repoUrl: {
            href: data.repoUrl,
            text: data.title,
        },
        npmUrl: data.npmUrl && {
            href: data.npmUrl,
            text: data.title,
        },
        demoUrl: data.demoUrl && {
            href: data.demoUrl,
            text: data.title,
        },
    }
}

async function loadThemes() {
    const promises = glob.sync('src/data/themes/*.json')
        .map(loadTheme)
    
    return await Promise.all(promises)
}

async function main() {
    // load all themes JSON from src/data
    const data = await loadThemes()
    
    const themes = await Promise.all(
        data
            .sort(() => 0.5 - Math.random()) // randomize the order
            .map(withStars) // include GitHub stars
    )

    await fs.writeFile(
		'src/data/themes.json',
		JSON.stringify(themes, null, 4)
	)
}

main()