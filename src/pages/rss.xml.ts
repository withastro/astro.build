import rss from "@astrojs/rss"
import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

function sortPosts(a: { data: { publishDate: Date } }, b: { data: { publishDate: Date } }) {
	return Number(b.data.publishDate) - Number(a.data.publishDate)
}

function formatDate(date: Date) {
	date.setUTCHours(0)
	return date
}

export const GET: APIRoute = async (context) => {
	const unsortedPosts = [...(await getCollection("blog")), ...(await getCollection("caseStudies"))]
	const posts = unsortedPosts.sort((a, b) => sortPosts(a, b))

	return rss({
		// The RSS Feed title, description, and custom metadata.
		title: "The Astro Blog",
		// See "Styling" section below
		description: "News and updates about Astro.",
		site: context.site!.href,
		// The list of items for your RSS feed, sorted.
		items: posts.map((item) => ({
			title: item.data.title,
			description: item.data.description,
			link: "isCaseStudy" in item.data ? `/case-studies/${item.slug}` : `/blog/${item.slug}/`,
			pubDate: formatDate(item.data.publishDate),
		})),
	})
}
