if (window.matchMedia('(hover: hover) and and (prefers-reduced-motion: no-preference)').matches) {
    import('/src/scripts/analytics.js').then(mod => mod.lazy());
}
