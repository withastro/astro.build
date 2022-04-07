import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import astroImagePlugin from 'astro-imagetools/plugin'
import { tokens } from './syntax-highlighting-theme.mjs'

// https://astro.build/config
export default defineConfig({
	site: 'https://astro.build',
	integrations: [sitemap()],
	markdown: {
		shikiConfig: {
			theme: {
				name: 'Star gazer',
				type: 'dark',
				settings: tokens,
			},
		},
		remarkPlugins: [
			'remark-smartypants',
			[
				'remark-autolink-headings',
				{
					behavior: 'wrap',
				},
			],
		],
		rehypePlugins: [
			'rehype-slug',
			[
				'rehype-autolink-headings',
				{
					behavior: 'wrap',
				},
			],
		],
	},
	vite: {
		plugins: [astroImagePlugin],
		ssr: {
			noExternal: ['smartypants'],
			external: ['svgo'],
		},
	},
})
