import type { Fetchable } from 'astro';
import { FetchState, astro } from 'astro/fetch';

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		// Proxy /fonts/* to fonts-cdn.astro.build. The font CDN is origin-locked
		// and only serves requests with an `astro.build` Origin, so we proxy them
		// server-side to keep the fonts same-origin for the browser (avoids CORS
		// failures on preview deployments).
		if (url.pathname.startsWith('/fonts/')) {
			const fontsUrl = `https://fonts-cdn.astro.build${url.pathname.replace('/fonts/', '/')}${url.search}`;
			return fetch(fontsUrl, {
				headers: {
					Origin: 'https://astro.build',
				},
			});
		}

		const state = new FetchState(request);
		return astro(state);
	},
} satisfies Fetchable;
