import type { Metadata } from 'next';
import { getPathname } from '@/i18n/navigation';
import { routing, publishedPathnames } from '@/i18n/routing';
import { company } from '@/content/company';
import { cities } from '@/content/cities';
import { services } from '@/content/services';
import { image } from '@/lib/media';
import { asset } from '@/lib/base-path';
import type { Locale } from '@/types/content';

/**
 * The canonical origin, and the one thing to change when the domain changes.
 *
 * Everything that must survive a move — canonical URLs, hreflang alternates,
 * OpenGraph URLs, the sitemap, and the @id values that tie the structured data
 * together — is derived from this. Set `NEXT_PUBLIC_SITE_URL` at build time and
 * nothing else needs touching.
 *
 * The fallback is the current GitHub Pages address, so a build with no
 * environment set still emits absolute, correct URLs rather than relative ones
 * that would resolve against whatever host happened to serve them.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://favour-tamfu.github.io/nkweya-constructions'
).replace(/\/$/, '');

type Href = Parameters<typeof getPathname>[0]['href'];

/**
 * The pathname a route is PUBLISHED at, regardless of environment.
 *
 * `routing.pathnames` maps every route to itself in development so the dev
 * server stays browsable without middleware. Canonicals and the sitemap must
 * never reflect that — they always describe the deployed URL.
 */
export function localePath(href: Href, locale: Locale): string {
  const path = getPathname({ locale, href });
  if (process.env.NODE_ENV === 'production') return path;

  // In dev, translate the internal path to its published form by hand.
  const key = typeof href === 'string' ? href : href.pathname;
  const mapping = (publishedPathnames as Record<string, unknown>)[key];
  if (!mapping) return path;

  const published =
    typeof mapping === 'string' ? mapping : (mapping as Record<string, string>)[locale];
  if (!published) return path;

  // Substitute any dynamic segments from the params the caller passed. Only
  // some members of the href union carry `params`, hence the widened read.
  const params =
    typeof href === 'string'
      ? {}
      : (((href as { params?: Record<string, string> }).params ?? {}) as Record<string, string>);
  const filled = published.replace(/\[(\w+)\]/g, (_, name: string) => params[name] ?? `[${name}]`);
  return `/${locale}${filled === '/' ? '' : filled}`;
}

/**
 * `next.config.ts` sets `trailingSlash: true`, so `/en/services` is served as
 * `/en/services/`. Canonicals, hreflang alternates and sitemap entries must
 * match the URL that actually resolves, or each one points at a redirect — and
 * a canonical that redirects is a canonical a crawler may disregard.
 *
 * Asset paths (a file extension in the last segment) are left alone.
 */
export function absoluteUrl(path: string): string {
  const rooted = path.startsWith('/') ? path : `/${path}`;
  const lastSegment = rooted.split('/').pop() ?? '';
  const isFile = lastSegment.includes('.');
  const normalised = isFile || rooted.endsWith('/') ? rooted : `${rooted}/`;
  return `${SITE_URL}${normalised}`;
}

/** The absolute URL of a route, in a given locale. */
export function canonicalUrl(href: Href, locale: Locale): string {
  return absoluteUrl(localePath(href, locale));
}

/* ------------------------------------------------------------------ */
/* Page metadata                                                       */
/* ------------------------------------------------------------------ */

/**
 * Title, description, canonical, hreflang alternates with x-default, and the
 * social card — resolved in one place so no page can forget one.
 *
 * Titles are unique per page and per locale, and are assembled here rather
 * than written out at each call site, so the suffix stays consistent and the
 * length stays inside what a result page will show.
 *
 * No `meta keywords` tag: search engines have ignored it since 2009.
 */
export function buildMetadata({
  locale,
  href,
  title,
  description,
  /** Manifest slug of a page-specific social image. */
  imageSlug,
  noIndex = false,
}: {
  locale: Locale;
  href: Href;
  title: string;
  description: string;
  imageSlug?: string;
  noIndex?: boolean;
}): Metadata {
  const canonical = canonicalUrl(href, locale);

  const languages: Record<string, string> = {};
  for (const code of routing.locales) {
    languages[code] = canonicalUrl(href, code);
  }
  languages['x-default'] = canonicalUrl(href, routing.defaultLocale);

  const social = imageSlug ? image(imageSlug) : undefined;
  const card = social
    ? { url: absoluteUrl(asset(social.fallback)), width: social.width, height: social.height }
    : { url: absoluteUrl(asset(`/og/og-${locale}.jpg`)), width: 1200, height: 630 };

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      siteName: company.tradingName,
      locale: locale === 'fr' ? 'fr_CM' : 'en_CM',
      alternateLocale: locale === 'fr' ? 'en_CM' : 'fr_CM',
      url: canonical,
      title,
      description,
      images: [{ ...card, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [card.url],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

/* ------------------------------------------------------------------ */
/* Structured data                                                     */
/* ------------------------------------------------------------------ */

type Json = Record<string, unknown>;

/** Stable node identities, so the graph references rather than repeats. */
export const ORG_ID = `${SITE_URL}/#organisation`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * `GeneralContractor` with `areaServed` covering all five cities.
 *
 * A verified postal address strengthens local search considerably; it is
 * omitted rather than approximated, since structured data that cannot be
 * verified does more harm than none.
 */
export function organisationSchema(locale: Locale): Json {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'GeneralContractor',
        '@id': ORG_ID,
        name: company.tradingName,
        url: canonicalUrl('/', locale),
        image: absoluteUrl(asset(`/og/og-${locale}.jpg`)),
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl(asset('/icon-512.png')),
          width: 512,
          height: 512,
        },
        telephone: company.phones,
        email: company.emails[0],
        knowsLanguage: ['en', 'fr'],
        areaServed: cities.map((city) => ({
          '@type': 'City',
          name: city.name,
          containedInPlace: {
            '@type': 'AdministrativeArea',
            name: city.region[locale],
            containedInPlace: { '@type': 'Country', name: 'Cameroon' },
          },
        })),
        founder: {
          '@type': 'Person',
          name: company.principal.name,
          jobTitle: company.principal.role[locale],
          hasCredential: company.principal.qualifications[locale],
        },
        makesOffer: services.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name[locale],
            description: service.summary[locale],
          },
        })),
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: canonicalUrl('/', locale),
        name: company.tradingName,
        inLanguage: locale,
        publisher: { '@id': ORG_ID },
      },
    ],
  };
}

/**
 * A BreadcrumbList matching the visible trail on the page.
 *
 * Both are generated from the same array at each call site, so the markup a
 * crawler reads and the trail a visitor clicks can never disagree.
 */
export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): Json | null {
  if (faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

export function serviceSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType: name,
    url: absoluteUrl(path),
    provider: { '@id': ORG_ID },
    areaServed: cities.map((city) => ({ '@type': 'City', name: city.name })),
    availableLanguage: ['en', 'fr'],
  };
}

/** A completed building, with its photograph when there is one. */
export function projectSchema({
  name,
  description,
  path,
  cityName,
  region,
  imageSlug,
}: {
  name: string;
  description: string;
  path: string;
  cityName: string;
  region: string;
  imageSlug?: string;
}): Json {
  const photo = imageSlug ? image(imageSlug) : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name,
    description,
    url: absoluteUrl(path),
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressRegion: region,
      addressCountry: 'CM',
    },
    ...(photo
      ? {
          photo: {
            '@type': 'ImageObject',
            url: absoluteUrl(asset(photo.fallback)),
            width: photo.width,
            height: photo.height,
          },
        }
      : {}),
  };
}
