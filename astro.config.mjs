import db from '@astrojs/db';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import solid from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';
import webVitals from '@astrojs/web-vitals';
import astroExpressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';
import houston from './houston.theme.json';

// https://astro.build/config
export default defineConfig({
	site: 'https://astro.build',
	integrations: [
		tailwind({
			applyBaseStyles: false,
		}),
		solid(),
		astroExpressiveCode({
			themes: [houston],
			frames: false,
		}),
		mdx(),
		sitemap(),
		db(),
		webVitals(),
	],
	image: {
		domains: ['v1.screenshot.11ty.dev', 'storage.googleapis.com'],
	},
	vite: {
		ssr: {
			noExternal: ['smartypants'],
		},
	},
	output: 'hybrid',
	adapter: netlify({ imageCDN: false }),
});
