import { describe, expect, it } from 'vitest';
import { services } from '@/content/services';
import { projects } from '@/content/projects';
import { designs } from '@/content/designs';
import { cities } from '@/content/cities';
import { processStages } from '@/content/process';
import { siteWork } from '@/content/site-work';
import { company } from '@/content/company';
import { imageSlugs } from '@/lib/media';
import { publishedPathnames, routing } from '@/i18n/routing';
import en from '@/messages/en.json';
import fr from '@/messages/fr.json';

const locales = ['en', 'fr'] as const;

/** Anything that looks like an unfilled stand-in. */
const PLACEHOLDER = /\[[A-ZÀ-Ý][A-ZÀ-Ý0-9_ /:,'’—–-]*\]|lorem ipsum|TBC|TODO/i;

describe('services', () => {
  it('lists the five services offered', () => {
    expect(services).toHaveLength(5);
    expect(services.map((service) => service.slug)).toEqual([
      'commercial-construction',
      'residential-construction',
      'structural-supervision',
      'renovation-repair',
      'geotechnical-studies',
    ]);
  });

  it('states both inclusions and exclusions in both languages', () => {
    for (const service of services) {
      for (const locale of locales) {
        expect(service.includes[locale].length).toBeGreaterThan(0);
        expect(service.excludes[locale].length).toBeGreaterThan(0);
      }
    }
  });

  it('carries real FAQs in both languages', () => {
    for (const service of services) {
      expect(service.faqs.length).toBeGreaterThanOrEqual(2);
      for (const faq of service.faqs) {
        for (const locale of locales) {
          expect(faq.q[locale].length).toBeGreaterThan(10);
          expect(faq.a[locale].length).toBeGreaterThan(40);
        }
      }
    }
  });

  it('has unique slugs', () => {
    const slugs = services.map((service) => service.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('the render / photograph boundary', () => {
  it('marks every design image as a visualisation', () => {
    for (const design of designs) {
      expect(design.images.length).toBeGreaterThan(0);
      for (const media of design.images) {
        expect(media.kind).toBe('render');
      }
    }
  });

  it('never lets a visualisation appear as a completed building', () => {
    const renderSlugs = new Set(designs.flatMap((d) => d.images.map((m) => m.src)));
    for (const project of projects) {
      for (const media of project.images) {
        expect(media.kind).toBe('photo');
        expect(renderSlugs.has(media.src)).toBe(false);
      }
    }
  });

  it('keeps site footage separate from completed-building photography', () => {
    const projectSlugs = new Set(projects.flatMap((p) => p.images.map((m) => m.src)));
    for (const item of siteWork) {
      expect(projectSlugs.has(item.imageSlug)).toBe(false);
    }
  });
});

describe('media manifest', () => {
  it('resolves every image slug referenced by content', () => {
    const referenced = [
      ...designs.flatMap((design) => design.images.map((media) => media.src)),
      ...projects.flatMap((project) => project.images.map((media) => media.src)),
      ...siteWork.map((item) => item.imageSlug),
    ];
    for (const slug of referenced) {
      expect(imageSlugs, `missing image: ${slug}`).toContain(slug);
    }
  });

  it('gives every image alt text in both languages', () => {
    const media = [
      ...designs.flatMap((design) => design.images),
      ...projects.flatMap((project) => project.images),
    ];
    for (const item of media) {
      for (const locale of locales) {
        expect(item.alt[locale].length).toBeGreaterThan(20);
      }
    }
  });
});

describe('process', () => {
  it('runs from first contact to handover, numbered without gaps', () => {
    expect(processStages.length).toBeGreaterThanOrEqual(10);
    processStages.forEach((stage, index) => {
      expect(stage.number).toBe(index + 1);
    });
  });

  it('includes the soil investigation', () => {
    const names = processStages.map((stage) => stage.name.en.toLowerCase());
    expect(names.some((name) => name.includes('soil'))).toBe(true);
  });

  it('says what the client provides at every stage', () => {
    for (const stage of processStages) {
      for (const locale of locales) {
        expect(stage.clientSupplies[locale].length).toBeGreaterThan(0);
        expect(stage.what[locale].length).toBeGreaterThan(60);
      }
    }
  });
});

describe('cities', () => {
  it('covers the five cities across four regions', () => {
    expect(cities.map((city) => city.slug)).toEqual([
      'buea',
      'limbe',
      'douala',
      'yaounde',
      'bamenda',
    ]);
    expect(new Set(cities.map((city) => city.region.en)).size).toBe(4);
  });

  it('defaults Douala and Yaoundé to French', () => {
    expect(cities.find((city) => city.slug === 'douala')?.primaryLanguage).toBe('fr');
    expect(cities.find((city) => city.slug === 'yaounde')?.primaryLanguage).toBe('fr');
  });

  it('gives each city its own intro and conditions, not one template reused', () => {
    const intros = cities.map((city) => city.intro.en);
    for (const intro of intros) expect(intro.length).toBeGreaterThan(80);
    expect(new Set(intros).size).toBe(intros.length);

    for (const city of cities) {
      for (const locale of locales) {
        expect(city.conditions[locale].length).toBeGreaterThanOrEqual(3);
      }
    }
    const allConditions = cities.flatMap((city) => city.conditions.en);
    expect(new Set(allConditions).size).toBe(allConditions.length);
  });

  it('only claims projects that exist', () => {
    const known = new Set(projects.map((project) => project.slug));
    for (const city of cities) {
      for (const slug of city.projects) {
        expect(known.has(slug)).toBe(true);
      }
    }
  });
});

describe('projects', () => {
  it('describes each building and its scope in both languages', () => {
    for (const project of projects) {
      for (const locale of locales) {
        expect(project.summary[locale].length).toBeGreaterThan(60);
        expect(project.scope[locale].length).toBeGreaterThan(0);
        expect(project.region[locale].length).toBeGreaterThan(0);
      }
    }
  });
});

describe('site footage', () => {
  it('captions every clip in both languages and points at a real service', () => {
    const serviceSlugs = new Set(services.map((service) => service.slug));
    for (const item of siteWork) {
      for (const locale of locales) {
        expect(item.title[locale].length).toBeGreaterThan(10);
        expect(item.caption[locale].length).toBeGreaterThan(80);
      }
      if (item.service) expect(serviceSlugs.has(item.service)).toBe(true);
    }
  });
});

describe('no placeholder content anywhere', () => {
  const sources: Record<string, unknown> = {
    services,
    projects,
    designs,
    cities,
    processStages,
    siteWork,
    company,
    'messages/en': en,
    'messages/fr': fr,
  };

  for (const [name, value] of Object.entries(sources)) {
    it(`${name} carries no stand-in text`, () => {
      const found: string[] = [];
      const walk = (node: unknown) => {
        if (typeof node === 'string') {
          if (PLACEHOLDER.test(node)) found.push(node);
          return;
        }
        if (Array.isArray(node)) return node.forEach(walk);
        if (node && typeof node === 'object') return Object.values(node).forEach(walk);
      };
      walk(value);
      expect(found).toEqual([]);
    });
  }
});

describe('company', () => {
  it('publishes three reachable numbers, the first being the WhatsApp line', () => {
    expect(company.phones).toHaveLength(3);
    expect(company.phones[0]).toBe(company.whatsappPrimary);
  });

  it('publishes at least one email address', () => {
    expect(company.emails.length).toBeGreaterThan(0);
    for (const email of company.emails) {
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }
  });
});

describe('translations', () => {
  function keys(value: unknown, prefix = ''): string[] {
    if (value === null || typeof value !== 'object') return [prefix];
    return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
      keys(child, prefix ? `${prefix}.${key}` : key),
    );
  }

  it('has identical key sets in English and French', () => {
    const enKeys = keys(en).sort();
    const frKeys = keys(fr).sort();
    expect(enKeys.filter((key) => !frKeys.includes(key)), 'missing from fr.json').toEqual([]);
    expect(frKeys.filter((key) => !enKeys.includes(key)), 'missing from en.json').toEqual([]);
  });

  it('actually translates the prose rather than copying it', () => {
    const sample = [
      'meta.tagline',
      'meta.heroSubline',
      'home.servicesTitle',
      'process.title',
      'about.positioningBody',
    ];
    for (const path of sample) {
      const read = (source: unknown) =>
        path
          .split('.')
          .reduce<unknown>((node, key) => (node as Record<string, unknown>)[key], source);
      expect(read(en), path).not.toBe(read(fr));
    }
  });

  it('never mentions competitors or comparisons', () => {
    const forbidden = /competitor|audited|nobody else|no one else|unlike other|rival|concurrent/i;
    const offenders: string[] = [];
    const walk = (node: unknown, path: string) => {
      if (typeof node === 'string') {
        if (forbidden.test(node)) offenders.push(`${path}: ${node.slice(0, 60)}`);
        return;
      }
      if (node && typeof node === 'object') {
        for (const [key, child] of Object.entries(node)) walk(child, `${path}.${key}`);
      }
    };
    walk(en, 'en');
    walk(fr, 'fr');
    expect(offenders).toEqual([]);
  });
});

describe('routing', () => {
  it('translates the routes that matter, using trade vocabulary', () => {
    const pathnames = publishedPathnames as Record<string, { en: string; fr: string } | string>;
    const projectsRoute = pathnames['/projects'];
    if (typeof projectsRoute === 'object') {
      expect(projectsRoute.fr).toBe('/realisations');
    }
    const designsRoute = pathnames['/designs'];
    if (typeof designsRoute === 'object') {
      expect(designsRoute.fr).toBe('/vues-architecte');
    }
  });

  it('always prefixes the locale', () => {
    expect(routing.localePrefix).toBe('always');
  });

  it('has no route for a section that was removed', () => {
    const keys = Object.keys(publishedPathnames);
    for (const gone of ['/costs', '/quote', '/insights', '/team', '/site-work']) {
      expect(keys).not.toContain(gone);
    }
  });
});
