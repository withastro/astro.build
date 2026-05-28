// @ts-check

import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig, sessionDrivers } from 'astro/config';
import astroExpressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
import houston from './houston.theme.json';

/* On Cloudflare Workers Builds, CF_PAGES_URL is set to the preview URL for non-production deploys */
const PREVIEW_SITE = process.env.CF_PAGES_URL;

// https://astro.build/config
export default defineConfig({
	site: PREVIEW_SITE || 'https://astro.build',
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
		mdx({ optimize: true }),
		sitemap(),
	],
	image: {
		domains: ['v1.screenshot.11ty.dev', 'storage.googleapis.com', 'avatars.githubusercontent.com'],
	},
	vite: {
		ssr: {
			noExternal: ['smartypants'],
		},
	},
	adapter: cloudflare({ imageService: 'compile' }),
	session: { driver: sessionDrivers.lruCache() },
	experimental: {
		advancedRouting: true,
		contentIntellisense: true,
		rustCompiler: true,
	},
});
