import image from "@astrojs/image"
import mdx from "@astrojs/mdx"
import netlify from "@astrojs/netlify/functions"
import solidJs from "@astrojs/solid-js"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

/* https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables */
import sitemap from "@astrojs/sitemap"
const NETLIFY_PREVIEW_SITE = process.env.CONTEXT !== "production" && process.env.DEPLOY_PRIME_URL

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
	site: NETLIFY_PREVIEW_SITE || "https://astro.build",
	integrations: [
		image({
			serviceEntryPoint: "@astrojs/image/sharp",
		}),
		tailwind(),
		solidJs(),
		mdx(),
		sitemap(),
	],
	vite: {
		ssr: {
			noExternal: ["smartypants"],
		},
	},
	output: "server",
	adapter: netlify(),
})
