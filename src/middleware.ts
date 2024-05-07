import { defineMiddleware } from "astro:middleware";
import { geolocation } from '@vercel/edge';
import haversine from 'haversine-distance';

const pointB = {
    latitude: 45.50129,
    longitude: -73.57146
}

export const onRequest = defineMiddleware(({ request, url }, next) => {
    console.log('test', url.pathname)
    if (url.pathname !== '/') return next();
    const { latitude, longitude } = geolocation(request);
    if (!(latitude && longitude)) return next();
    const pointA = {
        latitude: Number.parseFloat(latitude),
        longitude: Number.parseFloat(longitude),
    }
    const distance = haversine(pointA, pointB)
    const hours = Math.round(distance / (100 /*km/h*/ * 1000 /*m*/));
    console.log({ latitude, longitude, distance, hours });
    return next();
})
