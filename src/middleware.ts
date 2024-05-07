import { defineMiddleware } from "astro:middleware";
import { geolocation } from '@vercel/edge';

export const onRequest = defineMiddleware(({ request, url, locals }, next) => {
    if (url.pathname !== '/') return next();
    locals.geo = geolocation(request)
    return next();
})

