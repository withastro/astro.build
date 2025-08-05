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
		// Back off retries to give time to recover from 429 Too Many Requests errors.
		await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt - 1)));
		return fetchLimit(async () => {
			const res = await fetch(url, {
				...init,
				headers: { 'User-Agent': 'astro.build/integrations; v1', ...init.headers },
			});

			if (!res.ok && res.status !== 404) {
				console.error(`[${url}] ${res.status} ${res.statusText} (Attempt ${attempt})`);
				throw new Error();
			}

			return res;
		});
	});
}
