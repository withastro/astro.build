---
layout: '../../layouts/Post.astro'
title: 'Astro 1.0 Beta Release'
description: 'The Astro 1.0 Beta is now available! This release marks the stabilization of all major APIs, with no more major breaking changes planned between now and the official v1.0 release.'
publishDate: 'April 4, 2022'
authors:
  - nate
  - fred
socialImage: '/assets/blog/astro-1-beta-release/social.png'
coverImage: '/assets/blog/astro-1-beta-release/cover.png'
lang: 'en'
---

# Astro 1.0 Beta Release

**The Astro 1.0 Beta is now available!** This release marks the stabilization of all major APIs, with no more major breaking changes planned between now and the official v1.0 release.

Take it for a spin online by visiting [astro.new](http://astro.new) or locally by running...

```shell
npm init astro
```

> Upgrading from an older version of Astro? Please reference our comprehensive [Migration Guide](https://docs.astro.build/en/migrate/).


In addition, we are thrilled to announce that the **official Astro v1.0.0 release will be available on June 8, 2022.** We plan to use these next two months to improve documentation, squash bugs, collect your feedback, and finish up [a few final Astro improvements](https://github.com/withastro/rfcs/discussions/161).

We are incredibly grateful for the support Astro has received so far. Thousands of developers – including teams from [Firebase](https://firebase.blog/), [Trivago](https://tech.trivago.com/), and [The Guardian](https://developers.theguardian.com/) – are already running Astro in production today. If you’ve been waiting to try Astro, there has never been a better time!

To celebrate the release, this post dives into Astro’s background and explores the 3 principles that drive our team every day:

1. Great web performance should be the norm, not the exception.
2. Simple, straightforward APIs are our superpower.
3. The web deserves a framework-agnostic foundation.

## Background

For the last decade, developer tools have optimized for a single type of project—JavaScript *applications,* typically Single Page Applications (SPAs). SPA frameworks have revolutionized the way we build software on the web, dominating the last decade of web development.

But even the best SPAs come with trade-offs, some of which make little sense in less stateful, content-based websites. [Thoughtworks](https://www.thoughtworks.com/radar/techniques?blipid=202203006) said it best: 

> "Too often [we see teams] blindly accepting the complexity of **SPAs by default** even when the business needs don't justify it.” — Thoughtworks Technology Radar

This got us thinking... what *would* a web framework designed for content-focused websites look like? How would a tool that priotized performance shift our approach? If we abandoned the notion that SPAs are always better, could we push the web forward the same way that JSX did almost 10 years ago?

We found our answers in Astro. 

### 1. Great web performance should be the norm, not the exception.

It should be impossible (or at least very difficult) to build a slow site in Astro.

By default, Astro helps you build sites that ship **zero JavaScript to the browser**. Astro’s built-in component syntax generates static HTML as much as possible, only sending down JavaScript for any interactive parts of your page. You’ll be shocked by how little JavaScript you actually need when you build your first Astro website.

Astro also lets you **bring your own framework.** React, Svelte, Vue, Solid, and all of the popular web UI frameworks are supported in Astro. You can mix-and-match these components on your page, while still enjoying Astro’s automatic JavaScript reduction. If a component is 100% static, Astro strips out the JavaScript entirely and just sends it as HTML. 

This unique approach to JavaScript (known as *partial* or *selective hydration*) unlocks some really compelling, fine-grained optimization features. Components load and hydrate individually, so we can customize and control loading behavior on a component-by-component basis:

```astro
<!-- client:load -- load this component on the page ASAP -->
<MyCriticalBuyButton client:load />
<!-- client:visible -- only load when visible on the page -->
<MyHeavyReactImageCarousel client:visible />
```

This level of control is extremely difficult in an SPA framework like Next.js or SvelteKit, and wholly unique to Astro.

### 2. Simple, straightforward APIs are our superpower.

We designed Astro’s language syntax to be simple, with the hope that anyone could pick it up regardless of background or skill level. Astro will feel familiar even if you’ve only ever used a frontend JavaScript framework, are used to more traditional backend tooling, or are just working on the basics of HTML and JavaScript.

The most important thing to know about Astro’s component language is that it’s a **superset of HTML.** A valid HTML snippet is a valid Astro component. There are no render functions to export, JSX to return, or hooks to manage. In fact, there’s no JavaScript at all! 

```html
<!-- This is a valid Astro component! HTML is the best :) -->
<p>Hello, World!</p>
```

You’d be surprised how far you can get in Astro with HTML alone!

As you gain more experience, you’ll learn how Astro supports dynamic templating with JSX-like expressions and component props. You’ll also grow more familiar with the “frontmatter” component script that we use to run server-side code alongside your template. In no time, you’ll be writing more powerful components like this:

```astro
---
// Run server-side JavaScript code in your frontmatter. 
// None of this ever ends up on the client!
const message = "Hello, " + Astro.props.name;
---
<p>{message}</p>
```

We designed the rest of Astro to be equally straightforward: We support Web Standard APIs wherever we can, so you can use the `fetch()` API with top-level `await` to fetch data from an external source. Use an explicit ESM `import` to read local data from your project, instead of an invisible implicit data waterfall.

### 3. The web deserves a framework-agnostic foundation.

Earlier we mentioned that Astro supports all of the popular UI frameworks—React, Vue, Svelte, Solid, Preact, and Lit. The implications of Astro’s framework-agnostic design are massive, and something that we always consider actively when designing new features for Astro.

Case in point: [SolidJS](https://www.solidjs.com/) launched in 2021 without an official full-stack web framework like [Solid Start](https://github.com/solidjs/solid-start). Sure, you could use SolidJS in a new project, but many tools make it impossible to incrementally try SolidJS in your codebase without doing a full rewrite to a new, Solid-compatible web framework.

**Framework lock-in** can be a huge problem, especially in large organizations that think about technology decisions on a much longer time-scale than the rest of us. In the larger open source ecosystem, framework lock-in just makes it harder for new frameworks like SolidJS to gain traction.

With this in mind, we’ve designed Astro to be completely framework-agnostic. Our focus is to **build the best foundation** for long-term projects, giving organizations the flexibility to change technologies and frameworks over time. 

If you’re building a new web framework, consider launching your project with Astro support.

## What’s Next for Astro?

This week is **Launch Week** at Astro HQ, so we have a few more exciting announcements lined up for the rest of the week.

- Tuesday, April 5: **Going Beyond Static Sites**
- Wednesday, April 6: **Themes, Components, Integrations**
- Thursday, April 7: **Contributor Day**
- Friday, April 8: **Recap (and one more thing...)**

Beyond that, you can check [our public roadmap](https://github.com/withastro/rfcs/discussions/161) for updates as we work towards the official release of Astro v1.0.0 on **June 8, 2022**! 🎉

If you’re interested in getting involved or sharing any feedback, we invite you to [visit our GitHub](https://github.com/withastro/astro) repository and [join our Discord server](https://astro.build/chat).
