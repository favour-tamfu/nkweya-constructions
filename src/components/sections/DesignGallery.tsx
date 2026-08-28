'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ResponsiveImage } from '@/components/media/ResponsiveImage';
import { RenderNotice } from '@/components/media/RenderNotice';
import { IconClose } from '@/components/icons/NavIcons';
import { cn } from '@/lib/cn';

export interface GalleryImage {
  slug: string;
  alt: string;
  caption?: string;
}

/**
 * A gallery with a lightbox, built on the native `<dialog>` element.
 *
 * `showModal()` gives focus trapping, Escape-to-close, inert background and
 * the top layer for free — all things a hand-rolled modal gets wrong. Arrow
 * keys step through the set.
 *
 * With JS off the thumbnails still render as images; only the enlargement is
 * lost, which is the right thing to lose (§13.2).
 */
export function DesignGallery({
  images,
  renderLabel,
  viewLargerLabel,
  closeLabel,
  previousLabel,
  nextLabel,
  counterTemplate,
  priority = false,
}: {
  images: GalleryImage[];
  renderLabel: string;
  viewLargerLabel: string;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
  counterTemplate: string;
  priority?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const show = useCallback((next: number) => {
    setIndex(next);
    setOpen(true);
  }, []);

  const step = useCallback(
    (delta: number) => {
      setIndex((current) => (current + delta + images.length) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, step]);

  const first = images[0];
  const rest = images.slice(1);
  const active = images[index];

  if (!first) return null;

  const counter = counterTemplate
    .replace('{current}', String(index + 1))
    .replace('{total}', String(images.length));

  return (
    <>
      <figure className="m-0">
        <button
          type="button"
          onClick={() => show(0)}
          className="group relative block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
          aria-label={`${viewLargerLabel} — ${first.alt}`}
        >
          <ResponsiveImage
            slug={first.slug}
            alt={first.alt}
            sizes="(min-width: 768px) 62vw, 92vw"
            priority={priority}
            className="transition-opacity duration-200 group-hover:opacity-95"
          />
          <RenderNotice label={renderLabel} />
        </button>
        {first.caption ? (
          <figcaption className="mt-3 text-[15px] leading-[1.55] text-mortar">
            {first.caption}
          </figcaption>
        ) : null}
      </figure>

      {rest.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {rest.map((media, position) => (
            <li key={media.slug}>
              <button
                type="button"
                onClick={() => show(position + 1)}
                className="group relative block w-full cursor-zoom-in border-0 bg-transparent p-0"
                aria-label={`${viewLargerLabel} — ${media.alt}`}
              >
                <ResponsiveImage
                  slug={media.slug}
                  alt={media.alt}
                  sizes="(min-width: 768px) 20vw, 45vw"
                  aspect="4 / 3"
                  className="transition-opacity duration-200 group-hover:opacity-90"
                />
                <RenderNotice label={renderLabel} className="left-2 top-2 px-1.5 py-1 text-[9px] tracking-[0.14em]" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          // Clicking the backdrop (the dialog element itself) closes it.
          if (event.target === dialogRef.current) setOpen(false);
        }}
        className={cn(
          'w-full max-w-[min(96vw,1200px)] bg-transparent p-0 backdrop:bg-slate/90',
          'open:flex open:flex-col',
        )}
        aria-label={active?.alt}
      >
        {active ? (
          <div className="flex flex-col bg-slate">
            <div className="flex items-center justify-between gap-4 border-b border-rule-dark px-4 py-2">
              <p className="figure-numerals font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-ash">
                {counter}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center text-nav hover:text-white"
                aria-label={closeLabel}
              >
                <IconClose className="h-6 w-6" />
              </button>
            </div>

            <div className="relative">
              <ResponsiveImage
                slug={active.slug}
                alt={active.alt}
                sizes="min(96vw, 1200px)"
                className="max-h-[72vh] bg-slate"
                imgClassName="object-contain"
              />
              <RenderNotice label={renderLabel} />

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label={previousLabel}
                    className="absolute left-0 top-1/2 inline-flex h-14 w-12 -translate-y-1/2 items-center justify-center bg-slate/80 text-white hover:bg-russet"
                  >
                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 6-6 6 6 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label={nextLabel}
                    className="absolute right-0 top-1/2 inline-flex h-14 w-12 -translate-y-1/2 items-center justify-center bg-slate/80 text-white hover:bg-russet"
                  >
                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                  </button>
                </>
              ) : null}
            </div>

            {active.caption ? (
              <p className="border-t border-rule-dark px-4 py-3 text-[15px] leading-[1.55] text-ash">
                {active.caption}
              </p>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
