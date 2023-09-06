import { getCollection, type CollectionEntry } from "astro:content"

export async function getRelatedThemes(theme: CollectionEntry<"themes">, count = 3) {
	// removing the current theme here makes sure a theme never recommends itself
	const otherThemes = await getCollection("themes", (t) => t.slug !== theme.slug)

	const related: CollectionEntry<"themes">[] = []
	const relatedSlugs = new Set<string>()

	// check the markdown first, we can hard-code related themes
	for (const slug of theme.data.related) {
		const entry = otherThemes.find((t) => t.slug === slug)

		if (entry) {
			related.push(entry)
			relatedSlugs.add(slug)
		}
	}

	// if necessary, grab more by the same author
	if (related.length < count) {
		for (const entry of otherThemes) {
			// check for duplicates
			if (relatedSlugs.has(entry.slug)) {
				continue
			}

			if (entry.data.author.url === theme.data.author.url) {
				related.push(entry)
				relatedSlugs.add(entry.slug)
			}
		}
	}

	// finally, grab themes from the same category
	if (related.length < count) {
		for (const entry of otherThemes) {
			// check for duplicates
			if (relatedSlugs.has(entry.slug)) {
				continue
			}

			if (entry.data.categories.some((c) => theme.data.categories.includes(c))) {
				related.push(entry)
				relatedSlugs.add(entry.slug)
			}
		}
	}

	return related.slice(0, count)
}
