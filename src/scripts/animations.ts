const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {  
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting && entry.intersectionRatio > 0.9) {
            el.style.setProperty('--animation-play-state', 'running');
            io.unobserve(entry.target);
        } else {
            el.style.setProperty('--animation-play-state', 'paused');
        }
    }
}, { threshold: [0, 0.5, 1] });

const illustrations = Array.from(document.querySelectorAll('.illustration'));
illustrations.forEach(illo => io.observe(illo));
