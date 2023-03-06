export function randomFromArray<T>(list: T[]) {
	return list[Math.floor(Math.random() * list.length)]
}
