import fs from 'node:fs'
import {
    badgesForPackage,
    getCategoriesForKeyword,
    getOverrides,
    allowlist,
    blocklist,
    getFeaturedPackagePriority
} from './integrations.mjs'
import { parseRepoUrl, orgApi } from './github.mjs'
import {
    fetchDetailsForPackage,
    fetchDownloadsForPackage,
    searchByKeyword
} from './npm.mjs'

function isOfficial(pkg) {
    return pkg.startsWith('@astrojs/')
}

function normalizePackageDetails(data, pkg) {
    const keywordCategories = (data.keywords ?? [])
        .map(getCategoriesForKeyword)
        .flat()
    
    const otherCategories = [
        isOfficial(pkg) ? 'official' : undefined
    ].filter(Boolean)

    const uniqCategories = Array.from(
        new Set([...keywordCategories, ...otherCategories])
    )

    const npmUrl = {
        href: `https://www.npmjs.com/package/${pkg}`,
        text: `View ${pkg} on NPM`
    }

    const repoUrl = data.repository?.url && {
        href: data.repository.url
            .replace('git+', '')
            .replace('.git', '')
            .replace('git:', 'https:'),
        text: `View the ${pkg} source code`
    }

    const url = data.homepage
        ? {
              href: data.homepage,
              text: `Learn more about ${pkg}`
          }
        : npmUrl

    return {
        slug: data.name,
        title: data.name,
        description: data.description,
        categories: uniqCategories,
        official: isOfficial(pkg),
        repoUrl,
        npmUrl,
        url
    }
}

async function getStarsForRepo(repoUrl) {
    const { org, repo } = parseRepoUrl(repoUrl) ?? {}

    if (!org || !repo) {
        return 0
    }

    return await orgApi(org).repo(repo).fetchStars()
}

async function fetchDetailsWithOverrides(pkg) {
    const details = await fetchDetailsForPackage(pkg)
    const integrationOverrides = getOverrides(pkg) || {}

    const downloads = await fetchDownloadsForPackage(pkg)
    const badges = badgesForPackage(details)
    const featured = getFeaturedPackagePriority(pkg)

    console.log('fetchDetails::', pkg)

    return {
        ...normalizePackageDetails(details, pkg),
        ...integrationOverrides,
        downloads,
        badges,
        featured
    }
}

function chunk(array, size) {
    const chunkedArray = []
    for (var i = 0; i < array.length; i += size) {
     chunkedArray.push(array.slice(i, i + size))
    }
    return chunkedArray
}

async function main() {
    const keyword = 'astro-component,withastro'

    const packagesMap = await searchByKeyword(keyword)
    const packageNames = new Set(
        [...packagesMap.keys(), ...allowlist].filter(
            (pkg) => !blocklist.includes(pkg)
        )
    )

    const pkgChunks = chunk(Array.from(packageNames.values()), 10)

    let npmData = []

    for (const chunk of pkgChunks) {
        npmData = npmData.concat(
            await Promise.all(
                chunk.map(fetchDetailsWithOverrides)
            )
        )
    }

    const integrations = npmData.sort((a, b) => b.downloads - a.downloads)

    fs.writeFileSync(
        'src/data/integrations.json',
        JSON.stringify(integrations, null, 4)
    )
}

main()
