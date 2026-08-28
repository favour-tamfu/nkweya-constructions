/**
 * check-links — every internal link in the exported site must resolve.
 *
 * This exists because of a specific, silent failure mode: next-intl rewrites
 * `<Link href="/projects">` to `/fr/realisations/`, but `output: 'export'`
 * emits directories from the file system, so without `localize-routes.ts`
 * every French URL on the site 404s while the build reports success.
 *
 * Nothing in a type-check or a lint run catches that. This does.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const OUT = resolve(process.cwd(), 'out');

/*
 * Under GitHub Pages the site is served from `/<repo>/`, so every href in the
 * built HTML carries that prefix while the files on disk do not. Strip it
 * before resolving, or every link looks broken.
 */
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

function stripBasePath(pathname: string): string {
  if (!BASE_PATH) return pathname;
  if (pathname === BASE_PATH) return '/';
  return pathname.startsWith(`${BASE_PATH}/`) ? pathname.slice(BASE_PATH.length) : pathname;
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

/** Does this path exist as a file, or as a directory with an index.html? */
function resolves(pathname: string): boolean {
  const clean = stripBasePath(pathname.split('#')[0]?.split('?')[0] ?? '');
  if (clean === '' || clean === '/') return existsSync(join(OUT, 'index.html'));

  const target = join(OUT, clean);
  if (existsSync(target)) {
    return statSync(target).isDirectory() ? existsSync(join(target, 'index.html')) : true;
  }
  return existsSync(`${target}.html`);
}

function main() {
  if (!existsSync(OUT)) {
    console.warn('check-links: no out/ directory; skipping.');
    process.exit(0);
  }

  const pages = walk(OUT).filter((file) => file.endsWith('.html'));
  const broken: { page: string; href: string }[] = [];
  const seen = new Set<string>();
  let checked = 0;

  for (const page of pages) {
    const html = readFileSync(page, 'utf8');
    const rel = page.replace(OUT, '').replace(/\\/g, '/');

    for (const match of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      const href = match[1];
      if (!href) continue;
      // Assets are served as-is; only navigable routes are checked here.
      if (/\.(css|js|json|xml|txt|png|jpe?g|webp|avif|svg|ico|mp4|woff2?)$/i.test(href)) continue;

      checked += 1;
      const key = `${rel}::${href}`;
      if (seen.has(key)) continue;
      seen.add(key);

      if (!resolves(href)) broken.push({ page: rel, href });
    }
  }

  if (broken.length === 0) {
    console.log(`check-links: ${checked} internal link(s) across ${pages.length} page(s) — all resolve.`);
    process.exit(0);
  }

  console.error(`check-links: ${broken.length} broken internal link(s):`);
  const grouped = new Map<string, string[]>();
  for (const item of broken) {
    grouped.set(item.href, [...(grouped.get(item.href) ?? []), item.page]);
  }
  for (const [href, pagesWithIt] of grouped) {
    console.error(`  ${href}  (${pagesWithIt.length} page(s), e.g. ${pagesWithIt[0]})`);
  }
  process.exit(1);
}

main();
