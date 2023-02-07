[![Netlify Status](https://api.netlify.com/api/v1/badges/3442658e-265e-48ac-b3bc-e270853129c8/deploy-status)](https://app.netlify.com/sites/astro-build/deploys)

# [astro.build](https://astro.build)

The source code for [astro.build](https://astro.build), built with [Astro](https://github.com/withastro/astro).

## Updating Themes

The [themes catalog](https://astro.build/themes) is based the [theme.json](/src/data/themes.json) file, updated nightly by the [Nightly GitHub Action](/.github/workflows/nightly.yml).

The nightly job collects individual [JSON files](/src/data/themes) for each theme, pulls down a bit of information from GitHub for each theme, and compiles them into the main `themes.json` file used to actually render the themes catalog.

[`zod`](https://www.npmjs.com/package/zod) is used for data validation - any themes with invalid data *should* hit build errors during `astro dev` and `astro build`.

### Manually updating themes.json

When adding a new theme, it's important to run `pnpm update:themes` locally to rebuild the `themes.json` file locally.  Commit this file as part of any PR that adds a new theme to make sure it's visible in the PR preview :rocket:

## Updating the Showcase

The [showcase](https://astro.build/showcase) doesn't depend on any data from GitHub or NPM.  When adding a new showcase just include the image in [src/data/showcase/images](/src/data/showcase/images) and add the [JSON file](/src/data/showcase).

## Updating Integrations

Similar to the themes catalog, the [integrations catalog](https://astro.build/integrations) also depends on data from GitHub and NPM.  The same nightly GitHub Action rebuilds the integration catalog, and `zod` is also used here so invalid data should be caught during `dev` and `build`.
