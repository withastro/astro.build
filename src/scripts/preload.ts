const links = document.querySelectorAll<HTMLAnchorElement>('a')

function onPreload(event: MouseEvent) {
    const target = event.target as HTMLAnchorElement;

    if (!target.href) {
        return;
    }
    
    const link = document.createElement('link');
    link.rel = 'prerender';
    link.href = target.href;
    document.head.appendChild(link);
    target.removeEventListener('mouseenter', onPreload, true);
    target.removeEventListener('touchstart', onPreload, true);
}

for (const link of links) {
    if (link.href.startsWith(location.origin)) {
        link.addEventListener('mouseenter', onPreload, true);
        link.addEventListener('touchstart', onPreload, true);
    }
}