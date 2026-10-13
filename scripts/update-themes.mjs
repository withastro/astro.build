import { stat, writeFile } from 'node:fs/promises';
import z from 'astro/zod';
import sharp from 'sharp';
import currentThemes from '../src/content/themes/themes.json' with { type: 'json' };

/** Schema for validating the data fetched from the dev portal API. */
const ThemeSchema = z.object({
	Theme: z.object({
		slug: z.string(),
		title: z.string(),
		image: z.string(),
		updatedAt: z.coerce.date(),
	}),
	Author: z.object({ name: z.string() }),
});

/**
 * Updates the local theme data and images with new themes from the dev portal.
 *
 * This data intentionally preserves older themes unchanged and does not update existing entries.
 * The data is for use in monthly “What’s New” blog posts, so it is intended to provide historical
 * snapshots of themes, not an up-to-date mirror of the dev portal catalogue.
 */
async function updateThemes() {
	const rawThemeData = await fetch('https://portal.astro.build/api/themes').then((res) =>
		res.json(),
	);
	const themeData = ThemeSchema.array().parse(rawThemeData);

	/** @type {Array<Record<'slug' | 'title' | 'image' | 'author' | 'updatedAt', string>>} */
	const newThemes = [];

	const themesToAdd = themeData.filter(
		(theme) => !currentThemes.some((t) => t.slug === theme.Theme.slug),
	);
	if (themesToAdd.length > 0) {
		console.log(`Adding ${themesToAdd.length} new themes...`);
	} else {
		console.log('No new themes to add.');
		return;
	}

	for (const theme of themesToAdd) {
		console.log(`- ${theme.Theme.slug}`);

		// Download and save an optimized version of the theme thumbnail.
		const imageBuffer = await fetch(theme.Theme.image).then((res) => res.arrayBuffer());
		const optimizedImageBuffer = await sharp(imageBuffer).resize({ width: 800 }).webp().toBuffer();
		await writeFile(`./src/content/themes/images/${theme.Theme.slug}.webp`, optimizedImageBuffer);

		newThemes.push({
			slug: theme.Theme.slug,
			title: theme.Theme.title,
			image: `./images/${theme.Theme.slug}.webp`,
			author: theme.Author.name,
			updatedAt: theme.Theme.updatedAt.toISOString(),
		});
	}

	if (newThemes.length > 0) {
		const updatedThemes = [...currentThemes, ...newThemes];
		await writeFile('./src/content/themes/themes.json', JSON.stringify(updatedThemes, null, 2));
	}
}

await updateThemes();
