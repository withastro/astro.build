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

/**
 * Gets an integration category for a given NPM package keyword, or undefined if it isn't recognized.
 * 
 * @param {String} keyword Keyword from npm package (case insensitive)
 * @returns {String | undefined }
 */
export function keywordToCategory(keyword) {
    return keywordsMap[keyword.toLowerCase()];
}
