/**
 * shoot — screenshots the built site at real viewport sizes.
 *
 * Drives the locally installed Chrome through puppeteer-core (no bundled
 * browser download). Development aid only; nothing in the build depends on it.
 *
 *   npx serve out -l 4321
 *   npx tsx scripts/shoot.ts [outputDir]
 */
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import puppeteer, { type Browser } from 'puppeteer-core';

const BASE = process.env.SHOOT_BASE ?? 'http://localhost:4321';
const OUT = resolve(process.argv[2] ?? 'shots');

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

/** A mid-range Android and a laptop — the two that actually matter here. */
const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844, scale: 2, mobile: true },
  { name: 'laptop', width: 1440, height: 900, scale: 1, mobile: false },
];

const PAGES = [
  { slug: 'home-en', path: '/en/' },
  { slug: 'home-fr', path: '/fr/' },
  { slug: 'services', path: '/en/services/' },
  { slug: 'service-detail', path: '/en/services/structural-supervision/' },
  { slug: 'process', path: '/en/process/' },
  { slug: 'designs', path: '/en/designs/' },
  { slug: 'projects', path: '/en/our-work/' },
  { slug: 'project-detail', path: '/en/our-work/first-trust-bank-limbe/' },
  { slug: 'about', path: '/en/about/' },
  { slug: 'about-fr', path: '/fr/a-propos/' },
  { slug: 'contact', path: '/en/contact/' },
  { slug: 'city-limbe', path: '/en/building-in/limbe/' },
];

function findChrome(): string {
  const explicit = process.env.CHROME_PATH;
  if (explicit && existsSync(explicit)) return explicit;
  const found = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!found) throw new Error('No Chrome found. Set CHROME_PATH.');
  return found;
}

async function main() {
  mkdirSync(OUT, { recursive: true });

  let browser: Browser | undefined;
  const problems: string[] = [];

  try {
    browser = await puppeteer.launch({
      executablePath: findChrome(),
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
    });

    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: viewport.scale,
        isMobile: viewport.mobile,
        hasTouch: viewport.mobile,
      });

      page.on('pageerror', (error: unknown) =>
        problems.push(`JS error: ${error instanceof Error ? error.message : String(error)}`),
      );
      page.on('console', (message) => {
        if (message.type() === 'error') problems.push(`console: ${message.text()}`);
      });

      for (const target of PAGES) {
        const url = `${BASE}${target.path}`;
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30_000 });

        // Let scroll-reveal settle so screenshots are not full of half-faded
        // sections; IntersectionObserver fires on the next frame.
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await new Promise((done) => setTimeout(done, 350));
        await page.evaluate(() => window.scrollTo(0, 0));
        await new Promise((done) => setTimeout(done, 250));

        // A page that scrolls sideways on a phone is a bug, not a taste call.
        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth };
        });
        if (overflow.scrollWidth > overflow.clientWidth + 1) {
          problems.push(
            `HORIZONTAL OVERFLOW ${viewport.name} ${target.path}: ${overflow.scrollWidth} > ${overflow.clientWidth}`,
          );
        }

        await page.screenshot({
          path: resolve(OUT, `${target.slug}-${viewport.name}.png`) as `${string}.png`,
          fullPage: true,
        });
        console.log(`  ${viewport.name.padEnd(6)} ${target.path}`);
      }

      await page.close();
    }
  } finally {
    await browser?.close();
  }

  if (problems.length > 0) {
    console.error(`\n${problems.length} problem(s):`);
    for (const problem of [...new Set(problems)]) console.error(`  ${problem}`);
    process.exit(1);
  }
  console.log(`\nshoot: clean — no JS errors, no horizontal overflow. Images in ${OUT}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
