const timeouts = new Map();
const triggered = new Set();
const DELAY = 1000;
function trigger(el: HTMLElement) {
    const key = el.id;
    if (triggered.has(key)) {
        return;
    }
    clear(el);
    timeouts.set(key, setTimeout(() => {
        el.style.setProperty('--animation-play-state', 'running');
        triggered.add(key);
        io.unobserve(el);
        timeouts.delete(key);
    }, DELAY));
}
function clear(el: HTMLElement) {
    const key = el.id;
    if (timeouts.has(key)) {
        const handle = timeouts.get(key);
        clearTimeout(handle);
        timeouts.delete(key);
    }
}
const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {  
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting && entry.intersectionRatio > 0.9) {
            trigger(el);
        } else {
            clear(el);
            el.style.setProperty('--animation-play-state', 'paused');
        }
    }
}, { threshold: [0, 0.5, 1] });

async function loop(element: Element) {
    const animations = element.getAnimations({ subtree: true });
    await Promise.all(animations.map(anim => anim.finished));
    // reset the animation after 3.5 seconds
    setTimeout(() => {
        const clone = element.cloneNode(true)
        element.replaceWith(clone);
        loop(clone as Element);
    }, 3500)
}

function setup() {
    timeouts.clear();
    triggered.clear();
    const illustrations = Array.from(document.querySelectorAll('.illustration'));
    illustrations.forEach(illo => io.observe(illo));

    const hydrate = illustrations.find(el => (el as HTMLElement).dataset.name === 'hydration');
    loop(hydrate);
}
setup();
window.addEventListener('astro:navchange', () => {
    console.log('astro:navchange')
    setup();
});
