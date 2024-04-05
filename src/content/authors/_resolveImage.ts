import type { CollectionEntry } from "astro:content";

const allImages = import.meta.glob<{ default: ImageMetadata }>(
	"/src/content/authors/_images/*.{png,jpg,jpeg,webp}",
);

export async function resolveImage(entry: CollectionEntry<"authors">) {
	if (!entry.data.image) {
		return undefined;
	}

	if (!(entry.data.image in allImages)) {
		throw new Error(
			`[authors] Image for "${entry.data.title}" not found! Provided: "${entry.data.image}", is there a typo?`,
		);
	}

	const { default: image } = await allImages[entry.data.image]();

	return image;
}
