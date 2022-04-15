import requestIdleCallback from '../utils/requestIdleCallback'

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

function observe(link: HTMLAnchorElement) {
    preloaded.add(link.href)
    observer.observe(link)
    events.map(event => link.addEventListener(event, onLinkEvent, { once: true }))
}

function unobserve(link: HTMLAnchorElement) {
    observer.unobserve(link)
    events.map(event => link.removeEventListener(event, onLinkEvent))
}

function onLinkEvent({ target }: Event) {
    if (!(target instanceof HTMLAnchorElement)) { return }

    preloadHref(target)
}

async function preloadHref(link: HTMLAnchorElement) {
    unobserve(link)

    const { href } = link

    try {
        const contents = await fetch(href).then(res => res.text())
        parser = parser || new DOMParser()

        const html = parser.parseFromString(contents, 'text/html')
        const styles = Array.from(html.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))

        await Promise.all(styles.map(({ href }) => fetch(href)))
    } catch { }
}

export function preload(elements: string = 'a[href]') {
    observer = observer || new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target instanceof HTMLAnchorElement) {
                preloadHref(entry.target)
            }
        })
    })

    requestIdleCallback(() => {
        const links = Array.from(
            typeof elements === 'string'
                ? document.querySelectorAll<HTMLAnchorElement>(elements)
                : elements
            ).filter(shouldPreload)

        for (const link of links) {
            observe(link)
        }
    })
}
