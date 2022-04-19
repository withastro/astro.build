---
layout: '../../layouts/Post.astro'
title: 'Astro on Netlify Edge Functions'
description: 'Announcing support for the new Netlify Edge Functions platform'
publishDate: 'April 19, 2022'
socialImage: '/assets/blog/experimental-ssr/social.jpg'
coverImage: '/assets/blog/experimental-ssr/cover.jpg'
lang: 'en'
authors:
  - matthew
---

Two weeks ago, we [announced experimental support for server-side rendering (SSR) with Netlify](https://www.netlify.com/blog/astro-ssr) as our launch partner on [Netlify Functions](https://docs.netlify.com/functions/overview/). Today, we’re announcing support for SSR on Netlify’s new [Edge Functions](https://www.netlify.com/products/#netlify-edge-functions) platform. Edge Functions went live today and Astro has day 1 support.

With SSR and Astro, you can:

- Build large, CMS-backed sites that are difficult to scale with SSG (static-site generation).
- Build apps that need authentication or persistent state, such as E-commerce backends.
- Use a simplified HTML-like syntax with sprinkles of JavaScript, only when you need it.

With **edge rendering** you bring SSR closer to your users, getting those first bytes to the browser, faster. Combined with serving static assets at the edge, this gives you optimal network performance. Astro is committed to making performant content sites easy to achieve, and Netlify’s new Edge Functions platform is an ideal place to deploy your Astro SSR applications today.

To get started, install the Netlify adapter:

```bash
npm install @astrojs/netlify
```

And then add the adapter in your `astro.config.mjs` file:

```jsx
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/edge-functions';

export default defineConfig({
	adapter: netlify()
});
```

## Migrating from Netlify Functions

Astro is already available on Netlify Functions, a Node.js based serverless runtime. With Edge Functions you can get even better performance, and we've tried to make it as easy as possible to switch.

### Compatibility

Netlify Edge Functions run on top of [Deno](https://deno.land/), but *most* Astro applications do not need to change code to deploy to the new environment. The Netlify adapter takes care of compiling and bundling your source so that it can run on Deno.

If you are using dependencies that depend on Node.js’ built-in modules, it’s possible that you cannot move off of Netlify Functions. If so, Netlify Functions is still a great platform for most use-cases and provides a standard Node.js runtime for Node package support. 

If you use the `<Markdown />` component, it cannot presently run in non-Node environments. A possible alternative in the meantime is using `.md` pages.

### Migration

First, upgrade to the latest `@astrojs/netlify` like so:

```bash
npm install @astrojs/netlify@latest
```

Then, update your `astro.config.mjs` to import the edge functions adapter:

```diff
import { defineConfig } from 'astro/config';
- import netlify from '@astrojs/netlify/functions';
+ import netlify from '@astrojs/netlify/edge-functions';

export default defineConfig({
	adapter: netlify()
});
```

And that should be it! The next time you build, it will generate an SSR build compatible with Edge Functions, which can then be deployed with `netlify deploy`.

## Partnerships

Netlify was Astro’s launch partner for SSR. Even within the short time since that announcement, we have seen tremendous support from other hosting platforms:

- [Begin](https://begin.com/) [announced support](https://blog.begin.com/posts/2022-04-15-astro-ssr-lambda-with-architect) for Astro on AWS Lambda through the [Architect framework](https://arc.codes/docs/en/get-started/quickstart).
- A [Vercel adapter](https://github.com/withastro/astro/tree/main/packages/integrations/vercel) was added as a core integration through community contributions.
- Serverless Cloud announced their own [adapter](https://github.com/serverless/cloud/tree/main/templates/astro-ssr).
- A Deno (including [Deno Deploy](https://deno.com/deploy)) [adapter](https://github.com/withastro/astro/tree/main/packages/integrations/deno) was added to core.

With several other big hosts having adapters in the works. If you’d like to build an adapter for another platform, swing by our [Discord channel](https://discord.com/channels/830184174198718474/852168748353060875) and we’d be happy to help you along!