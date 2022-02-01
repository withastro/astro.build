---
title: 'Scaling Astro Sites to Thousands of Pages'
description: 'A new experimental flag in Astro build enables building sites with tens of thousands of pages.'
publishDate: 'January 25, 2022'
authors:
  - matthew
lang: 'en'
---

Astro's about to get a lot faster with a new build system intended to scale to tens, or even hundreds, of thousands of pages. If you hang out in our [Discord](https://astro.build/chat) or pay attention to recently releases you might have seen a lot of discussion about a "static build". This is our new implementation of `astro build` that does 2 things:

- Improves build times by up to 75%.
- Sets Astro up to support server-side rendering (SSR) in the near future.

This new build works by first building an SSR version of your app and then rendering each page to HTML. Because the site is pre-optimized it can render each page in parallel and will never run out of memory.

We're __now__ at the stage where this feature is ready for wider use. If you are a current Astro user please try out this new build by passing this flag in your build script:

```shell
astro build --experimental-static-build
```

This build will remain flagged for the next few releases until we iron out all of the kinks. Please help us by reporting issues you encounter, either in the [Discord](https://astro.build/chat) or by filing an [issue](https://github.com/withastro/astro/issues/new/choose).