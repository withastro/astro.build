// @ts-check

import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import astroExpressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
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
			styleOverrides: {
				borderRadius: '0.375rem',
				borderColor: 'rgb(84 88 100)',
			},
			defaultProps: {
				overridesByLang: {
					'bash,sh,shell': {
						frame: 'none',
					},
				},
			},
		}),
		icon({
			svgoOptions: {
				plugins: [
					{ name: 'preset-default' },
					{
						name: 'prefixIds',
						// Ensure IDs used in SVGs are unique to avoid clashes between inline SVGs.
						params: { prefix: () => Math.round(Math.random() * 1_000_000_000).toString(36) },
					},
				],
			},
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
