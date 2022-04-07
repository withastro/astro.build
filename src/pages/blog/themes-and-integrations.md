---
layout: '../../layouts/Post.astro'
setup: |
  import Note from '/src/components/Note.astro'
title: 'Astro Themes & Integrations'
description: 'Introducing: a growing catalog of themes, components, and integrations to jumpstart your next Astro project.'
publishDate: 'April 6, 2022'
socialImage: '/assets/blog/themes-and-integrations/social.jpg?v=1'
coverImage: '/assets/blog/themes-and-integrations/cover.jpg'
lang: 'en'
authors:
  - tony
  - fred
---

We [launched Astro](https://astro.build/blog/introducing-astro/) almost a year ago with the goal of delivering lightning-fast performance with a modern developer experience. Astro makes it easy to ship only what you need - 100% static HTML by default, bring your own framework to sprinkle in interactivity only where you need it.

**Today, we're excited to announce two new catalogs to help speed up development: [Themes](https://astro.build/themes) and [Integrations](https://astro.build/integrations).**

![Astro Themes Catalog](/assets/blog/themes-and-integrations/astro-themes-integrations.png)

With our new **Theme Catalog**, it's never been easier to go from idea to live traffic. And when it’s time to add your favorite tools, libraries and services into Astro, our **Integration Catalog** has got you covered. Extend Astro with a single `astro add` command.

## Introducing Astro Themes

Astro has always maintained a collection of official [example projects](https://github.com/withastro/astro/tree/main/examples) and [starter templates](https://astro.new/). These were great learning resources, but they were also limiting: 1 official blog theme, 1 official docs theme, etc. etc.

Meanwhile, our amazing community of developers had already begun to build and share fully-designed themes on our community Discord. Do you keep meaning to start a personal blog, but never seem to find the time? Grab a copy of the [Astro Ink](https://github.com/one-aalam/astro-ink) theme and start writing! With built-in support for dark mode, automated publishing for draft posts, and client-side search, you'll skip weeks of hacking to jump straight into the sharing your content. 

We created the Astro Themes Catalog to showcase these amazing community-developed themes alongside our official set of starter kits.

![Astro Themes Catalog](/assets/blog/themes-and-integrations/astro-themes.png)

Visit [astro.build/themes](http://astro.build/themes) to get started with any official or community theme. 

Interested in releasing your own theme? We’re here to help! Check out our [publishing best-practices](https://docs.astro.build/en/guides/publish-to-npm/#packagejson) for help getting started and instructions to get your theme listed on our catalog. Need help? Join the #themes channel on [Discord](https://astro.build/chat) to chat with other Astro theme creators.

## Integrations

With your frontend out of the way, how do you actually use your favorite CMS, or add analytics to the site? Our [recently announced](https://astro.build/blog/astro-025/#new-astro-integrations) Integrations API makes it possible to bring your own frameworks, CSS tools, and packages into Astro with just a few clicks. To browse everything available, our new [Integrations Catalog](https://astro.build/integrations) makes finding the right integrations for your next project a breeze.

For example, let’s say you’re having performance trouble with 3rd-party scripts on your page. This isn't surprising, since [sending too much JavaScript](https://web.dev/web/fundamentals/performance/optimizing-content-efficiency/javascript-startup-optimization/) can lock up the main thread and block the [`window.onload`](https://developer.mozilla.org/en/docs/Web/API/GlobalEventHandlers/onload) event (even if the script is marked as `async` or `defer`). Search our Integrations catalog to find the [official Partytown integration](https://github.com/withastro/astro/tree/main/packages/integrations/partytown) for Astro, and add it with a single command:

![Astro + Partytown](/assets/blog/themes-and-integrations/astro-partytown.png)

Check out the [full docs](https://docs.astro.build/en/reference/integrations-reference/) for details on how to build your own integrations.

## Ship It

We can't wait to see what you come up with! [Add your own themes to the catalog](https://github.com/withastro/astro.build/issues/new/choose), publish your own [components and integrations](https://docs.astro.build/en/guides/publish-to-npm/#integrations-library), and join our [Discord](https://astro.build/chat) to say hello!

<Note title="Stay Tuned">
  We're launching the next Astro Hackathon on Monday, April 11! Cash prizes will be awarded for a wide range of categories. Full details coming soon!
</Note>
