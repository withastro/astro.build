---
layout: '../../layouts/Post.astro'
title: 'Astro 0.25 Release Notes'
description: 'Introducing: Integrations • "astro add" • Syntax Highlighter Updates'
publishDate: 'February 19, 2022'
socialImage: '/assets/blog/astro-023/social.jpg'
lang: 'en'
authors: 
  - fred
---

**Astro v0.25.0** has just been released, and we have some amazing updates to share.

- [Integrations](#integrations)
- [Experimental `astro add` command](#experimental-astro-add-command)
- [Details production build logs](#detailed-production-build-logs)
- [Syntax Highlighter updates](#syntax-highlighter-updates)

## Integrations

We know users love making Astro their own. Whether that's bringing your favorite CSS utilities, adding your UI components of choice, or loading 3rd party scripts efficiently, we think configuration should be as seemless as possible.

So, we're excited to launch an brand new concept for Astro: **integrations** ⚡️

These unlock a whole galaxy of features in a few lines of code 🪐 This includes:

- Support for your [favorite UI frameworks](https://docs.astro.build/en/core-concepts/framework-components/): React, Vue, Svelte, Solid, and more.
- Tools like [Tailwind](https://tailwindcss.com/), [Turbolinks](https://www.npmjs.com/package/turbolinks), and [Partytown](https://github.com/BuilderIO/partytown) with little-to-no config.
- New build-time features like automatic sitemap generation.

...and a [powerful new "hooks" API](https://docs.astro.build/en/reference/integrations-reference/) to write integrations of your own.

### Moving from "renderers" to "integrations"

Long-time Astro users likely use "renderers" for their UI framework components. By moving to integrations, we've unlocked a world of possibilities for fine-tuned configuration and customizability in the future. 

You can [follow our migration guide](https://docs.astro.build/en/migrate/#astro-integrations) to switch to integrations in 2 simple steps. Here's a brief overview for those curious:

```diff
# 1. Install each integration + associated frameworks
+ npm install @astrojs/lit lit
+ npm install @astrojs/react react react-dom
```

```diff
# 2. Apply from your astro.config.*
+ import lit from '@astrojs/lit';
+ import react from '@astrojs/react';

export default {
-   renderers: ['@astrojs/renderer-lit', '@astrojs/renderer-react'],
+   integrations: [lit(), react()],
}
```

### Experimental: `astro add` command

Was 2 steps too many for you? Well, we have an all-new CLI command to wire up those integrations: `astro add` 🚀

This helps you:
1. Install all necessary dependencies and peer dependencies
2. Update your `astro.config.*` file to apply this integration

We've also added a handy wizard to select your favorite integrations and component frameworks. Check that stunning sample output below 👀

![astro add wizard to 1. enable frameworks 2. select other integrations 3. update your config 4. install all dependencies](/assets/blog/astro-025/astro-add-demo.jpg)

## Detailed production build logs

Until now, our production builds gave 2 pieces of feedback:
1. Your build started
2. Your build finished

...with radio silence in between 😬

There's countless details you might need for debugging, especially for larger-scale projects measured in build-minutes instead of build-seconds. Until now, you could enable the `DEBUG` flag for more granular updates. But we think all users could benefit from this information!

Builds are now broken down into 3 major steps, with real-time updates along the way:

1. **🏃‍♂️ Setup phase -** we'll scan your pages to understand their imports, and compile to SSR modules for rendering later on.
2. **🔨 Client build phase -** this is Vite's time to shine. We display Vite's production build logs unmodified so you can watch your CSS and JS assets bundle in real time.
3. **🗺 Route generation phase -** We'll display all routes generated for each of your input files, complete with unique icons for HTML files and data endpoints. This is especially helpful for debugging `getStaticPaths`!

Try running `astro build` in your project today 🚀

## Syntax highlighter updates

We love to find sensible defaults that "just work" out-of-the-box. As part of this, we decided to make [Shiki](https://github.com/shikijs/shiki) our new default syntax highlighter. This comes pre-configured with the `github-dark` theme, providing zero-config highlighting in your code blocks without extraneous CSS classes, stylesheets, or client-side JS.

Check our new [syntax highlighting docs](https://docs.astro.build/en/guides/markdown-content/#syntax-highlighting) for full details! If you prefer to keep Prism as your syntax highlighter, don't worry. You can [set the `syntaxHighlight` option to `'prism'`](/en/guides/markdown-content/#prism-configuration) in your project's markdown configuration.