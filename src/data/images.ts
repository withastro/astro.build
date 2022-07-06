import type { ImageMetadata } from '@astrojs/image';

const showcase = import.meta.glob('/src/data/showcase/images/*');

async function loadImage(lazyFile: () => any) {
    const { default: image } = await lazyFile()
    return image as ImageMetadata
}

export async function showcaseImage(pathname: string): Promise<ImageMetadata | undefined> {
    return pathname in showcase ? await loadImage(showcase[pathname]) : undefined;
}