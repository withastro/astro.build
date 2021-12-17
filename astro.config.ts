import type { AstroUserConfig } from "astro";

const config: AstroUserConfig = {
  buildOptions: {
    site: 'https://astro.build',
    sitemap: true,
  },
  renderers: [],
  vite: {
    ssr: { 
      external: ['svgo']
    }
  }
}

export default config;
