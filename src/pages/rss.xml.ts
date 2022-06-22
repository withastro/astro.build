import rss from '@astrojs/rss';
import type { MarkdownInstance } from 'astro';

function sortPosts(a, b) {
    return Number(new Date(b.frontmatter.publishDate)) - Number(new Date(a.frontmatter.publishDate));
}

export const get = () => {
    const allPosts = Object.values(import.meta.globEager('./blog/*.md'));

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
            link: item.url,
            pubDate: item.frontmatter.publishDate,
        })),
    })
    
    /*
    const sortedPosts = allPosts.sort((a, b) => Number(new Date(b.frontmatter.publishDate)) - Number(new Date(a.frontmatter.publishDate)));
     rss({
        // The RSS Feed title, description, and custom metadata.
        title: 'The Astro Blog',
        // See "Styling" section below
        description: 'News and updates about Astro.',
        // The list of items for your RSS feed, sorted.
        items: sortedPosts.map(item => ({
            title: item.frontmatter.title,
            description: item.frontmatter.description,
            link: item.url,
            pubDate: item.frontmatter.publishDate,
        })),
    });
    */
}