import type { ImageMetadata } from '@astrojs/image/dist/vite-plugin-astro-image.js'
import { z } from 'zod'

/** Base Data Types */
export interface Image {
    src: string | ImageMetadata
    alt: string
}

export const ImageMetadataSchema = z.object({
    src: z.string(),
    height: z.number(),
    width: z.number(),
    format: z.string()
})

export const ImageSchema = z.object({
    src: z.string().or(ImageMetadataSchema),
    alt: z.string()
})

export interface Link {
    href: string
    text: string
}

export const LinkSchema = z.object({
    href: z.string(),
    text: z.string()
})

export interface IconLink extends Link {
    pack: string
    name: string
}

export const IconLinkSchema = LinkSchema.extend({
    pack: z.string(),
    name: z.string()
})

export interface Person {
    image: Image
    name: string
    twitter?: string
}

export const PersonSchema = z.object({
    image: ImageSchema,
    name: z.string(),
    twitter: z.string().optional()
})

export interface Site {
    title: string
    description: string
    image: ImageMetadata
    twitterHandle: string
    socialLinks: (IconLink & { me?: string; footerOnly?: boolean })[]
}

export const SiteSchema = z.object({
    title: z.string(),
    description: z.string(),
    image: ImageMetadataSchema,
    twitterHandle: z.string(),
    socialLinks: z.array(IconLinkSchema)
})

export interface BlogPost {
    url: string
    title: string
    description: string
    publishDate: Date
    authors: Person[]
    socialImage?: string | ImageMetadata
    coverImage?: string | ImageMetadata
}

export const BlogPostSchema = z.object({
    url: z.string(),
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    authors: z.array(PersonSchema),
    socialImage: z.string().or(ImageMetadataSchema).optional(),
    coverImage: z.string().or(ImageMetadataSchema).optional()
})

export type Markdown = string

export type ThemeTag =
    | "alpinejs"
    | "lit"
    | "markdown"
    | "postcss"
    | "preact"
    | "react"
    | "sass"
    | "solidjs"
    | "svelte"
    | "tailwind"
    | "typescript"
    | "vue"

export const ThemeTagSchema = z.enum([
    'alpinejs',
    'lit',
    'markdown',
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

export interface Theme {
    slug: string
    title: string
    description: string
    fullDescription?: Markdown
    image: ImageMetadata
    images: ImageMetadata[]
    author: Link & { avatar?: string }
    categories: string[]
    repoUrl?: Link
    demoUrl?: Link
    npmUrl?: Link
    buyUrl?: Link
    links?: Link[]
    official?: boolean
    stars?: number
    featured?: number
    tags?: ThemeTag[]
    keywords?: string[]
}

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
    categories: z.array(z.string()),
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

export interface Integration {
    slug: string
    title: string
    description: string
    image?: {
        src: string
        alt: string
    }
    categories: string[]
    repoUrl?: Link
    npmUrl: Link
    url?: Link
    official?: Boolean
    downloads: number
    featured?: number
}

export const IntegrationSchema = z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string().optional(),
    image: ImageSchema.optional(),
    categories: z.array(z.string()),
    repoUrl: LinkSchema.optional(),
    npmUrl: LinkSchema,
    url: LinkSchema.optional(),
    official: z.boolean().optional(),
    downloads: z.number().min(0),
    featured: z.number().min(1).optional()
})

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
