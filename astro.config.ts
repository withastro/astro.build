import type { AstroUserConfig } from 'astro'
import { defineConfig } from 'astro/config'
import { tokens } from './syntax-highlighting-theme';

const config: AstroUserConfig = {
	buildOptions: {
		site: 'https://astro.build',
		sitemap: true,
	},
	integrations: [],
	markdownOptions: {
		render: [
			'@astrojs/markdown-remark',
			{
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
		],
	},
	vite: {
		ssr: {
			noExternal: ['smartypants'],
			external: ['svgo'],
		},
	},
}

// https://astro.build/config
export default defineConfig(config)
