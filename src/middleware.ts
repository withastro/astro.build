import { defineMiddleware } from "astro:middleware";
import { geolocation } from '@vercel/edge';

export const onRequest = defineMiddleware(({ request, url }, next) => {
    console.log('test', url.pathname)
    if (url.pathname !== '/') return next();
    const geo = geolocation(request);
    console.log(geo);
    return next();
})
