---
title: "Astro-Vitae"
description: "A Curriculum Vitae (CV) with a simple single-page layout. Just update your details in javascript variables and objects, and your CV is live."
image: "/src/content/themes/_images/astro-vitae-hero.webp"
images:
  - "/src/content/themes/_images/astro-vitae-2.webp"
  - "/src/content/themes/_images/astro-vitae-3.webp"
author:
  url: "https://github.com/USKhokhar"
  name: "USKhokhar"
  avatar: "https://avatars.githubusercontent.com/u/63156376?v=4"
categories:
  - "portfolio"
repoUrl: "https://github.com/USKhokhar/astro-vitae"
demoUrl: "https://astro-vitae.vercel.app/"
tools:
  - "alpinejs"
  - "tailwind"
stars: 5
---

<p>
  Astro-Vitae is a free, personalized CV template with a sleek &amp; minimal design which helps in
  simplifying the process of getting a CV for yourself. So much so that someone with minimal
  knowledge of coding can easily get their CV just by updating their details.
</p>
<p>
  In order to change the content of the CV, all you have to do is update it in the content.js file
  in /src folder.
</p>
<p>
  In src/content.js all variables contain information that is to be reflected in the UI. In order to
  change it, simply update the values with your data. The personal information is fairly simple,
  content for the likes of work, projects, etc are stored as JavaScript objects.
</p>
<p><strong>Adding or Removing a field</strong></p>
<p><br /></p>
<p>To add or remove a field from the CV, simply go to Container.astro in src/components/</p>
<ul>
  <li>
    To Add a new field, add a new <code>&lt;AccordionLayout /&gt;</code> component, with appropriate props and
    child component. Make sure to add the data of the field in a proper format in content.js.
  </li>
  <li>
    To Remove an already existing field, simply comment out the <code>&lt;AccordionLayout /&gt;</code> component
    of that particular field or remove it. Removing its content from content.js is a choice.
  </li>
</ul>
