import type { ImageMetadata } from '@astrojs/image';

async function loadImage(lazyFile: () => any) {
    const { default: image } = await lazyFile()
    return image as ImageMetadata
}

const showcase = import.meta.glob('/src/data/showcase/images/*');

export async function showcaseImage(pathname: string): Promise<ImageMetadata | undefined> {
    return pathname in showcase ? await loadImage(showcase[pathname]) : undefined;
}

const themes = import.meta.glob('/src/data/themes/images/*');

export async function themeImage(pathname: string): Promise<ImageMetadata | undefined> {
    return pathname in themes ? await loadImage(themes[pathname]) : undefined;
}