export function uniq<T>(arr: T[]) {
    return Array.from(new Set(arr));
}