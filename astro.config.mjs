// @ts-check

import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import astroExpressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';
import houston from './houston.theme.json';

/* https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables */
const NETLIFY_PREVIEW_SITE = process.env.CONTEXT !== 'production' && process.env.DEPLOY_PRIME_URL;

// https://astro.build/config
export default defineConfig({
	site: NETLIFY_PREVIEW_SITE || 'https://astro.build',
	prefetch: true,
	integrations: [
		tailwind({
			applyBaseStyles: false,
		}),
		astroExpressiveCode({
			themes: [houston],
			frames: false,
		}),
		mdx(),
		sitemap(),
	],
	image: {
		domains: ['v1.screenshot.11ty.dev', 'storage.googleapis.com'],
	},
	vite: {
		ssr: {
			noExternal: ['smartypants'],
		},
	},
	adapter: netlify({ imageCDN: false }),
	experimental: {
		contentIntellisense: true,
	},
});
