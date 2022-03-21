export const overrides = {
    "astro-analytics": {
        "categories": ["analytics"]
    },
    "astro-xelement": {
        "description": "XElement is a powerful Astro Web Component generator."
    },
    "astro-pandoc": {
        "description": "Astro component for using pandoc to convert content."
    },
    "astro-seo": {
        "categories": ["seo"]
    },
};

export const keywordsMap = {
    "astro-component": "css+ui",
    "seo": "seo",
    "analytics": "analytics",
    "cms": "cms",
    "astro-renderer": "renderers"
}

export function keywordToCategory(keyword) {
    return keywordsMap[keyword];
}
