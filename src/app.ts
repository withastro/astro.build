import { FetchState, astro } from 'astro/fetch';

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		// Proxy /fonts/* to fonts-cdn.astro.build
		if (url.pathname.startsWith('/fonts/')) {
			const fontsUrl = `https://fonts-cdn.astro.build${url.pathname}${url.search}`;
			return fetch(fontsUrl);
		}

		const state = new FetchState(request);
		const response = await astro(state);

		console.log(`[app] ${request.method} ${url.pathname} -> ${response.status} (route: ${state.routeData?.route ?? 'none'}, type: ${state.routeData?.type ?? 'none'})`);

		return response;
	},
};
