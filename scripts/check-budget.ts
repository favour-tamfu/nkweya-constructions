/**
 * check-budget — §13.1, enforced rather than aspired to.
 *
 * | Homepage total transfer, first visit | < 500 KB |
 * | JavaScript, gzipped                  | < 150 KB |
 * | Hero image                           | < 120 KB |
 *
 * Measured PER PAGE, as a browser would fetch it: the HTML, the scripts and
 * stylesheets that page actually references, and the largest image it would
 * load at once. Summing every .js file in `out/` instead — which an earlier
 * version of this script did — counts thirty pages' chunks against one page's
 * budget and is meaningless.
 *
 * Everything is measured gzipped, because that is what goes over the wire.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, resolve } from 'node:path';

const OUT = resolve(process.cwd(), 'out');

const JS_LIMIT = 150 * 1024;
const PAGE_LIMIT = 500 * 1024;
const IMAGE_LIMIT = 120 * 1024;

/** Pages held to the full budget. The homepage is the one that must hold. */
const TRACKED = ['en/index.html', 'fr/index.html'];

function gzipped(file: string): number {
  return gzipSync(readFileSync(file)).length;
}

/* Asset URLs carry the deployment prefix; the files in out/ do not. */
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

function assetPath(href: string): string | null {
  let clean = href.split('?')[0] ?? '';
  if (!clean.startsWith('/')) return null;
  if (BASE_PATH && clean.startsWith(`${BASE_PATH}/`)) clean = clean.slice(BASE_PATH.length);
  const file = join(OUT, clean);
  return existsSync(file) && statSync(file).isFile() ? file : null;
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

interface Report {
  page: string;
  htmlBytes: number;
  jsBytes: number;
  legacyJsBytes: number;
  cssBytes: number;
  totalBytes: number;
}

function measure(relative: string): Report | null {
  const page = join(OUT, relative);
  if (!existsSync(page)) return null;

  const html = readFileSync(page, 'utf8');
  const htmlBytes = gzipSync(Buffer.from(html)).length;

  const scripts = new Set<string>();
  const legacyOnly = new Set<string>();
  for (const match of html.matchAll(/<script([^>]*)\ssrc="([^"]+)"([^>]*)>/g)) {
    const src = match[2];
    if (!src) continue;
    // `nomodule` scripts are the ES5 polyfill bundle. Any browser that
    // understands modules skips them entirely, so they are reported but not
    // charged against the budget — and a browser old enough to need them is
    // not running this site's JS meaningfully anyway.
    const attrs = `${match[1] ?? ''} ${match[3] ?? ''}`;
    if (/nomodule/i.test(attrs)) legacyOnly.add(src);
    else scripts.add(src);
  }
  // Chunk names also appear in the RSC bootstrap payload rather than as tags.
  for (const match of html.matchAll(/"([^"]*\/_next\/static\/chunks\/[^"]+\.js)"/g)) {
    if (match[1] && !legacyOnly.has(match[1])) scripts.add(match[1]);
  }

  const styles = new Set<string>();
  for (const match of html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)) {
    if (match[1]) styles.add(match[1]);
  }
  for (const match of html.matchAll(/<link[^>]+href="([^"]+\.css)"/g)) {
    if (match[1]) styles.add(match[1]);
  }

  let jsBytes = 0;
  for (const src of scripts) {
    const file = assetPath(src);
    if (file) jsBytes += gzipped(file);
  }

  let legacyJsBytes = 0;
  for (const src of legacyOnly) {
    const file = assetPath(src);
    if (file) legacyJsBytes += gzipped(file);
  }

  let cssBytes = 0;
  for (const href of styles) {
    const file = assetPath(href);
    if (file) cssBytes += gzipped(file);
  }

  // Fonts are self-hosted and preloaded, so they are part of the first visit.
  let fontBytes = 0;
  for (const match of html.matchAll(/href="([^"]*\/_next\/static\/media\/[^"]+\.woff2)"/g)) {
    const file = match[1] ? assetPath(match[1]) : null;
    if (file) fontBytes += statSync(file).size; // woff2 is already compressed
  }

  // The hero: the largest image the page eagerly requests.
  let heroBytes = 0;
  for (const match of html.matchAll(/(?:src|srcSet|srcset)="([^"]+)"/g)) {
    for (const candidate of (match[1] ?? '').split(',')) {
      const url = candidate.trim().split(' ')[0];
      const file = url ? assetPath(url) : null;
      if (file && /\.(avif|webp|jpe?g|png)$/i.test(file)) {
        heroBytes = Math.max(heroBytes, statSync(file).size);
      }
    }
  }

  return {
    page: relative,
    htmlBytes,
    jsBytes,
    legacyJsBytes,
    cssBytes,
    totalBytes: htmlBytes + jsBytes + cssBytes + fontBytes + heroBytes,
  };
}

function kb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function main() {
  if (!existsSync(OUT)) {
    console.warn('check-budget: no out/ directory yet; skipping.');
    process.exit(0);
  }

  let failed = false;

  for (const relative of TRACKED) {
    const report = measure(relative);
    if (!report) {
      console.warn(`check-budget: ${relative} not found; skipping.`);
      continue;
    }

    console.log(
      `${report.page}  html ${kb(report.htmlBytes)}  js ${kb(report.jsBytes)}  css ${kb(report.cssBytes)}  total ${kb(report.totalBytes)}` +
        (report.legacyJsBytes > 0 ? `  (+${kb(report.legacyJsBytes)} nomodule, legacy browsers only)` : ''),
    );

    if (report.jsBytes > JS_LIMIT) {
      console.error(`  FAIL  JS ${kb(report.jsBytes)} exceeds ${kb(JS_LIMIT)}`);
      failed = true;
    }
    if (report.totalBytes > PAGE_LIMIT) {
      console.error(`  FAIL  first visit ${kb(report.totalBytes)} exceeds ${kb(PAGE_LIMIT)}`);
      failed = true;
    }
  }

  // No single image anywhere may blow the hero budget.
  const oversized = walk(OUT)
    .filter((file) => /\.(avif|webp|jpe?g|png)$/i.test(file))
    .filter((file) => statSync(file).size > IMAGE_LIMIT);

  if (oversized.length > 0) {
    console.error(`  FAIL  ${oversized.length} image(s) over ${kb(IMAGE_LIMIT)}:`);
    for (const file of oversized.slice(0, 10)) {
      console.error(`        ${file.replace(OUT, '')} — ${kb(statSync(file).size)}`);
    }
    failed = true;
  } else {
    console.log(`images: none over ${kb(IMAGE_LIMIT)}`);
  }

  process.exit(failed ? 1 : 0);
}

main();
