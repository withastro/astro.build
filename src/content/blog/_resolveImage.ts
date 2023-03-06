import type { ImageMetadata } from "@astrojs/image/dist/vite-plugin-astro-image.js"
import { CollectionEntry } from "astro:content"

const allImages = import.meta.glob<{ default: ImageMetadata }>(
	"/src/content/blog/_images/**/*.{png,jpg,jpeg,webp}",
)

export async function resolveCoverImage(entry: CollectionEntry<"blog">) {
	if (!entry.data.coverImage) {
		return undefined
	}

	if (!(entry.data.coverImage in allImages)) {
		throw new Error(
			`[blog] Cover image for "${entry.data.title}" not found! Provided: "${entry.data.coverImage}", is there a typo?`,
		)
	}

	const { default: image } = await allImages[entry.data.coverImage]()

	return image
}

export async function resolveSocialImage(entry: CollectionEntry<"blog">) {
	if (!entry.data.socialImage) {
		return undefined
	}

	if (!(entry.data.socialImage in allImages)) {
		throw new Error(
			`[blog] Social image for "${entry.data.title}" not found! Provided: "${entry.data.socialImage}", is there a typo?`,
		)
	}

	const { default: image } = await allImages[entry.data.socialImage]()

	return image
}
