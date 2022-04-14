import micromorph from 'micromorph'

let parser: DOMParser

async function navigate(href: string, isBack = false) {
    event.preventDefault()
    event.stopPropagation()

    const contents = await fetch(href)
        .then(res => res.text())
        .catch(() => window.location.assign(href))

    if (!contents) { return }

    if (!isBack) {
        history.pushState({}, '', href)
    }

    parser = parser || new DOMParser()

    const html = parser.parseFromString(contents, 'text/html')

    await micromorph(document, html)
}

export function outlet(elements: string | NodeListOf<HTMLAnchorElement> = 'a') {
    const links = Array.from(typeof elements === 'string'
        ? document.querySelectorAll<HTMLAnchorElement>(elements)
        : elements)

    window.addEventListener('click', async (event: MouseEvent) => {
        if (!(event.target instanceof HTMLAnchorElement)) { return }
        if (!links.includes(event.target)) { return }

        const url = event.target.href

        event.preventDefault()
        event.stopPropagation()

        navigate(url)
    }, true)

    window.addEventListener('popstate', () => {
        try {
            navigate(window.location.toString(), true)
        } catch {
            window.location.reload()
        }
    })
}