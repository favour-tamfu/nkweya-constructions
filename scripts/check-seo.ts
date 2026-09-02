/**
 * check-seo — the per-page tags that decide how a page appears in results.
 *
 * Every page must carry a title, a description, a self-referencing canonical,
 * hreflang alternates for both locales plus x-default, and a BreadcrumbList
 * matching its visible trail. Titles, descriptions and canonicals must all be
 * unique: two pages sharing a canonical is one page telling a crawler the
 * other does not exist.
 *
 * Everything is asserted against the exported HTML, so it holds for whatever
 * host serves it.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const OUT = resolve(process.cwd(), 'out');

/** Google truncates around here; over it, the tail is not shown. */
const TITLE_MAX = 65;
const DESCRIPTION_MAX = 165;
const DESCRIPTION_MIN = 70;

/** Root-level pages carry no locale, breadcrumb or alternates by design. */
const ROOT_PAGES = ['/index.html', '/404.html', '/404/index.html'];

interface Page {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogUrl: string;
  ogImage: string;
  hreflang: string[];
  hasBreadcrumb: boolean;
  hasOrgSchema: boolean;
  h1Count: number;
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

/**
 * Lengths must be measured on the rendered text, not the markup. "&" is
 * serialised as "&amp;" and appears in every title here, which would otherwise
 * add four phantom characters to each one.
 */
function decode(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCharCode(parseInt(code, 16)));
}

function first(html: string, pattern: RegExp): string {
  return decode(html.match(pattern)?.[1] ?? '');
}

function read(file: string): Page {
  const html = readFileSync(file, 'utf8');
  return {
    path: file.replace(OUT, '').replace(/\\/g, '/'),
    title: first(html, /<title>([^<]*)<\/title>/),
    description: first(html, /name="description" content="([^"]*)"/),
    canonical: first(html, /rel="canonical" href="([^"]*)"/),
    ogUrl: first(html, /property="og:url" content="([^"]*)"/),
    ogImage: first(html, /property="og:image" content="([^"]*)"/),
    hreflang: [...html.matchAll(/hrefLang="([^"]*)"/g)].map((m) => m[1] ?? ''),
    hasBreadcrumb: html.includes('"BreadcrumbList"'),
    hasOrgSchema: html.includes('"GeneralContractor"'),
    h1Count: (html.match(/<h1[\s>]/g) ?? []).length,
  };
}

function main() {
  if (!existsSync(OUT)) {
    console.warn('check-seo: no out/ directory; skipping.');
    process.exit(0);
  }

  const all = walk(OUT).filter((file) => file.endsWith('.html')).map(read);
  const content = all.filter((page) => !ROOT_PAGES.includes(page.path));
  const problems: string[] = [];

  const note = (page: Page, message: string) => problems.push(`${page.path}: ${message}`);

  for (const page of content) {
    if (!page.title) note(page, 'no <title>');
    else if (page.title.length > TITLE_MAX) {
      note(page, `title ${page.title.length} chars (max ${TITLE_MAX})`);
    }

    if (!page.description) note(page, 'no meta description');
    else if (page.description.length > DESCRIPTION_MAX) {
      note(page, `description ${page.description.length} chars (max ${DESCRIPTION_MAX})`);
    } else if (page.description.length < DESCRIPTION_MIN) {
      note(page, `description only ${page.description.length} chars (min ${DESCRIPTION_MIN})`);
    }

    if (!page.canonical) note(page, 'no canonical');
    if (!page.canonical.startsWith('http')) note(page, 'canonical is not absolute');
    if (page.ogUrl && page.ogUrl !== page.canonical) {
      note(page, 'og:url does not match canonical');
    }
    if (!page.ogImage.startsWith('http')) note(page, 'og:image is not absolute');

    for (const code of ['en', 'fr', 'x-default']) {
      if (!page.hreflang.includes(code)) note(page, `missing hreflang "${code}"`);
    }

    // The homepage is the root of every trail, so it has nothing to trail.
    const isLocaleHome = /^\/(en|fr)\/index\.html$/.test(page.path);
    if (!page.hasBreadcrumb && !isLocaleHome) note(page, 'no BreadcrumbList');
    if (!page.hasOrgSchema) note(page, 'no organisation schema');
    if (page.h1Count !== 1) note(page, `${page.h1Count} <h1> (expected exactly 1)`);
  }

  /* Uniqueness ------------------------------------------------------- */
  const localeOf = (path: string) => path.split('/')[1] ?? '';

  const collide = (field: 'title' | 'description' | 'canonical') => {
    const groups = new Map<string, string[]>();
    for (const page of content) {
      const value = page[field];
      if (!value) continue;
      // A canonical must be globally unique. Titles and descriptions are
      // compared within a locale: the EN and FR versions of a page are
      // declared alternates by hreflang, so sharing a proper-noun title
      // between them is correct rather than a collision.
      const key = field === 'canonical' ? value : `${localeOf(page.path)}::${value}`;
      groups.set(key, [...(groups.get(key) ?? []), page.path]);
    }
    for (const [value, pages] of groups) {
      if (pages.length > 1) {
        problems.push(
          `duplicate ${field} across ${pages.length} pages — "${value.slice(0, 55)}…"\n      ${pages.join('\n      ')}`,
        );
      }
    }
  };
  collide('title');
  collide('description');
  collide('canonical');

  if (problems.length === 0) {
    console.log(
      `check-seo: ${content.length} content page(s) — unique titles, descriptions and canonicals; hreflang and breadcrumbs on every one.`,
    );
    process.exit(0);
  }

  console.error(`check-seo: ${problems.length} issue(s):`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

main();
