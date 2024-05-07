import { defineMiddleware } from "astro:middleware";
import { geolocation } from '@vercel/edge';
import haversine from 'haversine-distance';

const destination = {
    latitude: 45.50129261983394,
    longitude: -73.57146217022046
}

export const onRequest = defineMiddleware(({ request, url }, next) => {
    console.log('test', url.pathname)
    if (url.pathname !== '/') return next();
    const { latitude, longitude } = geolocation(request);
    if (!(latitude && longitude)) return next();
    const distance = haversine({ latitude: Number.parseFloat(latitude), longitude: Number.parseFloat(longitude) }, destination)
    const hours = Math.round(distance / 100);
    console.log({ distance, hours });
    return next();
})
