function flyout(elem: HTMLDetailsElement) {
    elem.onmouseenter = () => {
        elem.setAttribute('open', 'open');
    }
    elem.onmouseleave = () => {
        elem.removeAttribute('open');
    };
}

Array.from(document.querySelectorAll<HTMLDetailsElement>('details.flyout'))
    .map(flyout);
