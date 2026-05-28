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
		const headers = Object.fromEntries(request.headers.entries());
		console.log(`[app] incoming: ${request.method} ${url.pathname}${url.search}`);
		console.log(`[app] full URL: ${request.url}`);
		console.log(`[app] headers: ${JSON.stringify(headers)}`);

		// Proxy /fonts/* to fonts-cdn.astro.build
		if (url.pathname.startsWith('/fonts/')) {
			const fontsUrl = `https://fonts-cdn.astro.build${url.pathname}${url.search}`;
			console.log(`[app] proxying fonts to ${fontsUrl}`);
			return fetch(fontsUrl);
		}

		const state = new FetchState(request);
		console.log(`[app] FetchState created. routeData: ${JSON.stringify(state.routeData ? { route: state.routeData.route, type: state.routeData.type, pathname: state.routeData.pathname, pattern: state.routeData.pattern?.toString() } : null)}`);
		console.log(`[app] state.pathname: ${state.pathname}`);
		console.log(`[app] state.url: ${state.url.toString()}`);
		console.log(`[app] state.status: ${state.status}`);

		try {
			const response = await astro(state);
			const responseHeaders = Object.fromEntries(response.headers.entries());
			console.log(`[app] ${request.method} ${url.pathname} -> ${response.status} (route: ${state.routeData?.route ?? 'none'}, type: ${state.routeData?.type ?? 'none'})`);
			console.log(`[app] response headers: ${JSON.stringify(responseHeaders)}`);
			if (response.status >= 400) {
				const body = await response.clone().text();
				console.error(`[app] ERROR RESPONSE BODY (${response.status}): ${body.slice(0, 2000)}`);
			}
			return response;
		} catch (err) {
			console.error(`[app] ERROR on ${url.pathname}:`, err);
			throw err;
		}
	},
};
