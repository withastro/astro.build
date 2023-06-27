import fs from "node:fs/promises"

const githubToken = process.env.GITHUB_TOKEN

export async function githubGet({ url, githubToken = undefined }) {
	let retries = 0
	while (retries < 3) {
		try {
			const headers = {
				Accept: "application/vnd.github.v3+json",
			}
			if (githubToken) headers.Authorization = `token ${githubToken}`
			const response = await fetch(url, { headers })
			if (response.headers.get("content-type")?.startsWith("application/json") === false) {
				return await response.text()
			}
			const json = await response.json()

			if (!response.ok) {
				throw new AbortError(
					`GitHub API call failed: GET "${url}" returned status ${
						response.status
					}: ${JSON.stringify(json)}`,
				)
			}

			return json
		} catch (error) {
			if (error instanceof AbortError) throw error
			console.log(`GitHub API call failed: GET "${url}" returned error: ${error.message}`)
			retries++
			await new Promise((resolve) => setTimeout(resolve, 1000))
		}
	}
}

async function main() {
	let changesets = await githubGet({
		url: "https://api.github.com/repos/withastro/astro/contents/.changeset",
		githubToken,
	})

	let main = []
	let others = []

	for (const changeset of changesets) {
		if (changeset.name === "README.md" || changeset.name === "config.json") continue
		let rawContent = await githubGet({ url: changeset.download_url, githubToken })
		let [, metadata, content] = rawContent.split("---")
		let [pkg, increment] = metadata.split(": ").map((s) => s.trim())

		let lines = content.split("\n")
		while (lines[0] === "") lines.shift()
		let title = lines[0]
		if (title.slice(0, -1).includes(".")) title = pkg === "astro" ? "New feature" : `${pkg} feature`
		else lines.shift()
		while (lines[0] === "") lines.shift()
		content = lines.join("\n")

		if (increment.trim() === "patch") continue
		if (pkg === "astro") main.push({ title, content, increment })
		else others.push({ title, content, increment })
	}

	let version = await fetch(
		"https://raw.githubusercontent.com/withastro/astro/main/packages/astro/package.json",
	)
		.then((res) => res.json())
		.then((json) => json.version)
	let oldVersion = version
	if (main.find((item) => item.increment === "major"))
		version = version
			.split(".")
			.map((v, i) => (i === 0 ? parseInt(v) + 1 : 0))
			.join(".")
	else if (main.find((item) => item.increment === "minor"))
		version = version
			.split(".")
			.map((v, i) => (i === 1 ? parseInt(v) + 1 : 0))
			.join(".")
	let versionSlug = version.split(".").join("")
	let versionShort = version.split(".").slice(0, 2).join(".")

	if (version === oldVersion) {
		console.log("Not a new Astro version, skipping")
		// return
	}

	main.sort((a, b) => (a.increment > b.increment ? 1 : -1))
	others.sort((a, b) => (a.increment > b.increment ? 1 : -1))

	let body = `---
title: "Astro ${versionShort}"
description: ""
publishDate: ""
authors:
  - your-name-here
coverImage: ""
socialImage: ""
lang: "en"
---

{/* Introduce Astro ${versionShort} */}

If you already have Astro installed, you can upgrade it to ${versionShort} by running the \`upgrade\` command in your project (using your package manager of choice):

\`\`\`
npm install astro@latest
pnpm upgrade astro@latest
yarn upgrade astro@latest
\`\`\`

While you're at it, upgrade any \`@astrojs/*\` integrations and adapters you have installed, too!

${main.map((item) => `## ${item.title}\n\n${item.content}`).join("\n\n")}

${others.map((item) => `## ${item.title}\n\n${item.content}`).join("\n\n")}
`
	await fs.writeFile(`./src/content/blog/astro-${versionSlug}.mdx`, body)
}

await main()
