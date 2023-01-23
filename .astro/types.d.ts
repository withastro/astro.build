declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		(typeof entryMap)[C][keyof (typeof entryMap)[C]] & Render;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	type BaseCollectionConfig<S extends BaseSchema> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: string;
			collection: string;
			body: string;
			data: import('astro/zod').infer<S>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends BaseSchema>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	export function getEntry<C extends keyof typeof entryMap, E extends keyof (typeof entryMap)[C]>(
		collection: C,
		entryKey: E
	): Promise<(typeof entryMap)[C][E] & Render>;
	export function getCollection<
		C extends keyof typeof entryMap,
		E extends keyof (typeof entryMap)[C]
	>(
		collection: C,
		filter?: (data: (typeof entryMap)[C][E]) => boolean
	): Promise<((typeof entryMap)[C][E] & Render)[]>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		Required<ContentConfig['collections'][C]>['schema']
	>;

	type Render = {
		render(): Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	};

	const entryMap: {
		"blog": {
"astro-018.mdx": {
  id: "astro-018.mdx",
  slug: "astro-018",
  body: string,
  collection: "blog",
  data: any
},
"astro-019.mdx": {
  id: "astro-019.mdx",
  slug: "astro-019",
  body: string,
  collection: "blog",
  data: any
},
"astro-021-preview.mdx": {
  id: "astro-021-preview.mdx",
  slug: "astro-021-preview",
  body: string,
  collection: "blog",
  data: any
},
"astro-021-release.mdx": {
  id: "astro-021-release.mdx",
  slug: "astro-021-release",
  body: string,
  collection: "blog",
  data: any
},
"astro-023.mdx": {
  id: "astro-023.mdx",
  slug: "astro-023",
  body: string,
  collection: "blog",
  data: any
},
"astro-025.mdx": {
  id: "astro-025.mdx",
  slug: "astro-025",
  body: string,
  collection: "blog",
  data: any
},
"astro-1-beta-release.mdx": {
  id: "astro-1-beta-release.mdx",
  slug: "astro-1-beta-release",
  body: string,
  collection: "blog",
  data: any
},
"astro-1-hackathon.mdx": {
  id: "astro-1-hackathon.mdx",
  slug: "astro-1-hackathon",
  body: string,
  collection: "blog",
  data: any
},
"astro-1-release-update.mdx": {
  id: "astro-1-release-update.mdx",
  slug: "astro-1-release-update",
  body: string,
  collection: "blog",
  data: any
},
"astro-1.mdx": {
  id: "astro-1.mdx",
  slug: "astro-1",
  body: string,
  collection: "blog",
  data: any
},
"astro-140.mdx": {
  id: "astro-140.mdx",
  slug: "astro-140",
  body: string,
  collection: "blog",
  data: any
},
"astro-150.mdx": {
  id: "astro-150.mdx",
  slug: "astro-150",
  body: string,
  collection: "blog",
  data: any
},
"astro-repl.mdx": {
  id: "astro-repl.mdx",
  slug: "astro-repl",
  body: string,
  collection: "blog",
  data: any
},
"astro-showcase.mdx": {
  id: "astro-showcase.mdx",
  slug: "astro-showcase",
  body: string,
  collection: "blog",
  data: any
},
"astro-tutorial.mdx": {
  id: "astro-tutorial.mdx",
  slug: "astro-tutorial",
  body: string,
  collection: "blog",
  data: any
},
"astro-vercel-launch.mdx": {
  id: "astro-vercel-launch.mdx",
  slug: "astro-vercel-launch",
  body: string,
  collection: "blog",
  data: any
},
"community-day.mdx": {
  id: "community-day.mdx",
  slug: "community-day",
  body: string,
  collection: "blog",
  data: any
},
"contributor-awards-4.mdx": {
  id: "contributor-awards-4.mdx",
  slug: "contributor-awards-4",
  body: string,
  collection: "blog",
  data: any
},
"demo-day-2021-09.mdx": {
  id: "demo-day-2021-09.mdx",
  slug: "demo-day-2021-09",
  body: string,
  collection: "blog",
  data: any
},
"docs-hacktoberfest.mdx": {
  id: "docs-hacktoberfest.mdx",
  slug: "docs-hacktoberfest",
  body: string,
  collection: "blog",
  data: any
},
"experimental-server-side-rendering.mdx": {
  id: "experimental-server-side-rendering.mdx",
  slug: "experimental-server-side-rendering",
  body: string,
  collection: "blog",
  data: any
},
"experimental-static-build.mdx": {
  id: "experimental-static-build.mdx",
  slug: "experimental-static-build",
  body: string,
  collection: "blog",
  data: any
},
"introducing-astro.mdx": {
  id: "introducing-astro.mdx",
  slug: "introducing-astro",
  body: string,
  collection: "blog",
  data: any
},
"launch-week.mdx": {
  id: "launch-week.mdx",
  slug: "launch-week",
  body: string,
  collection: "blog",
  data: any
},
"netlify-astro-hosting-sponsorship.mdx": {
  id: "netlify-astro-hosting-sponsorship.mdx",
  slug: "netlify-astro-hosting-sponsorship",
  body: string,
  collection: "blog",
  data: any
},
"netlify-edge-functions.mdx": {
  id: "netlify-edge-functions.mdx",
  slug: "netlify-edge-functions",
  body: string,
  collection: "blog",
  data: any
},
"storyblok-partnership.mdx": {
  id: "storyblok-partnership.mdx",
  slug: "storyblok-partnership",
  body: string,
  collection: "blog",
  data: any
},
"the-astro-technology-company.mdx": {
  id: "the-astro-technology-company.mdx",
  slug: "the-astro-technology-company",
  body: string,
  collection: "blog",
  data: any
},
"themes-and-integrations.mdx": {
  id: "themes-and-integrations.mdx",
  slug: "themes-and-integrations",
  body: string,
  collection: "blog",
  data: any
},
"themes-catalog-updates.mdx": {
  id: "themes-catalog-updates.mdx",
  slug: "themes-catalog-updates",
  body: string,
  collection: "blog",
  data: any
},
"viteconf-2022.mdx": {
  id: "viteconf-2022.mdx",
  slug: "viteconf-2022",
  body: string,
  collection: "blog",
  data: any
},
},

	};

	type ContentConfig = never;
}
