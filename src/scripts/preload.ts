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
let observer: IntersectionObserver

async function preloadHref(link: HTMLAnchorElement) {
    observer.unobserve(link)

    const { href } = link

    try {
        const contents = await fetch(href).then(res => res.text())
        parser = parser || new DOMParser()

        const html = parser.parseFromString(contents, 'text/html')
        const styles = Array.from(html.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))

        await Promise.all(styles.map(({ href }) => fetch(href)))
    } catch { }
}

export function preload(elements: string | NodeListOf<HTMLAnchorElement> = 'a[href]') {
    const links = Array.from(
        typeof elements === 'string'
            ? document.querySelectorAll<HTMLAnchorElement>(elements)
            : elements
        ).filter(shouldPreload)

    observer = observer || new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target instanceof HTMLAnchorElement) {
                preloadHref(entry.target)
            }
        })
    })

    for (const link of links) {
        preloaded.add(link.href)
        observer.observe(link)
        events.map(event => link.addEventListener(event, () => preloadHref(link), { once: true }));
    }
}
