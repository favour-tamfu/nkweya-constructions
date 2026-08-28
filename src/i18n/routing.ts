import { defineRouting } from 'next-intl/routing';

/**
 * Translated pathnames, as they are published:
 * `/en/our-work` ↔ `/fr/realisations`, `/en/designs` ↔ `/fr/vues-architecte`.
 *
 * `réalisations` rather than `projets` for completed work, and
 * `vue d'architecte` for a visualisation — the terms the trade uses.
 */
const published = {
  '/': '/',
  '/services': { en: '/services', fr: '/services' },
  '/services/[slug]': { en: '/services/[slug]', fr: '/services/[slug]' },
  '/projects': { en: '/our-work', fr: '/realisations' },
  '/projects/[slug]': { en: '/our-work/[slug]', fr: '/realisations/[slug]' },
  '/designs': { en: '/designs', fr: '/vues-architecte' },
  '/cities/[city]': { en: '/building-in/[city]', fr: '/construire-a/[city]' },
  '/process': { en: '/process', fr: '/processus' },
  '/about': { en: '/about', fr: '/a-propos' },
  '/contact': { en: '/contact', fr: '/contact' },
  '/legal/privacy': { en: '/legal/privacy', fr: '/mentions/confidentialite' },
  '/legal/terms': { en: '/legal/terms', fr: '/mentions/conditions' },
} as const;

/**
 * In development, every route maps to itself.
 *
 * Rewriting a translated URL back to its App Router directory is middleware's
 * job, and `output: 'export'` has no server to run middleware on. Production
 * does not need it — `scripts/localize-routes.ts` renames the emitted
 * directories after the build, so the published URLs are real files.
 *
 * `next dev` has no such step, so a translated pathname would 404 on every
 * link. Mapping each route to itself keeps the dev server fully browsable;
 * only the URL differs from production, and `npm run preview` shows the real
 * thing. `check-links` verifies the published URLs on every build.
 */
const identity = Object.fromEntries(
  Object.keys(published).map((route) => [route, route]),
) as { [K in keyof typeof published]: K };

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: false,
  pathnames: process.env.NODE_ENV === 'production' ? published : identity,
});

/** The published pathnames, regardless of environment — used by the build. */
export const publishedPathnames = published;

export type Pathnames = keyof typeof published;
export type Locale = (typeof routing.locales)[number];
