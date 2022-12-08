/** Any value can be thrown in JS!
 * This function returns the value if it's already an error,
 * or turns it into one if it's not
 *
 * ```ts
 * try {
 *   throw 'hello'
 * } catch (error) {
 *   console.log(toError(error).message)
 * }
 * ```
 */
export function toError(value: unknown) {
    return value instanceof Error ? value : new Error(String(value))
}
