import type { CollectionEntry } from "astro:content"
import { srcToDensity } from "~/helpers/images.js"

const allImages = import.meta.glob<{ default: ImageMetadata }>(
	"/src/content/showcase/_images/*.{png,jpg,jpeg,webp}",
)

export async function resolveImage(entry: CollectionEntry<"showcase">, density?: number) {
	const src = density ? srcToDensity(entry.data.image, density) : entry.data.image

	if (!(src in allImages)) {
		throw new Error(
			`[showcase] Image for "${entry.data.title}" not found! Provided: "${src}", is there a typo?`,
		)
	}

	const { default: image } = await allImages[src]()

	return image
}
