// @ts-check

// This script fetches the latest Astro stats from various APIs
// and updates the src/data/stats.json file accordingly.

import { writeFile } from 'node:fs/promises';
import { z } from 'astro/zod';
import data from '../src/data/stats.json' with { type: 'json' };

console.log('‣ Fetching latest stats...');

// Fetch the latest Astro download stats from the NPM registry.
const npm = z
	.object({ downloads: z.number() })
	.parse(
		await fetch('http://api.npmjs.org/downloads/point/last-month/astro').then((res) => res.json()),
	);
console.log(`✔︎ npm downloads: ${npm.downloads}`);

// Fetch the latest Astro GitHub stars count from the GitHub API.
const github = z
	.object({ stargazers_count: z.number() })
	.parse(await fetch('https://api.github.com/repos/withastro/astro').then((res) => res.json()));
console.log(`✔︎ GitHub stars: ${github.stargazers_count}`);

// Fetch the latest Astro Mastodon followers count from the Mastodon API.
const mastodon = z
	.object({ followers_count: z.number() })
	.parse(
		await fetch('https://m.webtoo.ls/api/v1/accounts/lookup?acct=astro').then((res) => res.json()),
	);
console.log(`✔︎ Mastodon followers: ${mastodon.followers_count}`);

// Fetch the latest Astro Bluesky followers count from the Bluesky API.
const bluesky = z
	.object({ followersCount: z.number() })
	.parse(
		await fetch(
			'https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=astro.build',
		).then((res) => res.json()),
	);
console.log(`✔︎ Bluesky followers: ${bluesky.followersCount}`);

// Update stats data.
data.downloads = npm.downloads;
data.stars = github.stargazers_count;
data.followers.mastodon = mastodon.followers_count;
data.followers.bluesky = bluesky.followersCount;

// Fetch the latest Astro Twitter followers count from the Twitter API.
// Conditional because it’s the one API that needs authorization.
if (process.env.TWITTER_BEARER_TOKEN) {
	const twitter = z
		.object({
			data: z.object({
				public_metrics: z.object({ followers_count: z.number() }),
			}),
		})
		.parse(
			await fetch(
				'https://api.x.com/2/users/by/username/astrodotbuild?user.fields=public_metrics',
				{ headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` } },
			).then((res) => res.json()),
		);
	console.log(`✔︎ Twitter followers: ${twitter.data.public_metrics.followers_count}`);
	data.followers.twitter = twitter.data.public_metrics.followers_count;
}

// Write updated stats back to src/data/stats.json.
console.log('‣ Writing updated stats to src/data/stats.json...');
await writeFile('src/data/stats.json', JSON.stringify(data, null, '\t'));
console.log('✔︎ Stats updated successfully!');
