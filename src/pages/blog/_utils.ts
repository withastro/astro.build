import path from 'node:path';
import social from '../../assets/social.png'
import { getAuthor } from '../../data/authors/index.js'
import type { MarkdownInstance } from 'astro'
import type { BlogPost } from '../../types.js'

export const slugFromFile = (file: string) => path.parse(file).name;
const urlFromContentUrl = (url: string) => {
    const { dir, name } = path.parse(url);
    return path.join(dir.replace('src/content', ''), name, '/');
}

interface BlogPostFrontmatter {
    title: string
    description: string
    publishDate: string
    authors: string[]
    socialImage?: string
    coverImage?: string
}

export async function parseBlogPost({
    url,
    frontmatter
}: MarkdownInstance<BlogPostFrontmatter>): Promise<BlogPost> {
    const {
        title,
        description,
        publishDate,
        authors = [],
        socialImage = social,
        coverImage
    } = frontmatter

    return {
        url: urlFromContentUrl(url),
        title,
        description,
        publishDate: new Date(publishDate),
        authors: await Promise.all(authors.map(getAuthor)),
        socialImage,
        coverImage,
    }
}

export function sortPosts(a: BlogPost, b: BlogPost) {
    return b.publishDate.getTime() - a.publishDate.getTime()
}
