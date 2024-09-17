import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
	const showcase = await getCollection('showcase');

	const result = showcase.map((site) => ({
		title: site.data.title,
		url: site.data.url,
		slug: site.id,
	}));

	return Response.json(result);
};
