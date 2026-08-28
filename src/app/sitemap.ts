import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { services } from '@/content/services';
import { projects } from '@/content/projects';
import { cities } from '@/content/cities';
import { SITE_URL, absoluteUrl, localePath } from '@/lib/seo';

/**
 * Both locales for every route (§12), with hreflang alternates so Google is
 * told explicitly that /en/projects and /fr/realisations are the same page.
 */
type Href = Parameters<typeof localePath>[0];

const staticRoutes: Href[] = [
  '/',
  '/services',
  '/projects',
  '/designs',
  '/process',
  '/about',
  '/contact',
  '/legal/privacy',
  '/legal/terms',
];

const priorities: Partial<Record<string, number>> = {
  '/': 1,
  '/services': 0.9,
  '/projects': 0.9,
  '/about': 0.8,
  '/process': 0.8,
  '/contact': 0.8,
};

function entry(href: Href, key: string): MetadataRoute.Sitemap[number][] {
  return routing.locales.map((locale) => ({
    url: absoluteUrl(localePath(href, locale)),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: priorities[key] ?? 0.6,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((code) => [code, absoluteUrl(localePath(href, code))]),
      ),
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.flatMap((href) => entry(href, String(href))),
    ...services.flatMap((service) =>
      entry({ pathname: '/services/[slug]', params: { slug: service.slug } }, '/services/[slug]'),
    ),
    ...projects.flatMap((project) =>
      entry({ pathname: '/projects/[slug]', params: { slug: project.slug } }, '/projects/[slug]'),
    ),
    ...cities.flatMap((city) =>
      entry({ pathname: '/cities/[city]', params: { city: city.slug } }, '/cities/[city]'),
    ),
  ];
}

export const dynamic = 'force-static';
export { SITE_URL };
