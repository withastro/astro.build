import { defineCollection, z } from "astro:content"

export const IntegrationCategories = new Map<string, string>([
	["featured", "Featured"],
	["recent", "Recently Added"],
	["official", "Official"],
	["frameworks", "Frameworks"],
	["adapters", "Adapters"],
	["css+ui", "CSS + UI"],
	["performance+seo", "Performance + SEO"],
	["analytics", "Analytics"],
	["accessibility", "Accessibility"],
])

export const ThemeCategories = new Map<string, string>([
	["featured", "Featured"],
	["official", "Official"],
	["blog", "Blog"],
	["landing-page", "Landing Page"],
	["portfolio", "Portfolio"],
	["ecommerce", "E-commerce"],
	["docs", "Docs"],
	["minimal", "Minimal"],
	["other", "Other"],
])

export const ThemeTools = new Map<string, string>([
	["alpinejs", "Alpine.js"],
	["lit", "Lit"],
	["mdx", "MDX"],
	["postcss", "PostCSS"],
	["preact", "Preact"],
	["react", "React"],
	["sass", "SASS"],
	["solidjs", "SolidJS"],
	["svelte", "Svelte"],
	["tailwind", "Tailwind"],
	["typescript", "TypeScript"],
	["vue", "Vue"],
])

export const themeSchema = z
	.object({
		title: z.string().min(1),
		description: z.string().min(1),
		fullDescription: z.string().optional(),
		image: z.string(),
		images: z.array(z.string()).default([]),
		author: z.object({
			url: z.string(),
			name: z.string(),
			avatar: z.string(),
		}),
		categories: z.array(z.enum(Array.from(ThemeCategories.keys()) as [string, ...string[]])),
		repoUrl: z.string().url().optional(),
		demoUrl: z.string().url().optional(),
		buyUrl: z.string().url().optional(),
		links: z
			.array(
				z.object({
					href: z.string().url(),
					text: z.string(),
				}),
			)
			.default([]),
		stars: z.number().min(0).default(0),
		featured: z.number().min(1).optional(),
		tools: z.array(z.enum(Array.from(ThemeTools.keys()) as [string, ...string[]])).default([]),
		related: z.array(z.string()).max(3).default([]),
	})
	.transform((theme) => {
		// computed properties
		return {
			...theme,
			official: theme.categories.includes("official"),
			paid: !!theme.buyUrl,
		}
	})

export const collections = {
	authors: defineCollection({
		schema: z.object({
			image: z.string().optional(),
			name: z.string(),
			title: z.string().optional(),
			twitter: z.string().optional(),
		}),
	}),
	blog: defineCollection({
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			authors: z.array(z.string()),
			socialImage: z.string().optional(),
			coverImage: z.string().optional(),
			lang: z.enum(["en"]).default("en"),
		}),
	}),
	careers: defineCollection({
		schema: z.object({
			title: z.string().min(1).describe("Title of the job position"),
			published: z.date().describe("Date the job listing was posted"),
			location: z
				.string()
				.min(1)
				.describe("Location of the job position (eg: 'Remote' or 'San Fransisco, CA'"),
			team: z.enum(["Engineering", "UI", "DX"]),
			type: z.enum(["Full Time", "Part Time", "Contract", "Internship"]),
			image: z
				.object({
					src: z.string().default("/og/social.jpg"),
					alt: z.string().default("Astro | Build the web you want"),
				})
				.default({}),
		}),
	}),
	integrations: {
		schema: z.object({
			name: z.string().describe("Name of the package as it is published to NPM"),
			title: z
				.string()
				.describe("Title of the integration as it should be shown in the Integrations catalog"),
			description: z.string().optional(),
			image: z.string().optional(),
			categories: z.array(
				z.enum(Array.from(IntegrationCategories.keys()) as [string, ...string[]]),
			),
			repoUrl: z.string().url().optional(),
			npmUrl: z.string().url(),
			homepageUrl: z.string().url().optional(),
			official: z.boolean().default(false),
			featured: z.number().min(1).optional(),
			downloads: z.number().min(0).default(0),
			badge: z.string().optional(),
		}),
	},
	pages: {
		schema: z.object({
			seo: z.object({
				title: z.string().min(5).max(60),
				description: z.string().min(15).max(160),
				image: z
					.object({
						src: z.string().default("/og/social.jpg"),
						alt: z.string().default("Build the web you want"),
					})
					.default({}),
				pageType: z.enum(["website", "article"]).default("website"),
				robots: z
					.object({
						index: z.boolean().default(true),
						follow: z.boolean().default(true),
					})
					.default({}),
			}),
			updated_date: z.date().describe("The date this content was last updated."),
			locale: z.enum(["en"]).default("en"),
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
	showcase: {
		schema: z.object({
			title: z.string().min(1),
			image: z.string(),
			url: z.string().url(),
			featured: z.number().min(1).optional(),
			highlight: z.boolean().default(false),
		}),
	},
	themes: {
		schema: themeSchema,
	},
}
