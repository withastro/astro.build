import { format, subDays } from 'date-fns';

const END_DATE = format(new Date(), 'yyyy-MM-dd');
const START_DATE = format(
    subDays(new Date(), 7),
    'yyyy-MM-dd'
);

const API_URL = 'https://api.npmjs.org/';
const DOWNLOADS_URL = `${API_URL}downloads/point/${START_DATE}:${END_DATE}/`;

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

const downloadsMap = new Map<string, Promise<string>>();

export async function getDownloadsForPackage(name: string) {
    if (downloadsMap.has(name)) {
        return downloadsMap.get(name);
    }

    const downloads = fetch(`${DOWNLOADS_URL}${name}`)
        .then(res => res.json())
        .then(res => formatter.format(res.downloads))
        .catch((err) => {
            console.error('getDownloadsForPackage', err);
            return undefined;
        });

    downloadsMap.set(name, downloads);

    return await downloads;
}
