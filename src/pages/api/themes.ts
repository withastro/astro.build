import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export const GET: APIRoute = async () => {
	const themes: CollectionEntry<"themes">[] = await getCollection("themes");
	const formedThemes = themes.map((theme) => ({
		title: theme.data.title,
		description: theme.data.description,
		body: theme.body,
		image: theme.data.image.replace(
			"/src/content/themes/_images/",
			"https://storage.googleapis.com/dev-portal-bucket/",
		),
		images: theme.data.images
			? theme.data.images.map((image) =>
					image.replace(
						"/src/content/themes/_images/",
						"https://storage.googleapis.com/dev-portal-bucket/",
					),
			  )
			: [],
		repoUrl: theme.data.repoUrl,
		demoUrl: theme.data.demoUrl,
		buyUrl: theme.data.buyUrl,
		links: theme.data.links.map((link) => link.href),
		paid: theme.data.buyUrl !== undefined,
		stars: theme.data.stars,
		author: {
			...theme.data.author,
			githubId: theme.data.author.avatar.startsWith(
				"https://avatars.githubusercontent.com/u/",
			)
				? theme.data.author.avatar.substring(
						"https://avatars.githubusercontent.com/u/".length,
						theme.data.author.avatar.length - 4,
				  )
				: 1,
		},
	}));
	return new Response(JSON.stringify(formedThemes));
};
