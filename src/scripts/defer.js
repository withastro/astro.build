if (window.matchMedia('(hover: hover)').matches) {
    import('/src/scripts/analytics.js').then(mod => mod.lazy());
}
