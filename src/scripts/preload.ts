const events = ['mouseenter', 'touchstart', 'focus']

export function preload(elements: string | NodeListOf<HTMLAnchorElement> = 'a[href]') {
    const links = typeof elements === 'string'
        ? document.querySelectorAll<HTMLAnchorElement>(elements)
        : elements

    for (const link of links) {
        if (link.href.startsWith(location.origin) && link.href !== location.href) {
            events.map(event => link.addEventListener(event, () => fetch(link.href), { once: true }));
        }
    }
}