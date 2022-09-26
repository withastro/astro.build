import rss from '@astrojs/rss';
import type { MarkdownInstance } from 'astro';
import { BlogPost } from '../types.js';
import { slugFromFile } from './blog/_utils.js';

function sortPosts(a, b) {
    return Number(new Date(b.frontmatter.publishDate)) - Number(new Date(a.frontmatter.publishDate));
}

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    date.setUTCHours(0);
    return date;
}

export const get = () => {
    const allPosts: MarkdownInstance<BlogPost>[] = Object.values(import.meta.globEager('../content/blog/*.mdx'));

    const sortedPosts = allPosts.sort((a, b) => sortPosts(a, b));

    return rss({
        // The RSS Feed title, description, and custom metadata.
        title: 'The Astro Blog',
        // See "Styling" section below
        description: 'News and updates about Astro.',
        site: import.meta.env.SITE,
        // The list of items for your RSS feed, sorted.
        items: sortedPosts.map(item => ({
            title: item.frontmatter.title,
            description: item.frontmatter.description,
            link: `/blog/${slugFromFile(item.url)}`,
            pubDate: formatDate(item.frontmatter.publishDate.toString()),
        })),
    });
}