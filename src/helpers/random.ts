export function randomFromArray<T>(list: T[]): T | undefined {
	return list[Math.floor(Math.random() * list.length)];
}
