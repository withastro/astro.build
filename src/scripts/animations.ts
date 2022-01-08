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

const illustrations = Array.from(document.querySelectorAll('.illustration'));
illustrations.forEach(illo => {
    io.observe(illo);
    (illo as HTMLElement).style.setProperty('--animation-play-state', 'paused');
});
