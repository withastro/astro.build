import image from '@astrojs/image'
import mdx from '@astrojs/mdx'
import preact from '@astrojs/preact'
import prefetch from '@astrojs/prefetch'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
    site: 'https://astro.build',
    integrations: [
        tailwind(),
        image({
            serviceEntryPoint: '@astrojs/image/sharp'
        }),
        prefetch(),
        mdx(),
        sitemap(),
        preact()
    ],
    vite: {
        ssr: {
            noExternal: ['smartypants'],
            external: ['svgo']
        }
    }
})
