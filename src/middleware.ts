import { defineMiddleware } from "astro:middleware";
import { geolocation } from '@vercel/edge';

export const onRequest = defineMiddleware(({ request, url }, next) => {
    if (url.pathname !== '/') return;
    const geo = geolocation(request);
    console.log(geo);
    return next();
})
