/**
 * prepare-media — one-off ingest of the client's raw WhatsApp exports.
 *
 * Reads `../media` (outside the repo), and writes clean, SEO-named originals
 * into `assets/source/`. Two jobs:
 *
 *  1. Rename.  "WhatsApp Image 2026-08-22 at 10.39.21 PM (1).jpeg" tells a
 *     search engine nothing. Every file lands with a descriptive slug.
 *  2. De-screenshot.  Four of the eight renders are Android screenshots
 *     (§9 of the build spec): black letterbox top and bottom, a status bar,
 *     a nav bar, and a floating app icon over the right of the frame. The
 *     letterbox is detected by row luma; the icon is trimmed off the right.
 *
 * `assets/source/` is the committed source of truth. `build-images.ts` reads
 * from there and never touches the raw folder again.
 */
import { mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const RAW = resolve(process.cwd(), '..', 'media');
const OUT = resolve(process.cwd(), 'assets', 'source');

/**
 * Raw filename -> SEO slug. No surgery needed on these.
 *
 * The slug becomes the filename of every derivative, so it is what a search
 * engine reads: the building, the city, and what the picture shows.
 */
const LANDSCAPE: Record<string, string> = {
  // The one photograph of a completed building. Taken at the branch opening.
  'WhatsApp Image 2026-08-31 at 11.51.11 AM.jpeg':
    'ccc-building-limbe-completed-facade',
  'WhatsApp Image 2026-08-22 at 10.39.09 PM.jpeg':
    'residential-duplex-block-front-elevation',
  'WhatsApp Image 2026-08-22 at 10.39.09 PM (1).jpeg':
    'residential-duplex-block-street-view',
  'WhatsApp Image 2026-08-22 at 10.39.21 PM (1).jpeg':
    'residential-duplex-block-driveway-view',
  'WhatsApp Image 2026-08-22 at 10.39.21 PM.jpeg':
    'two-storey-residential-block-aerial-view',
};

/** Screenshots: letterbox detected, then `rightTrim` of the width dropped. */
const SCREENSHOT: Record<string, { slug: string; rightTrim: number }> = {
  'WhatsApp Image 2026-08-22 at 10.38.31 PM.jpeg': {
    slug: 'five-storey-apartment-building-front-elevation',
    rightTrim: 0.17,
  },
  'WhatsApp Image 2026-08-22 at 10.38.31 PM (1).jpeg': {
    slug: 'six-storey-apartment-block-front-elevation',
    rightTrim: 0.17,
  },
  'WhatsApp Image 2026-08-22 at 10.38.31 PM (2).jpeg': {
    slug: 'six-storey-apartment-block-three-quarter-view',
    rightTrim: 0.17,
  },
  'WhatsApp Image 2026-08-22 at 10.38.32 PM.jpeg': {
    slug: 'six-storey-apartment-block-corner-view',
    rightTrim: 0.18,
  },
};

/**
 * Longest run of rows whose mean luma clears `threshold`.
 * The bars are #171717-ish, not true black, so the threshold sits well above 23.
 */
async function contentBand(file: string, threshold = 45) {
  const image = sharp(file);
  const { width = 0, height = 0 } = await image.metadata();
  const { data } = await sharp(file)
    .greyscale()
    .resize({ width: 32, height, fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  let best = { start: 0, end: 0 };
  let run: number | null = null;
  for (let y = 0; y <= height; y += 1) {
    let mean = 0;
    if (y < height) {
      let sum = 0;
      for (let x = 0; x < 32; x += 1) sum += data[y * 32 + x] ?? 0;
      mean = sum / 32;
    }
    const lit = y < height && mean > threshold;
    if (lit && run === null) run = y;
    if (!lit && run !== null) {
      if (y - run > best.end - best.start) best = { start: run, end: y };
      run = null;
    }
  }
  if (best.end - best.start < height * 0.05) best = { start: 0, end: height };
  return { width, height, ...best };
}

async function main() {
  if (!existsSync(RAW)) {
    console.error(`prepare-media: raw folder not found at ${RAW}`);
    process.exit(1);
  }
  mkdirSync(OUT, { recursive: true });

  const seen = new Set(readdirSync(RAW));

  for (const [raw, slug] of Object.entries(LANDSCAPE)) {
    if (!seen.has(raw)) {
      console.warn(`  skip (missing): ${raw}`);
      continue;
    }
    const dest = join(OUT, `${slug}.jpg`);
    await sharp(join(RAW, raw)).jpeg({ quality: 94 }).toFile(dest);
    const meta = await sharp(dest).metadata();
    console.log(`  ${slug}.jpg  ${meta.width}x${meta.height}`);
  }

  for (const [raw, { slug, rightTrim }] of Object.entries(SCREENSHOT)) {
    if (!seen.has(raw)) {
      console.warn(`  skip (missing): ${raw}`);
      continue;
    }
    const src = join(RAW, raw);
    const band = await contentBand(src);
    const top = band.start;
    const bandHeight = band.end - band.start;
    const keepWidth = Math.round(band.width * (1 - rightTrim));
    const dest = join(OUT, `${slug}.jpg`);
    await sharp(src)
      .extract({ left: 0, top, width: keepWidth, height: bandHeight })
      .jpeg({ quality: 94 })
      .toFile(dest);
    console.log(
      `  ${slug}.jpg  ${keepWidth}x${bandHeight}  (letterbox ${top}..${band.end} of ${band.height}, right ${Math.round(rightTrim * 100)}% trimmed)`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
