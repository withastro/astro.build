import { FetchState, astro } from 'astro/fetch';

const originalFetch = globalThis.fetch;
globalThis.fetch = async function patchedFetch(input: RequestInfo | URL, init?: RequestInit) {
	const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
	console.log(`[fetch] -> ${url}`);
	try {
		const res = await originalFetch(input, init);
		const contentType = res.headers.get('content-type') ?? 'no content-type';
		console.log(`[fetch] <- ${url} ${res.status} ${contentType}`);
		if (!res.ok) {
			const body = await res.clone().text();
			console.error(`[fetch] ERROR BODY ${url}: ${body.slice(0, 1000)}`);
		}
		return res;
	} catch (err) {
		console.error(`[fetch] FAILED ${url}`, err);
		throw err;
	}
};

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		console.log(`[app] incoming: ${request.method} ${url.pathname}${url.search}`);

		// Proxy /fonts/* to fonts-cdn.astro.build
		if (url.pathname.startsWith('/fonts/')) {
			const fontsUrl = `https://fonts-cdn.astro.build${url.pathname}${url.search}`;
			console.log(`[app] proxying fonts to ${fontsUrl}`);
			return fetch(fontsUrl);
		}

		const state = new FetchState(request);

		try {
			const response = await astro(state);
			console.log(`[app] ${request.method} ${url.pathname} -> ${response.status} (route: ${state.routeData?.route ?? 'none'}, type: ${state.routeData?.type ?? 'none'})`);
			return response;
		} catch (err) {
			console.error(`[app] ERROR on ${url.pathname}:`, err);
			throw err;
		}
	},
};
