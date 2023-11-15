import { defineMiddleware } from "astro:middleware";
import { inline } from "css-inline";

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async (context, next) => {
    if (!context.url.pathname.startsWith('/api/v1/integrations')) return next();
    if (!context.request.headers.get('accept')?.includes('text/html')) return next();

    const res = await next();
    const html = await res.text();
    const inlined = inline(html, { base_url: context.url.origin })
    return new Response(inlined, res);
});
