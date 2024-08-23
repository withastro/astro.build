/** Adds a trailing `/` to the passed path if needed. */
export const ensureTrailingSlash = (path: string) => {
	const url = new URL(path, 'https://example.com');
	if (url.pathname.at(-1) !== '/') url.pathname += '/';
	return url.href.slice(url.origin.length);
};
