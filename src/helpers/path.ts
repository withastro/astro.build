/** Adds a trailing `/` to the passed path if needed. */
export const ensureTrailingSlash = (path: string) => (path.at(-1) === '/' ? path : `${path}/`);
