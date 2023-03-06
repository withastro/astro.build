import yaml from "json-to-pretty-yaml"
import fs from "node:fs"
import path from "node:path"
import slugify from "slugify"

function main() {
	const blob = fs.readFileSync("./integrations.json", "utf-8")
	const data = JSON.parse(blob)

	const integrations = data.map((i) => {
		const integration = {
			name: i.slug,
			title: i.title,
			description: i.description,
			categories: i.featured ? [...i.categories, "featured"] : i.categories,
			npmUrl: i.npmUrl.href,
			image: i.image?.src,
			repoUrl: i.repoUrl?.href,
			featured: i.featured,
			homepageUrl: i.url?.href,
			downloads: i.downloads,
		}

		return integration
	})

	for (const integration of integrations) {
		const slug = slugify(integration.name)
		const file = `../src/content/integrations/${slug}.md`

		const frontmatter = yaml.stringify(integration)

		const directory = path.dirname(file)

		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory)
		}

		fs.writeFileSync(
			file,
			`---
${frontmatter}---\n`,
		)
	}
}

main()
