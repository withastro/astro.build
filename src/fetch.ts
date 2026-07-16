import type { Fetchable } from 'astro';
import { astro, FetchState } from 'astro/fetch';

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		// Proxy /fonts/* to fonts-cdn.astro.build. The font CDN is origin-locked
		// and only serves requests with an `astro.build` Origin, so we proxy them
		// server-side to keep the fonts same-origin for the browser (avoids CORS
		// failures on preview deployments).
		if (url.pathname.startsWith('/fonts/')) {
			const fontsUrl = `https://fonts-cdn.astro.build${url.pathname.replace('/fonts/', '/')}${url.search}`;
			try {
				return await fetch(fontsUrl, {
					headers: {
						Origin: 'https://astro.build',
					},
				});
			} catch (error) {
				// The font CDN can be unreachable (e.g. in local dev the origin-locked
				// host isn't resolvable). Degrade to a 404 so a failed font request
				// doesn't surface as a 500 that breaks the whole page.
				console.error(`[fonts] failed to proxy ${fontsUrl}:`, error);
				return new Response('Font not found', { status: 404 });
			}
		}

		const state = new FetchState(request);
		return astro(state);
	},
} satisfies Fetchable;
