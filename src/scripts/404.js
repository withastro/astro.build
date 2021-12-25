if (window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
    import('/src/scripts/analytics.js').then(mod => mod.init());
}
