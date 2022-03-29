---
layout: '../../layouts/Post.astro'
setup: |
  import Note from '/src/components/Note.astro'
title: 'Astro Themes & Integrations'
description: 'Introducing: a growing catalog of themes, components, and integrations to jumpstart your next Astro project.'
publishDate: 'April 6, 2022'
socialImage: '/assets/blog/themes-and-integrations/social.jpg'
lang: 'en'
authors:
  - tony
---

At Astro, we make it easy for you to build lightweight websites fast - and with our growing catalog of [Themes](https://astro.build/themes), [Components, and Integrations](https://astro.build/integrations), starting your next project is getting even easier!

## Themes

We've always had a collection of [example projects](https://github.com/withastro/astro/tree/main/examples) and even a handful of starter templates used by [`npm init astro`](https://docs.astro.build/en/install/auto/#1-run-the-cli). But what's better than a bunch of first-party starters? A catalog of themes built by the excellent Astro community!

Starting websites from scratch is a huge undertaking - I can't count how many times I've searched for font scales and color pallettes! Even worse, when you're starting the project you can already see the final product, the last thing you want to do is come up with an entire design system to standardize spacing or build yet another mobile menu...

Building reusable themes is a labor of love, but it's all worth it the first time you go from an empty repo to a shippable site with your content on day one. Share all your hard work with the rest of the community by including your themes on our new [Themes catalog](https://astro.build/themes).


## Components

Themes are a perfect launch pad for your next Astro project, but what does that mean for updates and maintenance after you've `git clone`ed the theme?

Pulling theme components out to their own NPM package can be a great way to support sites down the road. Publishing Astro components to NPM is [surprisingly simple](https://docs.astro.build/en/guides/publish-to-npm/) - Astro will import the `.astro` component directly from `node_modules` so there's no messing with build steps or transpilation :fireworks:

Next time you release new components for your theme existing projects just need to pull down the latest release from NPM. That might not sound important, but resolving conflicts when trying to rebase a `fork`ed copy of a theme can be a nightmare once files have been moved around and placeholder content replaced with your own pages.

Double check our docs for [package.json best practices](https://docs.astro.build/en/guides/publish-to-npm/#packagejson) - especially the `keywords` section which is used by our new Integrations catalog to automatically showcase all the latest Astro components and integrations!

## Integrations

With the frontend out of the way, how do you actually use your favorite CMS, or add analytics to the site? Our [recently announced](https://astro.build/blog/astro-025/#new-astro-integrations) Integrations API makes it possible to bring your own frameworks, CSS tools, and packages into Astro with just a few clicks - and the searchable [Integrations catalog](https://astro.build/integrations) is designed to make finding the right integrations for your next project a breeze.

- frameworks are even integrations
- lets take a look at an example, @astrojs/tailwind
  - remove the config loading (just comment it for the example)
  - adding postcss plugin
  - adding autoprefixer
  - injecting base tailwind styles with `@tailwind`
- check out the [full docs](https://docs.astro.build/en/reference/integrations-reference/) for details on how to build your own integrations

## Get Involved

We can't wait to see what you come up with! [Add your own themes to the catalog](https://github.com/withastro/astro.build/issues/new/choose), publish your own [components and integrations](https://docs.astro.build/en/guides/publish-to-npm/#integrations-library), and join our [Discord](https://astro.build/chat) to say hello!









At Astro, we make it easy for you to build lightweight websites fast - and with our growing catalog of [Themes](https://astro.build/themes) and [Integrations](https://astro.build/integrations), starting your next project is getting even easier!

## Themes

Looking to jumpstart your next project? Check out the [growing list of themes](https://astro.build/themes) built by our amazing community ✨

Interested in sharing your hard work? [Add your own starter project](https://github.com/withastro/astro.build/issues/new/choose) to our themes catalog. We can't wait to see what you come up with! 

<Note title="Coming Soon - Paid Themes">
After the Astro 1.0 release, we're planning to add support for the inclusion of paid themes to help you reach more potential customers and get compensated for the awesome stuff you create.
</Note>

## Integrations

Our [recently announced](https://astro.build/blog/astro-025/#new-astro-integrations) Integrations API makes it possible to bring your own frameworks, CSS tools, and packages into Astro with just a few clicks - and the searchable [Integrations catalog](https://astro.build/integrations) is designed to make finding the right integrations for your next project a breeze.

This is just the beginning, and we're looking forward to seeing the list of third-party and community-built integrations grow as we close in on our 1.0 release!

Curious to learn more about the API? Head over to our [docs site](https://docs.astro.build/en/guides/integrations-guide/) to build your next integration, and make sure to checkout the [publish to NPM](https://docs.astro.build/en/guides/publish-to-npm/#integrations-library) section to learn more about how our catalog automatically pulls packages from NPM!