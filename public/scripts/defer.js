if (window.matchMedia('(hover: hover)').matches) {
    import('/scripts/analytics.js').then(mod => mod.init());
}
