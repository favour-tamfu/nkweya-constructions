import type { Metadata } from 'next';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { company } from '@/content/company';
import { cities } from '@/content/cities';
import { services } from '@/content/services';
import type { Locale } from '@/types/content';

/**
 * Canonical origin. Cloudflare Pages serves preview branches on their own
 * hostnames; canonical and hreflang must always point at the real one.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nkweyaandsons.com').replace(
  /\/$/,
  '',
);

type Href = Parameters<typeof getPathname>[0]['href'];

export function localePath(href: Href, locale: Locale): string {
  return getPathname({ locale, href });
}

/**
 * `next.config.ts` sets `trailingSlash: true`, so `/en/services` is served as
 * `/en/services/`. Canonicals, hreflang alternates and sitemap entries must match
 * the URL that actually resolves, or every one of them is a redirect — and a
 * canonical pointing at a redirect is a canonical Google may ignore.
 *
 * Asset paths (anything with a file extension in the last segment) are left
 * alone.
 */
export function absoluteUrl(path: string): string {
  const rooted = path.startsWith('/') ? path : `/${path}`;
  const lastSegment = rooted.split('/').pop() ?? '';
  const isFile = lastSegment.includes('.');
  const normalised = isFile || rooted.endsWith('/') ? rooted : `${rooted}/`;
  return `${SITE_URL}${normalised}`;
}

/**
 * Title, description, canonical, hreflang alternates (with x-default) and the
 * social card, in one place (§12).
 *
 * No `meta keywords` tag — search engines have ignored it since 2009 and a
 * long one reads as spam.
 */
export function buildMetadata({
  locale,
  href,
  title,
  description,
  image,
}: {
  locale: Locale;
  href: Href;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const canonical = absoluteUrl(localePath(href, locale));
  const languages: Record<string, string> = {};
  for (const code of routing.locales) {
    languages[code] = absoluteUrl(localePath(href, code));
  }
  languages['x-default'] = absoluteUrl(localePath(href, routing.defaultLocale));

  const card = image ?? `/og/og-${locale}.jpg`;

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
      images: [{ url: absoluteUrl(card), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl(card)],
    },
  };
}

/* ------------------------------------------------------------------ */
/* JSON-LD                                                             */
/* ------------------------------------------------------------------ */

type Json = Record<string, unknown>;

/**
 * `GeneralContractor` with `areaServed` covering all five cities.
 *
 * A verified postal address strengthens local search considerably; it is
 * omitted here rather than approximated, since structured data that cannot be
 * verified does more harm than good.
 */
export function organisationSchema(locale: Locale): Json {
  const qualifications = company.principal.qualifications[locale];

  const schema: Json = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${SITE_URL}/#organisation`,
    name: company.tradingName,
    url: absoluteUrl(localePath('/', locale)),
    image: absoluteUrl(`/og/og-${locale}.jpg`),
    logo: absoluteUrl('/icon-512.png'),
    telephone: company.phones,
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
      ...(qualifications.length > 0 ? { hasCredential: qualifications } : {}),
    },
    makesOffer: services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.name[locale],
        description: service.summary[locale],
      },
    })),
  };

  if (company.emails.length > 0) schema.email = company.emails[0];

  return schema;
}

export function breadcrumbSchema(
  trail: { name: string; path: string }[],
): Json {
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
  locale,
  path,
}: {
  name: string;
  description: string;
  locale: Locale;
  path: string;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType: name,
    url: absoluteUrl(path),
    provider: { '@id': `${SITE_URL}/#organisation` },
    areaServed: cities.map((city) => ({ '@type': 'City', name: city.name })),
    availableLanguage: ['en', 'fr'],
    ...(locale ? {} : {}),
  };
}
