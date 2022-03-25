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
