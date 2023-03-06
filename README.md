[![Netlify Status](https://api.netlify.com/api/v1/badges/3442658e-265e-48ac-b3bc-e270853129c8/deploy-status)](https://app.netlify.com/sites/astro-build/deploys)

# [astro.build](https://astro.build)

The source code for [astro.build](https://astro.build), built with [Astro](https://github.com/withastro/astro).

## Updating Themes

The [themes catalog](https://astro.build/themes) is based on the [themes content collection](/src/content/themes/). Optimized images should be saved to the collection's [\_images directory](/src/content/themes/_images/), ideally as format with a `{image}.webp` file at 800px wide and `{image}@2x.webp` at 1600px wide.

> TODO: Themes use metadata from GitHub, specifically the stars count for public theme repos. This is updated manually for now but a nightly job will be added to take care of this automatically.

## Updating the Showcase

The [showcase](https://astro.build/showcase) doesn't depend on any data from GitHub or NPM. All showcase data is pulled from the [content collection](/src/content/showcase/). Similar to themes, optimized images should be saved to the collection's [\_images directory](/src/content/showcase/_images/), ideally as format with a `{image}.webp` file at 800px wide and `{image}@2x.webp` at 1600px wide.

## Updating Integrations

The [integrations catalog](https://atsro.build/integrations) also used a content collection to track known Astro integrations.

> TODO: A nightly or weekly script will also be added here to find new integrations published to NPM.

## Blog Posts

The [blog collection](/src/content/blog/) is setup to support MDX blog posts with all images being pulled from the collection's [\_images directory](/src/content/blog/_images/). Images should be a `webp` format of a reasonable width, something in the 800-1600px range is ideal.

Blog post cover and social images are set as frontmatter properties and should point reference the `_images` directory, ex: `coverImage: "/src/content/blog/_images/post-1/cover.webp"`.
