import db from '@astrojs/db';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import solid from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import webVitals from '@astrojs/web-vitals';
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
		solid(),
		astroExpressiveCode({
			themes: [houston],
			frames: false,
		}),
		mdx(),
		sitemap(),
		/**
		 * Only add Astro DB and Web Vitals integrations for `astro dev`, CI builds,
		 * or when an explicit `WITH_DB` variable is set.
		 */
		{
			name: 'conditional-web-vitals',
			hooks: {
				'astro:config:setup'({ command, updateConfig }) {
					if (command === 'dev' || process.env.CI || process.env.WITH_DB) {
						updateConfig({
							integrations: [...db(), webVitals()],
						});
					}
				},
			},
		},
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
	experimental: {
		contentIntellisense: true,
		contentLayer: true,
	},
});
