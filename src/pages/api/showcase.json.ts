import { getCollection } from "astro:content"

export const GET = (async () => {
	const showcase = await getCollection("showcase")

	const result = showcase.map((site) => ({
		title: site.data.title,
		url: site.data.url,
		slug: site.slug,
	}))

	return new Response(JSON.stringify(result))
}) satisfies APIRoute
