import type { Metadata } from 'next';
import { bitter, franklin } from '@/lib/fonts';
import { LocaleRedirect } from '@/components/layout/LocaleRedirect';
import './globals.css';

/**
 * The root document, outside the [locale] segment.
 *
 * `app/layout.tsx` is a pass-through so that `[locale]/layout.tsx` can own the
 * <html> element and set `lang` per locale. That leaves the root-level routes
 * — this splash and the 404 — to render their own document, which is what
 * gives them a lang attribute rather than Next's unlabelled fallback.
 */
export const metadata: Metadata = {
  title: 'Nkweya & Sons Constructions — civil engineering, Cameroon',
  description:
    'Civil engineering contractor across Buea, Limbe, Douala, Yaoundé and Bamenda. Choose English or French.',
  robots: { index: false, follow: true },
};

export default function RootPage() {
  return (
    <html lang="en" className={`${bitter.variable} ${franklin.variable}`}>
      <body className="font-body">
        <LocaleRedirect />
      </body>
    </html>
  );
}
