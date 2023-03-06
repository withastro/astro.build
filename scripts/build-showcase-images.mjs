import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import glob from "tiny-glob"

async function main() {
	const allImages = await glob("../src/content/showcase/_images/**/*.{jpg,jpeg,png}")

	for (const input of allImages) {
		const outputBuffer = await sharp(input)
			.webp()
			.resize(800, null, { withoutEnlargement: true })
			.toBuffer()

		const basename = path.basename(input)
		const filename = input.replace(basename, basename.replace(path.extname(input), ".webp"))

		console.log(`${input} => ${filename}`)

		await fs.writeFile(filename, outputBuffer)
	}

	for (const input of allImages) {
		const outputBuffer = await sharp(input)
			.webp()
			.resize(1600, null, { withoutEnlargement: true })
			.toBuffer()

		const basename = path.basename(input)
		const filename = input.replace(basename, basename.replace(path.extname(input), "@2x.webp"))

		console.log(`${input} => ${filename}`)

		await fs.writeFile(filename, outputBuffer)

		await fs.rm(input)
	}
}

main()
