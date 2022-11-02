import { ImageMetadata } from '@astrojs/image'

/** Base Data Types */
export interface Image {
    src: string | ImageMetadata
    alt: string
}

export interface Link {
    href: string
    text: string
}

export interface IconLink extends Link {
    pack: string
    name: string
}

export interface Person {
    image: Image
    name: string
    twitter?: string
}

export interface Site {
    title: string
    description: string
    image: ImageMetadata
    twitterHandle: string
    socialLinks: IconLink[]
}

export interface BlogPost {
    url: string
    title: string
    description: string
    publishDate: Date
    authors: Person[]
    socialImage?: string
    coverImage?: string
}

export interface Theme {
    slug: string
    title: string
    description: string
    image: ImageMetadata
    categories: string[]
    repoUrl: Link
    demoUrl?: Link
    npmUrl?: Link
    official?: boolean
    stars: number
    featured?: number
}

export interface Integration {
    slug: string
    title: string
    description: string
    image?: {
        src: string
        alt: string
    }
    categories: string[]
    repoUrl: Link
    npmUrl: Link
    url?: Link
    official?: Boolean
    downloads: number
    featured?: number
}

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
