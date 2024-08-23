/** Adds a trailing `/` to the passed path if needed. */
export const ensureTrailingSlash = (path: string) => {
	const fakeOrigin = 'https://example.com';
	const url = new URL(path, fakeOrigin);
	if (url.pathname.at(-1) !== '/') url.pathname += '/';
	return url.href.slice(fakeOrigin.length);
};
