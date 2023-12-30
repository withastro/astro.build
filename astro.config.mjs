import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import solidJs from "@astrojs/solid-js"
import tailwind from "@astrojs/tailwind"
import vercel from "@astrojs/vercel/serverless"
import { defineConfig } from "astro/config"
import fs from "node:fs"

/* https://vercel.com/docs/projects/environment-variables/system-environment-variables#system-environment-variables */
const VERCEL_PREVIEW_SITE =
	process.env.VERCEL_ENV !== "production" &&
	process.env.VERCEL_URL &&
	`https://${process.env.VERCEL_URL}`

// https://astro.build/config
export default defineConfig({
	site: VERCEL_PREVIEW_SITE || "https://astro.build",
	integrations: [
		tailwind({
			applyBaseStyles: false,
		}),
		solidJs(),
		mdx(),
		sitemap(),
	],
	markdown: {
		shikiConfig: {
			theme: JSON.parse(fs.readFileSync("./houston.theme.json", { encoding: "utf-8" })),
		},
	},
	image: {
		domains: ["v1.screenshot.11ty.dev"],
	},
	vite: {
		ssr: {
			noExternal: ["smartypants"],
		},
	},
	output: "hybrid",
	adapter: vercel({
		functionPerRoute: false,
	}),
})
