---
layout: '../../layouts/Post.astro'
title: 'Server-side Rendering with Astro'
description: 'Announcing experimental support for server-side rendering in Astro'
publishDate: 'April 5, 2022'
socialImage: '/assets/blog/experimental-ssr/ssr.png'
coverImage: '/assets/blog/experimental-ssr/ssr.png'
lang: 'en'
authors:
  - matthew
---

# Server-side Rendering with Astro

Today we are thrilled to announce experimental support for server-side rendering (SSR) in Astro. With SSR in Astro, we’ve unlocked entirely new use-cases (E-commerce, anyone?) and scale that just weren’t possible before. Our SSR implementation combines Astro’s unique server-first approach with dynamic features like user authentication, login flows, database access, data-fetching and more.

If you’re ready to jump in, head over to [the docs](https://docs.astro.build/en/guides/server-side-rendering/) and get started.

# Motivation

We heard you! One of the questions we get most often is “Can Astro do SSR?”

When we set out to build Astro, we decided to focus on the prebuilt, static site architecture popularly called “Jamstack” (also known static-site generation or SSG). This approach let us iterate and launch new features quickly, but came with some important limitations:

- Large sites can’t pre-render to static HTML without introducing longer build times or slower, client-side rendering of dynamic content.
- Dynamic sites can’t pre-render to static HTML without forcing you to rebuild and redeploy some portion of your site whenever your data changes.
- Interactive sites can’t pre-render to static HTML without moving all user-individualized data to the client. User names, avatars, and permissions all get more complicated when you’re dealing with static, pre-built HTML.

E-commerce is especially hurt by all three of the above problems. In an industry where every millisecond of load performance counts, how can you get the awesome performance of static HTML without the limitations?

From Day 1, we knew that Astro’s approach to island architecture was uniquely positioned to solve this problem. Islands allow pages to load quickly and become interactive lazily; the user sees and is able to interact with the most important parts of the page, faster.

# Enter: Server-Side Rendering (SSR)

Server-side rendering is a well-understood solution to scaling large websites, going back to the earliest days of the internet. SSR is no silver bullet, but, when done right, SSR is an invaluable tool for certain use-cases.

Take user authentication for instance. With static site generation, you have a couple different approaches:

1. Check for a cookie or JWT in localStorage, then redirect to a login page if the user doesn’t have one. If using a cookie this prevents using `HttpOnly`, opening you to malicious JavaScript attacks.

```html
<script>
  if(!parseCookie(document.cookie).auth) {
    window.location = '/login';
  }
</script>
```

Additionally, what do you do if the token is not valid? You still need to check and respond in that case.

2. Call an API that will check if a user is logged in, like `/api/auth`. Going this route is going to mean that you need to show loading spinners in each of your islands while you wait on the response.

```jsx
function App() {
  const auth = useAuth();
  if(auth.loading) return <AnnoyingLoadingSpinner />
  if(!auth.loggedIn) return <LoginPage />;
  return <UserProfile user={auth.user} />
}
```

No matter your approach, going client-side for authentication is always going to mean:

- Things won’t run if JavaScript is disabled.
- Your server can only respond with `200 OK` response codes.
- It’s just plain slow. The user has to wait for the full HTML response (including JS, CSS, etc) even if they then immediately redirect. This creates multiple page requests before the user lands on the correct page.

## Astro SSR: Designed to be Simple

Next.js, Nuxt, Gatsby, SvelteKit, and the whole gang of modern JavaScript meta-frameworks have some idea of SSR already. What makes Astro SSR so special?

Astro has one key advantage over the current set of JavaScript-focused meta-frameworks who have tackled SSR before us: **Astro was designed to run on the server.** 

With Astro you are free to write your server code how it works in your mind, free from the unnecessary abstractions that come with other, “universal” SPA-first frameworks. While SPA-first thinking might be great for super stateful web applications (think dashboards, apps, portals) it’s a cost that most content-focused websites would be better off not paying. 

Here’s how user authentication works in Astro SSR, using only 5 lines of JavaScript:

```astro
---
// Example: src/pages/index.astro
// In an Astro component (*.astro), you write server code directly 
// in the component front matter (this space between the two --- fences). 

// 1. Import any dependencies (Full support for JavaScript/TypeScript)
import { getUser } from '../api/index.js';

// 2. Check that the user token exists and is not malicious.
const user = await getUser(Astro.request);

// 3. If no user was found, return a redirect. This instantly
//    completes the response with the correct status code & headers.
if(!user) {
  return Astro.redirect('/login');
}

// 4. If the user is logged in, you can now use the `user` object
//    right in your page template to show an avatar, name, etc.
---
<html>
...
<h1>Hello {user.name} 👋</h1>
<img src={user.avatar} alt={user.name}>
...
</html>
```

Astro front matter is like a single function call that takes a request and returns a rendered template. Since it’s a function call you can handle the request, fetch data to be fed into the template, and exit early (as with the redirect) if needed.

### API Routes

Astro’s HTML-first approach to web development will get you pretty far on its own, but Astro also supports interactive UI using your favorite framework (like React). When you build for the client, you often need endpoints to read and write data between the user and the server. Built-in API routes are here to deliver that need.

In Astro, an API route is a `.js` or `.ts` file in the `src/pages/` folder, that takes a request and returns a response. API routes were designed for maximum flexibility: 

- Build a form submission handler for JS-free form submission.
- Build an upload handler for user file submissions.
- Build a JSON-based REST API for the client to talk to.
- Build a dynamic asset route to return any file type, including images and videos.

API routes work by exporting a function that implements an HTTP method. Here is an example API route that saves a user profile:

```js
// Example: src/pages/api/profile.js
export function post(params, request) {
  const profile = await request.json();
  await saveProfile(profile);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
```

# Adapters: Deploy Astro Anywhere

Modern web hosts set a high bar for developer experience. Developers expect frameworks to integrate with their favored providers, without too much configuration or setup.

When we built Astro SSR, we evaluated the different ways that other frameworks tackle this problem. In the end, we decided to follow in the footsteps of [SvelteKit](https://kit.svelte.dev/) and [Remix](https://remix.run/) and adopt the idea of ***pluggable host*** ***adapters***. Adapters are simple, pluggable integrations that automatically configure your build for your favorite host.

Not only is the adapter model easy for developers to set up, but it also lets us support as many different kinds of hosts as possible, including:

- Run entirely on the edge with **Cloudflare** and **Deno Deploy**.
- Run on a modern dev platform like **Netlify** and **Vercel**.
- Run on a bare-metal serverless function on **AWS**, **Azure**, and **Google Cloud**.
- Run on a JavaScript server runtime can deploy yourself like **Node.js** and **Deno.**

SSR support in Astro is still experimental. Over the next two months, we’re excited to work with all of the major hosting providers to launch more adapters and partnerships for every platform that our users care about. If you are a hosting provider interested in building your own Adapter for Astro, please reach out to us on Discord or via email: partner@astro.build.

To celebrate this announcement, we were lucky enough to work with our launch partner (and official hosting sponsor) Netlify, to launch an official, day-one adapter for the Netlify platform. The Netlify adapter configures your Astro SSR build to run on Netlify Functions with just one line of code:

```js
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions';

export default defineConfig({
  adapter: netlify()
});
```

To deploy, run your `astro build` and then deploy to Netlify:

<video controls>
    <source src="/assets/blog/experimental-ssr/netlify-deploy-2.mp4 "
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>

# Next Steps

Server-side rendering is available today as an experimental API in the Astro 1.0 Beta. This release is focused on providing the low-level primitives and a foundation to build upon.

To learn more:

- Check out [the docs](https://docs.astro.build/en/guides/server-side-rendering/) to learn the SSR API.
- Visit our [Discord channel](https://discord.com/channels/830184174198718474/852168748353060875) for support and to contribute to stabilizing the APIs.
- Follow us [on Twitter](https://twitter.com/astrodotbuild) where we’ll be posting more guides on SSR later this week.