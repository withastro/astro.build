import { defineConfig } from 'astro/config';
import image from '@astrojs/image';
import prefetch from "@astrojs/prefetch";
import sitemap from '@astrojs/sitemap';
import { tokens } from './syntax-highlighting-theme.mjs';

// https://astro.build/config
export default defineConfig({
  legacy: {
    astroFlavoredMarkdown: true,
  },
  site: 'https://astro.build',
  integrations: [sitemap(), prefetch(), image()],
  markdown: {
    shikiConfig: {
      theme: {
        name: 'Star gazer',
        type: 'dark',
        settings: tokens
      }
    },
    remarkPlugins: ['remark-smartypants', ['remark-autolink-headings', {
      behavior: 'wrap'
    }]],
    rehypePlugins: ['rehype-slug', ['rehype-autolink-headings', {
      behavior: 'wrap'
    }]]
  },
  vite: {
    ssr: {
      noExternal: ['smartypants'],
      external: ['svgo', '@11ty/eleventy-img']
    }
  }
});