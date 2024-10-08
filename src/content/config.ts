import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import authors from '../data/authors/authors.json';

export const IntegrationCategories = new Map([
	['recent', 'Recently Added'],
	['official', 'Official'],
	['frameworks', 'Frameworks'],
	['loaders', 'Content Loaders'],
	['adapters', 'Adapters'],
	['css+ui', 'CSS + UI'],
	['performance+seo', 'Performance + SEO'],
	['analytics', 'Analytics'],
	['accessibility', 'Accessibility'],
	['media', 'Images + Media'],
	['toolbar', 'Dev Toolbar'],
	['utilities', 'Utilities'],
	['uncategorized', 'Uncategorized'],
] as const);

const seoSchema = z.object({
	title: z.string().min(5).max(120),
	description: z.string().min(15).max(160),
	image: z
		.object({
			src: z.string().default('/og/social.jpg'),
			alt: z.string().default('Build the web you want'),
		})
		.default({}),
	pageType: z.enum(['website', 'article']).default('website'),
	robots: z
		.object({
			index: z.boolean().default(true),
			follow: z.boolean().default(true),
		})
		.default({}),
});

export const collections = {
	authors: defineCollection({
		loader: file('src/data/authors/authors.json'),
		schema: ({ image }) =>
			z.object({
				image: image().optional(),
				name: z.string(),
				twitter: z.string().url().optional(),
				mastodon: z.string().url().optional(),
				github: z.string().url().optional(),
			}),
	}),
	blog: defineCollection({
		schema: z.object({
			title: z.string().describe('The blog post title.'),
			description: z
				.string()
				.describe(
					'Summary of this blog post. Appears on the blog index as well as in metadata displayed on social media.',
				),
			homepageLink: z
				.object({
					title: z.string().max(32).describe('Very short call-out, e.g. `Astro 4.14` or `New!`.'),
					subtitle: z
						.string()
						.max(50)
						.optional()
						.describe(
							'Short tagline attracting attention to the post, e.g. `New experimental Content Layer API` or `Announcing Astro DB`. Avoid punctuation and keep things punchy.',
						),
				})
				.optional()
				.describe('Configure the homepage banner link for this post if it’s the most recent post.'),
			publishDate: z.coerce
				.date()
				.describe(
					'A date string or YAML date that is compatible with JavaScript’s `new Date()` constructor.',
				),
			authors: z
				.enum(Object.keys(authors) as [keyof typeof authors, ...(keyof typeof authors)[]])
				.array()
				.describe('A list of authors of this blog post, e.g. `["erika", "matt"]`'),
			socialImage: z
				.string()
				.optional()
				.describe(
					'Path to the open graph image for this blog post to display in social media previews, e.g. `/src/content/blog/_images/my-post/og-image.webp`.\n\n' +
						'This should be pre-optimized as a WebP to ensure good performance.',
				),
			coverImage: z
				.string()
				.optional()
				.describe(
					'Path to the cover image displayed at the top of the blog post and on the blog index, e.g. `/src/content/blog/_images/my-post/cover-image.webp`.\n\n' +
						'This should be pre-optimized as a WebP to ensure good performance.',
				),
			lang: z.enum(['en']).default('en').describe('The language of this blog post (optional)'),
		}),
	}),
	caseStudies: defineCollection({
		schema: z
			.object({
				seo: seoSchema.optional(),
				title: z.string(),
				description: z.string(),
				publishDate: z.coerce.date(),
				authors: z.array(z.string()),
				socialImage: z.string().optional(),
				coverImage: z.string().optional(),
				lang: z.enum(['en']).default('en'),
				headerImage: z.string().optional(),
				coverGradientFrom: z.string(),
				coverGradientTo: z.string(),
			})
			// adding this extra flag to differentiate it in lists
			.transform((study) => ({ ...study, isCaseStudy: true })),
	}),
	integrations: {
		schema: z.object({
			name: z.string().describe('Name of the package as it is published to NPM'),
			title: z
				.string()
				.describe('Title of the integration as it should be shown in the Integrations catalog'),
			description: z.string().optional(),
			image: z.string().optional(),
			categories: z.array(
				z.enum(Array.from(IntegrationCategories.keys()) as [string, ...string[]]),
			),
			repoUrl: z.string().url().optional(),
			npmUrl: z.string().url(),
			homepageUrl: z.string().url().optional(),
			official: z.boolean().default(false),
			toolbar: z.number().min(1).optional(),
			downloads: z.number().min(0).default(0),
			downloadFactor: z.number().min(0).default(1),
			badge: z.string().optional(),
		}),
	},
	pages: {
		schema: z.object({
			seo: seoSchema,
			updated_date: z.date().describe('The date this content was last updated.'),
			locale: z.enum(['en']).default('en'),
		}),
	},
	partials: {
		schema: z.object({}),
	},
	quotes: {
		schema: z.object({
			author: z.object({
				handle: z.string(),
				avatar: z.object({
					src: z.string(),
					alt: z.string().optional(),
				}),
			}),
			url: z.string().url(),
			published: z.date(),
		}),
	},
	showcase: defineCollection({
		type: 'data',
		schema: ({ image }) =>
			z.object({
				title: z.string().min(1),
				image: image(),
				url: z.string().url(),
				featured: z.number().min(1).optional(),
				highlight: z.boolean().default(false),
				dateAdded: z.date(),
				categories: z
					.enum([
						'starlight',
						'personal',
						'tech',
						'marketing',
						'entertainment',
						'landing',
						'blog',
						'portfolio',
						'docs',
						'e-commerce',
						'other',
					])
					.array()
					.default([]),
			}),
	}),
};
