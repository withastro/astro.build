---
title: "Supabase Serverside"
description: "Server side rendering minimal astro template integrated with supabase authentication."
image: "/src/content/themes/_images/supabase-serverside-hero.webp"
author:
  url: "https://github.com/fracalo"
  name: "fracalo"
  avatar: "https://avatars.githubusercontent.com/u/4067487?v=4"
categories:
  - "other"
repoUrl: "https://github.com/fracalo/astro-supabase-ss"
tools:
  - "typescript"
publishDate: "September 19, 2023"
stars: 17
---

<p>
  This is a basic astro template with Supabase SSR integration.
</p>
<h2>Supabase + Astro = ❤️</h2>
<p>
  The auth flow is made on the client, tokens are then passed to the server through cookies, the authentication for private pages is performed on the server.
</p>
<h3>Prerequisites</h3>
<p>The template builds on top of Astro's default blank theme, the structure should be self explanatory but if you have any doubts you'll probably find most answers in the astro docs.</p>
<p>For the service I'm using the supabase local development setup.</p>
<p>Supabase should be configured with "user management data" template (in the SQL editor), in alternative you can run the sql queries following this guide (just for the supabase configuration).</p>
<p>A boilerplate .env file with placeholders is provided, you'll need to add your supabase keys there.</p>
<h3>Included pages</h3>
<ul>
  <li>home: which has no authentication requirements.</li>
  <li>profile: reachable only if authenticated.</li>
  <li>login: if authentication is already in place it will redirect to the home page.</li>
</ul>
