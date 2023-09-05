import { defineConfig } from "astro/config"
import fs from "node:fs"

import mdx from "@astrojs/mdx"
import prefetch from "@astrojs/prefetch"
import sitemap from "@astrojs/sitemap"
import solidJs from "@astrojs/solid-js"
import tailwind from "@astrojs/tailwind"
import vercel from "@astrojs/vercel/serverless"

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
            config: {
                applyBaseStyles: false,
            },
        }),
        solidJs(),
        mdx(),
        sitemap(),
        prefetch(),
    ],
    markdown: {
        shikiConfig: {
            theme: JSON.parse(fs.readFileSync("./houston.theme.json", { encoding: "utf-8" })),
        },
    },
    vite: {
        ssr: {
            noExternal: ["smartypants"],
        },
    },
    output: "hybrid",
    adapter: vercel({
        functionPerRoute: false
    }),
})
