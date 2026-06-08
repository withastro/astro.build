import { FetchState, astro } from 'astro/fetch';

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		// Proxy /fonts/* to fonts-cdn.astro.build
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
};
