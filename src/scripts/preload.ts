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

let parser: DOMParser

async function preloadHref(href: string) {
    const contents = await fetch(href).then(res => res.text())
    parser = parser || new DOMParser()

    const html = parser.parseFromString(contents, 'text/html')
    const styles = Array.from(html.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))

    await Promise.all(styles.map(({ href }) => fetch(href)))
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
        events.map(event => link.addEventListener(event, () => preloadHref(link.href), { once: true }));
    }
}