'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export const LOCALE_STORAGE_KEY = 'nkweya-locale';

/**
 * The root `/` splash.
 *
 * Cloudflare's `_redirects` sends `/` to `/en/` at the edge, so most visitors
 * never see this. It exists for the case where a static host serves `/`
 * directly, and for anyone arriving with JS disabled — which is why the two
 * language links are real, always rendered, and work on their own.
 *
 * A previously chosen locale wins over the default (§7): somebody who picked
 * French once should not land on English again.
 */
export function LocaleRedirect() {
  const [stalled, setStalled] = useState(false);

  useEffect(() => {
    let locale = 'en';
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored === 'fr' || stored === 'en') locale = stored;
    } catch {
      /* private mode — the default is fine */
    }
    window.location.replace(`/${locale}/`);

    // If the redirect has not taken effect, stop hiding the choice.
    const timer = window.setTimeout(() => setStalled(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <span
        className="inline-flex h-11 w-11 items-center justify-center bg-slate"
        style={{ borderRadius: 3 }}
        aria-hidden
      >
        <svg viewBox="0 0 36 36" className="h-8 w-8" fill="none">
          <path d="M6 28V12l12-6 12 6v16" stroke="#F2EDE7" strokeWidth="1.6" />
          <path d="M6 28h24" stroke="#C39A6C" strokeWidth="1.6" />
          <path d="M18 6v22" stroke="#F2EDE7" strokeWidth="1.2" />
        </svg>
      </span>

      <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-[-0.01em] text-slate md:text-[32px]">
        Nkweya &amp; Sons Constructions
      </h1>

      <p className="font-body text-[15px] text-mortar">
        Buea · Limbe · Douala · Yaoundé · Bamenda
      </p>

      <nav aria-label="Language" className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/en/"
          hrefLang="en"
          lang="en"
          className="inline-flex min-h-12 items-center justify-center border border-russet px-6 font-body text-[15px] font-semibold text-russet no-underline transition-colors hover:bg-russet hover:text-white"
        >
          English
        </Link>
        <Link
          href="/fr/"
          hrefLang="fr"
          lang="fr"
          className="inline-flex min-h-12 items-center justify-center border border-russet px-6 font-body text-[15px] font-semibold text-russet no-underline transition-colors hover:bg-russet hover:text-white"
        >
          Français
        </Link>
      </nav>

      {stalled ? (
        <p className="font-body text-[13px] text-dim">Choose a language to continue.</p>
      ) : null}
    </main>
  );
}
