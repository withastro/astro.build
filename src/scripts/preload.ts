const events = ['mouseenter', 'touchstart', 'focus']

const preloaded = new Set<string>()

function shouldPreload({ href }: { href: string }) {
    try {
        const url = new URL(href)
        return window.location.origin === url.origin
            && window.location.pathname !== url.hash
            && !preloaded.has(href)
    } catch { }

    return false
}

export function preload(elements: string | NodeListOf<HTMLAnchorElement> = 'a[href]') {
    const links = Array.from(
        typeof elements === 'string'
            ? document.querySelectorAll<HTMLAnchorElement>(elements)
            : elements
        ).filter(shouldPreload)

    for (const link of links) {
        preloaded.add(link.href)
        console.log('preload::', link.href)
        events.map(event => link.addEventListener(event, () => fetch(link.href), { once: true }));
    }
}