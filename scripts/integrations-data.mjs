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
    "a11y": "accessibility",
    "accessibility": "accessibility",
    "astro-component": "css+ui",
    "analytics": "analytics",
    "cms": "cms",
    "ecommerce": "ecommerce",
    "performance": "performance",
    "renderer": "renderer",
    "seo": "seo",
}

export function keywordToCategory(keyword) {
    return keywordsMap[keyword];
}
