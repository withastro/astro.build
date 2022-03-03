export function contains<T>(value: T) {
    return function inArray(arr: T[]) {
        return arr.indexOf(value) >= 0;
    }
}