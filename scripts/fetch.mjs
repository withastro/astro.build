import pLimit from 'p-limit';
import pRetry from 'p-retry';

const fetchLimit = pLimit(10);

/**
 * `fetch()` a URL with limited concurrency and retries for error responses.
 * @param {string | URL} url
 * @param {RequestInit} init
 * @returns {Promise<Response>}
 */
export function limitedFetch(url, init = {}) {
	return pRetry(async (attempt) => {
		return fetchLimit(async () => {
			const res = await fetch(url, {
				...init,
				headers: { 'User-Agent': 'astro.build/integrations; v1', ...init.headers },
			});

			// Return early for forbidden, not found, or method not allowed responses.
			// These are unlikely to change with retries.
			if (!res.ok && ![403, 404, 405].includes(res.status)) {
				console.error(`[${url}] ${res.status} ${res.statusText} (Attempt ${attempt})`);
				throw new Error();
			}

			return res;
		});
	});
}
