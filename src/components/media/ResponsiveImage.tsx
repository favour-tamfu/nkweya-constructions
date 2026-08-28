import { cn } from '@/lib/cn';
import { image } from '@/lib/media';

interface ResponsiveImageProps {
  /** Key into the generated image manifest. */
  slug: string;
  alt: string;
  /** The `sizes` attribute. Get this right or the browser over-downloads. */
  sizes?: string;
  className?: string;
  imgClassName?: string;
  /** The hero, and only the hero, loads eagerly. */
  priority?: boolean;
  /** Overrides the intrinsic ratio, e.g. '16/9' for a fixed band. */
  aspect?: string;
  objectPosition?: string;
  /**
   * `cover` crops to fill the frame; `contain` shows the whole image inside
   * it. Use `contain` for anything whose composition must not be cut.
   */
  fit?: 'cover' | 'contain';
}

/**
 * A real `<picture>` with AVIF, WebP and JPEG srcsets from the build-time
 * pipeline. `next/image` does not optimise under `output: 'export'`.
 *
 * Intrinsic width and height are always set so layout never shifts, and the
 * low-quality placeholder sits behind the image so there is something to look
 * at on a slow connection rather than an empty rectangle.
 */
export function ResponsiveImage({
  slug,
  alt,
  sizes = '100vw',
  className,
  imgClassName,
  priority = false,
  aspect,
  objectPosition,
  fit = 'cover',
}: ResponsiveImageProps) {
  const entry = image(slug);

  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`ResponsiveImage: no manifest entry for "${slug}"`);
    }
    return null;
  }

  return (
    <div
      className={cn('relative overflow-hidden bg-stucco', className)}
      style={{
        aspectRatio: aspect ?? `${entry.width} / ${entry.height}`,
        backgroundImage: `url("${entry.blur}")`,
        backgroundSize: fit === 'contain' ? 'contain' : 'cover',
        backgroundPosition: objectPosition ?? 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <picture>
        <source type="image/avif" srcSet={entry.sources.avif} sizes={sizes} />
        <source type="image/webp" srcSet={entry.sources.webp} sizes={sizes} />
        <img
          src={entry.fallback}
          srcSet={entry.sources.jpeg}
          sizes={sizes}
          alt={alt}
          width={entry.width}
          height={entry.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          className={cn(
            'absolute inset-0 h-full w-full',
            fit === 'contain' ? 'object-contain' : 'object-cover',
            imgClassName,
          )}
          style={objectPosition ? { objectPosition } : undefined}
        />
      </picture>
    </div>
  );
}

/**
 * A framed image that never displays larger than its own resolution.
 *
 * Several of the source visualisations are small — 403×246 at the extreme —
 * and stretching those across a wide column makes them soft. This caps the
 * rendered width at the intrinsic width and centres what is left, so a small
 * image reads as deliberately sized rather than blown up.
 */
export function ConstrainedImage({
  slug,
  alt,
  sizes,
  className,
  frameClassName,
  priority = false,
  /** Never render wider than this, even if the file allows it. */
  maxWidth,
}: {
  slug: string;
  alt: string;
  sizes?: string;
  className?: string;
  frameClassName?: string;
  priority?: boolean;
  maxWidth?: number;
}) {
  const entry = image(slug);
  if (!entry) return null;

  const cap = Math.min(entry.width, maxWidth ?? entry.width);

  return (
    <div className={cn('flex w-full justify-center bg-stucco', frameClassName)}>
      <div style={{ maxWidth: `${cap}px`, width: '100%' }}>
        <ResponsiveImage
          slug={slug}
          alt={alt}
          sizes={sizes ?? `(max-width: ${cap}px) 100vw, ${cap}px`}
          priority={priority}
          className={className}
        />
      </div>
    </div>
  );
}
