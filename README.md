1.
edit src/data/site-info.ts website name 

2.edit src/pages/_components/Hero.astro to change homepage




[![Netlify Status](https://api.netlify.com/api/v1/badges/3442658e-265e-48ac-b3bc-e270853129c8/deploy-status)](https://app.netlify.com/sites/astro-build/deploys)

# [astro.build](https://astro.build)

The source code for [astro.build](https://astro.build), built with [Astro](https://github.com/withastro/astro).

## Updating Themes

The [themes catalog](https://astro.build/themes) is based on the [themes content collection](/src/content/themes/). Optimized images should be saved to the collection's [\_images directory](/src/content/themes/_images/), ideally as format with a `{image}.webp` file at 800px wide and `{image}@2x.webp` at 1600px wide.

Theme data is updated weekly by a [GitHub Action](/.github/workflows/weekly.yaml). This action mainly updates the star count in public GitHub repos (used for sorting), but may be updated in the future to update additional theme details.

> TODO: A future PR will migrate to `astro:assets` for image optimization and get away from the manual image optimization shenanigans.

## Updating the Showcase

The [showcase](https://astro.build/showcase) doesn't depend on any data from GitHub or NPM. All showcase data is pulled from the [content collection](/src/content/showcase/). Similar to themes, optimized images should be saved to the collection's [\_images directory](/src/content/showcase/_images/), ideally as format with a `{image}.webp` file at 800px wide and `{image}@2x.webp` at 1600px wide.

A weekly [GitHub workflow](/.github/workflows/weekly.yaml) pulls URLs posted in [a dedicated GitHub discussion](https://github.com/withastro/roadmap/discussions/521) and opens a PR to add data and screenshots for these sites to the repo. You can also run this script locally and commit the results manually:

```sh
pnpm update:showcase
```

> TODO: A future PR will migrate to `astro:assets` for image optimization and get away from the manual image optimization shenanigans.

## Updating Integrations

The [integrations catalog](https://atsro.build/integrations) also used a content collection to track known Astro integrations.

Integration data is updated weekly by a [GitHub Action](/.github/workflows/weekly.yaml). This action searches NPM and updates existing integrations, adds newly published integrations, and removes deprecated packages. A [JSON config file](/scripts/integrations.json) is used to allow for manual overrides of data published in NPM, most often this is used for adding icons and tweaking description text.

## Blog Posts

The [blog collection](/src/content/blog/) is setup to support MDX blog posts with all images being pulled from the collection's [\_images directory](/src/content/blog/_images/). Images should be a `webp` format of a reasonable width, something in the 800-1600px range is ideal.

Blog post cover and social images are set as frontmatter properties and should point reference the `_images` directory, ex: `coverImage: "/src/content/blog/_images/post-1/cover.webp"`.
