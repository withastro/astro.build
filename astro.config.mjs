import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

import ec from "astro-expressive-code";
import icon from "astro-icon";

import houston from "./houston.theme.json";

/* https://vercel.com/docs/projects/environment-variables/system-environment-variables#system-environment-variables */
const VERCEL_PREVIEW_SITE =
	process.env.VERCEL_ENV !== "production" &&
	process.env.VERCEL_URL &&
	`https://${process.env.VERCEL_URL}`;

// https://astro.build/config
export default defineConfig({
	site: VERCEL_PREVIEW_SITE || "https://astro.build",
	integrations: [
		tailwind({
			applyBaseStyles: false,
		}),
		solid(),
		ec({
			themes: [houston],
			frames: false,
		}),
		mdx(),
		sitemap(),
		icon(),
	],
	image: {
		domains: ["v1.screenshot.11ty.dev", "storage.googleapis.com"],
	},
	vite: {
		ssr: {
			noExternal: ["smartypants"],
		},
	},
	output: "hybrid",
	adapter: vercel({
		imageService: true,
		functionPerRoute: false,
	}),
});
