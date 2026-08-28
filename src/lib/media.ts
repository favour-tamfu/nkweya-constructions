import manifest from '@/generated/image-manifest.json';
import { asset, assetSrcSet } from '@/lib/base-path';

export interface ImageEntry {
  width: number;
  height: number;
  blur: string;
  fallback: string;
  sources: { avif: string; webp: string; jpeg: string };
}

const raw = manifest as Record<string, ImageEntry>;

/**
 * The manifest stores root-absolute paths (`/media/…`). Those go straight into
 * `<img src>` and `<source srcSet>`, which Next does not rewrite for
 * `basePath`, so the prefix is applied once here rather than at every call
 * site. `blur` is a data: URI and is left alone.
 */
const images: Record<string, ImageEntry> = Object.fromEntries(
  Object.entries(raw).map(([slug, entry]) => [
    slug,
    {
      ...entry,
      fallback: asset(entry.fallback),
      sources: {
        avif: assetSrcSet(entry.sources.avif),
        webp: assetSrcSet(entry.sources.webp),
        jpeg: assetSrcSet(entry.sources.jpeg),
      },
    },
  ]),
);

/** Manifest lookup. Returns undefined for a key the pipeline never produced. */
export function image(slug: string): ImageEntry | undefined {
  return images[slug];
}

export function hasImage(slug: string): boolean {
  return slug in images;
}

export const imageSlugs = Object.keys(images);
