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

We [launched Atsro](https://astro.build/blog/introducing-astro/) almost a year ago with the goal of delivering lightning-fast performance with a modern developer experience. Astro makes it easy to ship only what you need - 100% static HTML by default, bring your own framework to sprinkle in interactivity only where you need it.

Today we're excited to announce our new [Themes](https://astro.build/themes), and [Integrations](https://astro.build/integrations) catalogs. Whether you're starting a new blog, launching a marketing site, or publishing docs for your own projects, it's never been easier to go from idea to live Astro site. When it's time to pull in a battle-tested component library, load data from your CMS, and add analytics with [Partytown](https://partytown.builder.io/) the Integrations catalog has you covered.



## Themes

We've always had a collection of [example projects](https://github.com/withastro/astro/tree/main/examples) and even a handful of starter templates used by [`npm init astro`](https://docs.astro.build/en/install/auto/#1-run-the-cli). But what's better than a bunch of first-party starters? A catalog of themes built by the excellent Astro community!

![Astro Themes Catalog](/assets/blog/themes-and-integrations/astro-themes-catalog.png)

Starting websites from scratch is a huge undertaking - I can't count how many times I've searched for font scales and color pallettes! Even worse, when you're starting the project you can already see the final product. The last thing you want to do is come up with an entire design system to standardize spacing or build yet another mobile menu...

Building reusable themes is a labor of love, but it's all worth it the first time you go from an empty repo to a shippable site with your content on day one. Share all your hard work with the rest of the community by including your themes on our new [Themes catalog](https://astro.build/themes).

Planning to release your own theme? Consider publishing your Astro components to NPM to make sure it's easy for websites to upgrade to a future release. Double check our docs for [package.json best practices](https://docs.astro.build/en/guides/publish-to-npm/#packagejson) - especially the `keywords` section which is used by our new Integrations catalog to automatically showcase all the latest Astro components and integrations!

## Integrations

With the frontend out of the way, how do you actually use your favorite CMS, or add analytics to the site? Our [recently announced](https://astro.build/blog/astro-025/#new-astro-integrations) Integrations API makes it possible to bring your own frameworks, CSS tools, and packages into Astro with just a few clicks - and the searchable [Integrations catalog](https://astro.build/integrations) is designed to make finding the right integrations for your next project a breeze.

![Astro + Partytown](/assets/blog/themes-and-integrations/astro-partytown.png)

- frameworks are even integrations
- lets take a look at an example, @astrojs/tailwind
  - remove the config loading (just comment it for the example)
  - adding postcss plugin
  - adding autoprefixer
  - injecting base tailwind styles with `@tailwind`
- check out the [full docs](https://docs.astro.build/en/reference/integrations-reference/) for details on how to build your own integrations

## Get Involved

We can't wait to see what you come up with! [Add your own themes to the catalog](https://github.com/withastro/astro.build/issues/new/choose), publish your own [components and integrations](https://docs.astro.build/en/guides/publish-to-npm/#integrations-library), and join our [Discord](https://astro.build/chat) to say hello!
