const formatter = Intl.NumberFormat('en', { notation: 'compact' })

function canGetStars(repoUrl: string) {
	const url = new URL(repoUrl)
	return url.pathname.split('/').filter(Boolean).length === 2
}

export async function getStars() {
	return await getStarsForRepo('https://github.com/withastro/astro')
}

const starsMap = new Map<string, Promise<string>>()

export async function getStarsForRepo(repoUrl: string) {
	if (!canGetStars(repoUrl)) {
		return undefined
	}

	if (starsMap.has(repoUrl)) {
		return starsMap.get(repoUrl)
	}

	const stars = fetch(
		repoUrl.replace('https://github.com/', 'https://api.github.com/repos/')
	)
		.then(res => res.json())
		.then(res => formatter.format(res.stargazers_count))
		.catch(err => {
			console.warn(repoUrl, err)
			return '0'
		})

	starsMap.set(repoUrl, stars)

	return await stars
}
