---
seo:
  title: Telemetry
  description: Astro collects anonymous telemetry data about general usage to help inform our roadmap. Participation is optional and you may opt-out at any time.
updated_date: 2023-03-01
---

The `astro` CLI collects **anonymous telemetry data** about general usage. Participation is optional, and you may opt-out at any time.

## Why is telemetry collected?

Anonymous telemetry data makes up an important piece of our roadmap prioritization process. It gives our core team insight into broad trends in feature usage, pain points, and configuration which then helps us make more informed decisions about what to work on next.

## What is being collected?

We track general usage information about Astro and different configuration options that we support. Specifically, we track the following anonymous data:

- Command invoked (`astro build`, `astro dev`, `astro preview`, etc.)
- Astro version
- General machine information (e.g. number of CPUs, macOS/Windows/Linux, CI environment, etc.)
- Integrations, adapters, markdown options, and other select configuration
- Errors during the build process

This list is regularly audited to ensure its accuracy. You can audit telemetry yourself locally by settings the `DEBUG=”astro:telemetry”` environment variable when running the Astro CLI.

An example telemetry event might look like this:

```json
{
  "cliCommand": "dev",
  "config": {
    "markdownPlugins": [],
    "adapter": "@astrojs/vercel",
    "integrations": ["@astrojs/mdx", "@astrojs/rss"],
    "markdown": {
      "syntaxHighlight": "shiki"
    }
  }
}
```

## What about sensitive data?

We **do not** collect any metrics which may contain sensitive data. This includes, but is not limited to: environment variables, personally identifiable information, file paths, contents of files, logs, stack traces, git remote information, or un-serialized JavaScript error messages.

We take your privacy very seriously. You can read our [privacy policy](https://astro.build/privacy/) to learn more.

## How is my data protected?

The data collected by the Astro CLI is completely anonymous and only meaningful in aggregate form. The data that we store is not traceable to the source, and is only available to a small subset of the Astro core maintainer team to help inform our roadmap prioritization.

None of the data that we collect is personally identifiable. It has never and will never be sold or monetized in any form.

## How do I opt out?

You can also opt-out by running `astro telemetry disable` in the root of any Astro project directory:

```bash
npx astro telemetry disable
```

You can re-enable telemetry at any time by running `astro telemetry enable` in the root of any Astro project directory:

```bash
npx astro telemetry enable
```

You can also opt-out by setting the environment variable: `ASTRO_TELEMETRY_DISABLED=1`. If this environment variable is set when Astro runs, it will disable all telemetry.
