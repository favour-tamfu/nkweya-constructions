import { bitter, franklin } from '@/lib/fonts';
import { LocaleRedirect } from '@/components/layout/LocaleRedirect';
import './globals.css';

/**
 * The root-level 404, reached only for a path outside both locale segments.
 * Renders its own document for the same reason as `page.tsx`: the root layout
 * is a pass-through, so without this the page ships with no `lang`.
 *
 * It offers the language choice rather than a dead end — somebody who lands
 * here mistyped a URL and still needs a way into the site.
 */
export default function RootNotFound() {
  return (
    <html lang="en" className={`${bitter.variable} ${franklin.variable}`}>
      <body className="font-body">
        <LocaleRedirect />
      </body>
    </html>
  );
}
