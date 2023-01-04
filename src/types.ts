import type { ImageMetadata } from '@astrojs/image/dist/vite-plugin-astro-image.js'
import { z } from 'zod'

const ImageMetadataSchema = z.object({
    src: z.string(),
    height: z.number(),
    width: z.number(),
    format: z.enum([
        'heic',
        'heif',
        'avif',
        'jpeg',
        'jpg',
        'png',
        'tiff',
        'webp',
        'gif'
    ])
})

const ImageSchema = z.object({
    src: z.string().or(ImageMetadataSchema),
    alt: z.string()
})

const LinkSchema = z.object({
    href: z.string(),
    text: z.string()
})
export type Link = z.infer<typeof LinkSchema>

const IconLinkSchema = LinkSchema.extend({
    pack: z.string(),
    name: z.string(),
    rel: z.string().optional(),
    footerOnly: z.boolean().default(false)
})

export const PersonSchema = z.object({
    image: ImageSchema,
    name: z.string(),
    twitter: z.string().optional()
})
export type Person = z.infer<typeof PersonSchema>

export const SiteSchema = z.object({
    title: z.string(),
    description: z.string(),
    image: ImageMetadataSchema,
    twitterHandle: z.string(),
    socialLinks: z.array(IconLinkSchema)
})
export type Site = z.infer<typeof SiteSchema>

export const BlogPostSchema = z.object({
    url: z.string(),
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    authors: z.array(PersonSchema),
    socialImage: z.string().or(ImageMetadataSchema).optional(),
    coverImage: z.string().or(ImageMetadataSchema).optional()
})
export type BlogPost = z.infer<typeof BlogPostSchema>

const ThemeTagSchema = z.enum([
    'alpinejs',
    'lit',
    'mdx',
    'postcss',
    'preact',
    'react',
    'sass',
    'solidjs',
    'svelte',
    'tailwind',
    'typescript',
    'vue'
])
export type ThemeTag = z.infer<typeof ThemeTagSchema>

const ThemeCategory = z.enum([
    'blog',
    'landing-page',
    'portfolio',
    'docs',
    'minimal',
    'other'
])

export const ThemeSchema = z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    fullDescription: z.string().optional(),
    image: ImageMetadataSchema,
    images: z.array(ImageMetadataSchema).optional(),
    author: LinkSchema.extend({
        avatar: z.string().url().optional()
    }).optional(),
    categories: z.array(ThemeCategory),
    repoUrl: LinkSchema.optional(),
    demoUrl: LinkSchema.optional(),
    npmUrl: LinkSchema.optional(),
    buyUrl: LinkSchema.optional(),
    links: z.array(LinkSchema).optional(),
    official: z.boolean().optional(),
    stars: z.number().min(0).optional(),
    featured: z.number().min(1).optional(),
    tags: z.array(ThemeTagSchema).optional(),
    keywords: z.array(z.string()).optional()
})
export type Theme = z.infer<typeof ThemeSchema>

export const IntegrationSchema = z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string().optional(),
    image: ImageSchema.optional(),
    categories: z.array(
        z.enum([
            'css+ui',
            'official',
            'performance+seo',
            'frameworks',
            'adapters',
            'analytics',
            'accessibility'
        ])
    ),
    repoUrl: LinkSchema.optional(),
    npmUrl: LinkSchema,
    url: LinkSchema.optional(),
    official: z.boolean().optional(),
    downloads: z.number().min(0),
    featured: z.number().min(1).optional()
})
export type Integration = z.infer<typeof IntegrationSchema>

export interface ShowcaseSite {
    slug: string
    title: string
    image: ImageMetadata
    url: Link
    featured?: number
    highlight?: boolean
}

export interface Sponsor {
    id: number
    name: string
    image?: ImageMetadata
    initials: string
    href?: string
}

/** Overwrite the properties of one type with another */
export type Merge<A extends object, B extends object> = Omit<A, keyof B> & B
