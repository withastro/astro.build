import { getCollection } from "astro:content"

export interface ReleasePost {
	title: string
	subtitle: string
	href: string
}

function normalizeVersionFromSlug(slug: string) {
	return Number(slug.split("-").at(1)?.slice(0, 3).padEnd(3, "0"))
}
const RELEASE_POST_RE = /^astro-[\d.]+$/
const RELEASE_STATEMENTS = [
	"is out!",
	"is now out!",
	"is here!",
	"is here!",
	"has landed!",
	"just arrived!",
	"just released!",
	"is available!",
	"is available!",
	"is now available!",
]
const random = (arr: string[]) => arr[Math.floor(arr.length * Math.random())]

export async function getLatestReleasePost(): Promise<ReleasePost | undefined> {
	const posts = await getCollection("blog", (t) => RELEASE_POST_RE.test(t.slug))
	let latestVersion = 0
	let latestSlug = ""
	for (const post of posts) {
		const currentVersion = normalizeVersionFromSlug(post.slug)
		if (currentVersion > latestVersion) {
			latestVersion = currentVersion
			latestSlug = post.slug
		}
	}
	const post = posts.find((p) => p.slug === latestSlug)

	if (post) {
		const title = post.data.title.split(":").at(0)?.trim()
		return {
			title: `${title} ${random(RELEASE_STATEMENTS)}`,
			subtitle: "Learn more",
			href: `/blog/${post.slug}/`,
		}
	}
}
