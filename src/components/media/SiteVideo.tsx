'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import videoManifest from '@/generated/video-manifest.json';

interface VideoEntry {
  slug: string;
  src: string;
  poster: string;
  posterBlur: string;
  width: number;
  height: number;
  bytes: number;
}

const videos = videoManifest as Record<string, VideoEntry>;

export function hasVideo(slug: string) {
  return slug in videos;
}

export function videoEntry(slug: string): VideoEntry | undefined {
  return videos[slug];
}

/**
 * §9: never autoplay. `preload="none"` means not a single byte of the clip is
 * fetched until the visitor taps play — on metered mobile data that is the
 * difference between a page that costs 200KB and one that costs 4MB.
 *
 * Until then this is a poster image and a button. The `<video>` element is not
 * even mounted, so a browser cannot decide to be helpful and prefetch it.
 */
export function SiteVideo({
  slug,
  label,
  caption,
  playLabel,
  sizeLabel,
  className,
}: {
  slug: string;
  label: string;
  caption?: string;
  playLabel: string;
  sizeLabel: string;
  className?: string;
}) {
  const entry = videos[slug];
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!entry) return null;

  const megabytes = (entry.bytes / 1024 / 1024).toFixed(1);

  return (
    <figure className={cn('flex flex-col', className)}>
      <div
        className="relative overflow-hidden bg-slate"
        style={{ aspectRatio: `${entry.width} / ${entry.height}` }}
      >
        {playing ? (
          <video
            ref={videoRef}
            src={entry.src}
            poster={entry.poster}
            controls
            autoPlay
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-contain"
          >
            {label}
          </video>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full cursor-pointer border-0 bg-transparent p-0 text-left"
            aria-label={`${playLabel} — ${label}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- next/image
                does not optimise under `output: export`; this poster is already
                sized and compressed by scripts/build-video.ts. */}
            <img
              src={entry.poster}
              alt={label}
              width={entry.width}
              height={entry.height}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                backgroundImage: `url("${entry.posterBlur}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <span className="absolute inset-0 bg-slate/25 transition-colors duration-200 group-hover:bg-slate/10" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-russet transition-transform duration-200 ease-out group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 text-white" aria-hidden fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="absolute bottom-3 right-3 bg-slate/90 px-2 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-ash">
              {sizeLabel.replace('{size}', megabytes)}
            </span>
          </button>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm leading-relaxed text-mortar">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
