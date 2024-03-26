import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
	const showcase = await getCollection("showcase");

	const result = showcase.map((site) => ({
		title: site.data.title,
		url: site.data.url,
		slug: site.slug,
	}));

	return Response.json(result);
};
