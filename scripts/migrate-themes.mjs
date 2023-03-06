import yaml from "json-to-pretty-yaml"
import fs from "node:fs"
import path from "node:path"

function migrateImage(src) {
	return src.replace("./images", "/src/content/themes/_images").replace(path.extname(src), ".webp")
}

function main() {
	const blob = fs.readFileSync("./themes.json", "utf-8")
	const data = JSON.parse(blob)

	const themes = data.map((t) => {
		const theme = {
			slug: t.slug,
			title: t.title,
			description: t.description,
			fullDescription: t.fullDescription,
			image: migrateImage(t.image.src),
			images: t.images.map(({ src }) => migrateImage(src)),
			author: {
				url: t.author.href,
				name: t.author.text,
				avatar: t.author.avatar,
			},
			categories: t.categories,
			repoUrl: t.repoUrl?.href,
			demoUrl: t.demoUrl?.href,
			buyUrl: t.buyUrl?.href,
			links: t.links,
			stars: t.stars,
			featured: t.featured,
			tools: t.tags,
		}

		if (t.official) {
			theme.categories = ["official", ...theme.categories]
		}

		if (t.featured) {
			theme.categories = ["featured", ...theme.categories]
		}

		return theme
	})

	for (const { slug, fullDescription, ...theme } of themes) {
		const file = `../src/content/themes/${slug}.md`

		const frontmatter = yaml.stringify(theme)

		const directory = path.dirname(file)

		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory)
		}

		fs.writeFileSync(
			file,
			`---
${frontmatter}---${fullDescription ? `\n\n${fullDescription}` : ""}\n`,
		)
	}
}

main()
