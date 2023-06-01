export function uniq(...values: string[]) {
	const set = new Set()
	values.forEach((value) => set.add(value))
	return Array.from(set.values())
}
