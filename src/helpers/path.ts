function isString(path: unknown): path is string {
	return typeof path === "string" || path instanceof String
}

export function trimSlashes(path: string) {
	return path.replace(/^\/|\/$/g, "")
}

export function joinPaths(...paths: (string | undefined)[]) {
	return `/${paths.filter(isString).map(trimSlashes).join("/")}`
}
