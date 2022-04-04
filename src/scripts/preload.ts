const links = document.querySelectorAll<HTMLAnchorElement>('a')

function preload(href: string) {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", href)
    xhr.send()
}

function onPreload(event: MouseEvent) {
    const target = event.target as HTMLAnchorElement;

    if (!target.href) {
        return;
    }

    target.removeEventListener('mouseenter', onPreload, true);
    target.removeEventListener('touchstart', onPreload, true);

    preload(target.href);
}

for (const link of links) {
    if (link.href.startsWith(location.origin)) {
        link.addEventListener('mouseenter', onPreload, true);
        link.addEventListener('touchstart', onPreload, true);
    }
}