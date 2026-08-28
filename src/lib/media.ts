import manifest from '@/generated/image-manifest.json';

export interface ImageEntry {
  width: number;
  height: number;
  blur: string;
  fallback: string;
  sources: { avif: string; webp: string; jpeg: string };
}

const images = manifest as Record<string, ImageEntry>;

/** Manifest lookup. Returns undefined for a key the pipeline never produced. */
export function image(slug: string): ImageEntry | undefined {
  return images[slug];
}

export function hasImage(slug: string): boolean {
  return slug in images;
}

export const imageSlugs = Object.keys(images);
