import { defineConfig } from "astro/config"
import fs from "node:fs"

import image from "@astrojs/image"
import mdx from "@astrojs/mdx"
import netlify from "@astrojs/netlify/functions"
import prefetch from "@astrojs/prefetch"
import sitemap from "@astrojs/sitemap"
import solidJs from "@astrojs/solid-js"
import tailwind from "@astrojs/tailwind"

/* https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables */
const NETLIFY_PREVIEW_SITE = process.env.CONTEXT !== "production" && process.env.DEPLOY_PRIME_URL

// https://astro.build/config
export default defineConfig({
  site: NETLIFY_PREVIEW_SITE || "https://astro.build",
  integrations: [
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    tailwind({
      config: {
        applyBaseStyles: false
      }
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
  output: "server",
  adapter: netlify(),
})
