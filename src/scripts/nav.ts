const nav = document.querySelector('nav.main') as HTMLElement;

const io = new IntersectionObserver(
  ([e]) => e.target.toggleAttribute('stuck', e.intersectionRatio < 1),
  { threshold: 1 }
)

io.observe(nav)
