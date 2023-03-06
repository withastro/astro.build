import path from "node:path"

export function to2xPath(src: string) {
	const ext = path.extname(src)
	return src.replace(ext, `@2x${ext}`)
}

export function srcToDensity(src: string, density?: number) {
	if (!density || density <= 1) {
		return src
	}

	const ext = path.extname(src)
	return src.replace(ext, `@${density}x${ext}`)
}
