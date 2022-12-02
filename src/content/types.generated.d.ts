declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		typeof entryMap[C][keyof typeof entryMap[C]];
	export function collectionToPaths<C extends keyof typeof entryMap>(
		collection: C
	): Promise<import('astro').GetStaticPathsResult>;

	type BaseCollectionConfig = { schema: import('astro/zod').ZodRawShape };
	export function defineCollection<C extends BaseCollectionConfig>(input: C): C;

	export function getEntry<C extends keyof typeof entryMap, E extends keyof typeof entryMap[C]>(
		collection: C,
		entryKey: E
	): Promise<typeof entryMap[C][E]>;
	export function getCollection<
		C extends keyof typeof entryMap,
		E extends keyof typeof entryMap[C]
	>(
		collection: C,
		filter?: (data: typeof entryMap[C][E]) => boolean
	): Promise<typeof entryMap[C][keyof typeof entryMap[C]][]>;
	export function renderEntry<
		C extends keyof typeof entryMap,
		E extends keyof typeof entryMap[C]
	>(entry: {
		collection: C;
		id: E;
	}): Promise<{
		Content: import('astro').MarkdownInstance<{}>['Content'];
		headings: import('astro').MarkdownHeading[];
		injectedFrontmatter: Record<string, any>;
	}>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		import('astro/zod').ZodObject<CollectionsConfig['collections'][C]['schema']>
	>;

	const entryMap: {
		"blog": {
"astro-018.mdx": {
  id: "astro-018.mdx",
  slug: "astro-018",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"astro-019.mdx": {
  id: "astro-019.mdx",
  slug: "astro-019",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"astro-021-preview.mdx": {
  id: "astro-021-preview.mdx",
  slug: "astro-021-preview",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"astro-021-release.mdx": {
  id: "astro-021-release.mdx",
  slug: "astro-021-release",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"astro-023.mdx": {
  id: "astro-023.mdx",
  slug: "astro-023",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"astro-025.mdx": {
  id: "astro-025.mdx",
  slug: "astro-025",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"astro-1-beta-release.mdx": {
  id: "astro-1-beta-release.mdx",
  slug: "astro-1-beta-release",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"astro-1-hackathon.mdx": {
  id: "astro-1-hackathon.mdx",
  slug: "astro-1-hackathon",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"astro-1-release-update.mdx": {
  id: "astro-1-release-update.mdx",
  slug: "astro-1-release-update",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"astro-1.mdx": {
  id: "astro-1.mdx",
  slug: "astro-1",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"astro-140.mdx": {
  id: "astro-140.mdx",
  slug: "astro-140",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"astro-150.mdx": {
  id: "astro-150.mdx",
  slug: "astro-150",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"astro-repl.mdx": {
  id: "astro-repl.mdx",
  slug: "astro-repl",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"astro-showcase.mdx": {
  id: "astro-showcase.mdx",
  slug: "astro-showcase",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"astro-tutorial.mdx": {
  id: "astro-tutorial.mdx",
  slug: "astro-tutorial",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"astro-vercel-launch.mdx": {
  id: "astro-vercel-launch.mdx",
  slug: "astro-vercel-launch",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"community-day.mdx": {
  id: "community-day.mdx",
  slug: "community-day",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"contributor-awards-4.mdx": {
  id: "contributor-awards-4.mdx",
  slug: "contributor-awards-4",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"demo-day-2021-09.mdx": {
  id: "demo-day-2021-09.mdx",
  slug: "demo-day-2021-09",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"docs-hacktoberfest.mdx": {
  id: "docs-hacktoberfest.mdx",
  slug: "docs-hacktoberfest",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"experimental-server-side-rendering.mdx": {
  id: "experimental-server-side-rendering.mdx",
  slug: "experimental-server-side-rendering",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"experimental-static-build.mdx": {
  id: "experimental-static-build.mdx",
  slug: "experimental-static-build",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"introducing-astro.mdx": {
  id: "introducing-astro.mdx",
  slug: "introducing-astro",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"launch-week.mdx": {
  id: "launch-week.mdx",
  slug: "launch-week",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"netlify-astro-hosting-sponsorship.mdx": {
  id: "netlify-astro-hosting-sponsorship.mdx",
  slug: "netlify-astro-hosting-sponsorship",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"netlify-edge-functions.mdx": {
  id: "netlify-edge-functions.mdx",
  slug: "netlify-edge-functions",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"storyblok-partnership.mdx": {
  id: "storyblok-partnership.mdx",
  slug: "storyblok-partnership",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"the-astro-technology-company.mdx": {
  id: "the-astro-technology-company.mdx",
  slug: "the-astro-technology-company",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"themes-and-integrations.mdx": {
  id: "themes-and-integrations.mdx",
  slug: "themes-and-integrations",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"viteconf-2022.mdx": {
  id: "viteconf-2022.mdx",
  slug: "viteconf-2022",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
},

	};

	type CollectionsConfig = typeof import('/Users/benholmes/Repositories/astro.build/src/content/config');
}
