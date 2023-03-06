import type { EndpointOutput } from "astro"
import { getCollection } from "astro:content"

export const prerender = true

export async function get(): Promise<EndpointOutput> {
	const showcase = await getCollection("showcase")

	const result = showcase.map((site) => ({
		title: site.data.title,
		url: site.data.url,
	}))

	return {
		body: JSON.stringify(result),
	}
}
