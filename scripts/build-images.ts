/**
 * build-images — the whole image pipeline.
 *
 * `next/image` does not optimise under `output: 'export'` (§9 of the build
 * spec), so every derivative is produced here, at build time, and served as a
 * plain `<picture>`. Over 98% of Cameroonian web traffic is mobile on metered
 * data, so this is the single highest-leverage script in the repo.
 *
 *   assets/source/*.jpg
 *     -> public/media/<slug>-<width>.{avif,webp,jpg}   responsive derivatives
 *     -> public/og/og-<locale>.jpg                     social cards
 *     -> public/icon-<size>.png, apple-touch-icon.png  from the logo mark
 *     -> src/generated/image-manifest.json             dimensions + LQIP
 *
 * Any derivative over 200KB fails the build.
 */
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, parse, resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SOURCE = resolve(ROOT, 'assets', 'source');
const MEDIA_OUT = resolve(ROOT, 'public', 'media');
const OG_OUT = resolve(ROOT, 'public', 'og');
const MANIFEST = resolve(ROOT, 'src', 'generated', 'image-manifest.json');

const WIDTHS = [400, 640, 800, 1200, 1600];
/**
 * Quality first, with a ceiling.
 *
 * A single flat quality serves renders and photographs badly — a clean
 * architectural visualisation compresses to nothing, while rebar mesh or a
 * crowded site is all high-frequency detail and goes soft the moment quality
 * drops. So each derivative is encoded at a genuinely good quality and only
 * stepped down if it exceeds the ceiling, and the floors are set high enough
 * that nothing is ever crushed to meet the cap.
 *
 * The ceiling is per file, and the widths a phone actually requests (400/800)
 * land far below it. `check-budget.ts` separately holds the homepage hero to a
 * tighter limit, which is the one that decides LCP.
 */
const MAX_BYTES = 165 * 1024;
const MIN_QUALITY: Record<Format, number> = { avif: 34, webp: 52, jpeg: 56 };

type Format = 'avif' | 'webp' | 'jpeg';

const QUALITY: Record<Format, number> = { avif: 62, webp: 82, jpeg: 84 };

/**
 * Per-image overrides, for the few where the default is the wrong trade.
 *
 * The homepage hero is rendered at 45% opacity beneath a near-opaque gradient,
 * so detail in it is invisible by construction — and it is the LCP element, so
 * its weight is the one a visitor waits on. It gets a leaner profile and a
 * tighter cap than everything else. Every other image is shown at full
 * strength and keeps the default.
 */
const OVERRIDES: Record<string, { quality: Partial<Record<Format, number>>; maxBytes: number }> = {
  'residential-duplex-block-front-elevation': {
    quality: { avif: 42, webp: 60, jpeg: 62 },
    maxBytes: 110 * 1024,
  },
};

export interface ManifestEntry {
  width: number;
  height: number;
  blur: string;
  fallback: string;
  sources: { avif: string; webp: string; jpeg: string };
}

const manifest: Record<string, ManifestEntry> = {};
const oversize: string[] = [];

/** Widths we will actually emit: never upscale, always include the intrinsic. */
function ladder(intrinsic: number) {
  const rungs = WIDTHS.filter((w) => w < intrinsic);
  rungs.push(intrinsic);
  return [...new Set(rungs)].sort((a, b) => a - b);
}

function record(file: string, ceiling: number = MAX_BYTES) {
  const bytes = statSync(file).size;
  if (bytes > ceiling) {
    oversize.push(`${file.replace(ROOT, '')} — ${(bytes / 1024).toFixed(0)}KB`);
  }
  return bytes;
}

/**
 * Encode, and if the result is over budget step the quality down and try
 * again. Photographs of a building site carry far more high-frequency detail
 * than an architectural render, and a fixed quality serves one or the other
 * badly.
 */
async function encodeWithinBudget(
  input: string,
  width: number,
  format: Format,
  dest: string,
  slug: string,
): Promise<number> {
  const override = OVERRIDES[slug];
  let quality: number = override?.quality[format] ?? QUALITY[format];
  const ceiling = override?.maxBytes ?? MAX_BYTES;

  for (;;) {
    const pipeline = sharp(input)
      .resize({ width, withoutEnlargement: true, kernel: 'lanczos3' })
      // Downscaling softens texture; a light unsharp pass restores the edges
      // that make rebar, blockwork and roof tile read at small sizes.
      .sharpen({ sigma: 0.6, m1: 0.5, m2: 0.7 });
    if (format === 'avif') await pipeline.avif({ quality, effort: 6 }).toFile(dest);
    else if (format === 'webp') await pipeline.webp({ quality, effort: 5 }).toFile(dest);
    else await pipeline.jpeg({ quality, mozjpeg: true, progressive: true }).toFile(dest);

    const bytes = statSync(dest).size;
    if (bytes <= ceiling || quality <= MIN_QUALITY[format]) return record(dest, ceiling);
    quality = Math.max(MIN_QUALITY[format], quality - 6);
  }
}

async function buildImage(name: string) {
  const { name: slug } = parse(name);
  const input = join(SOURCE, name);
  const meta = await sharp(input).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (!width || !height) throw new Error(`${name}: no dimensions`);

  const rungs = ladder(width);
  const srcset = { avif: [] as string[], webp: [] as string[], jpeg: [] as string[] };

  for (const w of rungs) {
    await encodeWithinBudget(input, w, 'avif', join(MEDIA_OUT, `${slug}-${w}.avif`), slug);
    srcset.avif.push(`/media/${slug}-${w}.avif ${w}w`);

    await encodeWithinBudget(input, w, 'webp', join(MEDIA_OUT, `${slug}-${w}.webp`), slug);
    srcset.webp.push(`/media/${slug}-${w}.webp ${w}w`);

    await encodeWithinBudget(input, w, 'jpeg', join(MEDIA_OUT, `${slug}-${w}.jpg`), slug);
    srcset.jpeg.push(`/media/${slug}-${w}.jpg ${w}w`);
  }

  // Low-quality placeholder: 20px wide, inlined. Keeps CLS at zero while the
  // real image is still on the wire.
  const lqip = await sharp(input)
    .resize({ width: 20 })
    .webp({ quality: 28 })
    .toBuffer();

  manifest[slug] = {
    width,
    height,
    blur: `data:image/webp;base64,${lqip.toString('base64')}`,
    fallback: `/media/${slug}-${rungs[rungs.length - 1]}.jpg`,
    sources: {
      avif: srcset.avif.join(', '),
      webp: srcset.webp.join(', '),
      jpeg: srcset.jpeg.join(', '),
    },
  };

  console.log(`  ${slug}  ${width}x${height}  ->  ${rungs.join('/')}`);
}

/** Social card: the hero render, darkened, with the wordmark burned in. */
async function buildOgCard(locale: 'en' | 'fr', source: string) {
  const tagline = locale === 'fr' ? 'Un nom sur lequel bâtir.' : 'A name you can build on.';
  const subline =
    locale === 'fr'
      ? 'Buea · Limbe · Douala · Yaoundé · Bamenda'
      : 'Buea · Limbe · Douala · Yaoundé · Bamenda';

  const overlay = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
       <rect width="1200" height="630" fill="#2B353A" fill-opacity="0.74"/>
       <rect x="0" y="0" width="1200" height="6" fill="#7A3E0C"/>
       <g transform="translate(72, 150) scale(2.6)">
         <path d="M6 6h20" stroke="#F2EDE7" stroke-width="3" stroke-linecap="square" fill="none"/>
         <path d="M7.5 6v18M24.5 6v18" stroke="#F2EDE7" stroke-width="3" stroke-linecap="square" fill="none"/>
         <path d="M7.5 7.5 24.5 24" stroke="#C39A6C" stroke-width="3" stroke-linecap="square" fill="none"/>
         <path d="M3 27.5h26" stroke="#F2EDE7" stroke-width="4" stroke-linecap="square" fill="none"/>
       </g>
       <text x="72" y="360" font-family="Georgia, serif" font-size="64" font-weight="700"
             fill="#FFFFFF">Nkweya &amp; Sons</text>
       <text x="72" y="428" font-family="Georgia, serif" font-size="38" fill="#C39A6C">${tagline}</text>
       <text x="72" y="516" font-family="Helvetica, Arial, sans-serif" font-size="23"
             letter-spacing="3" fill="#A9B3B7">${subline}</text>
     </svg>`,
  );

  const out = join(OG_OUT, `og-${locale}.jpg`);
  await sharp(join(SOURCE, source))
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  record(out);
  console.log(`  og-${locale}.jpg  1200x630`);
}

/** App icons. Slate ground, limewash frame, russet brace — as on the site. */
async function buildIcons() {
  const icon = (size: number) =>
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}">
         <rect width="32" height="32" fill="#2B353A"/>
         <path d="M6 6h20" stroke="#F2EDE7" stroke-width="3" stroke-linecap="square" fill="none"/>
         <path d="M7.5 6v18M24.5 6v18" stroke="#F2EDE7" stroke-width="3" stroke-linecap="square" fill="none"/>
         <path d="M7.5 7.5 24.5 24" stroke="#C39A6C" stroke-width="3" stroke-linecap="square" fill="none"/>
         <path d="M3 27.5h26" stroke="#F2EDE7" stroke-width="4" stroke-linecap="square" fill="none"/>
       </svg>`,
    );

  for (const size of [192, 512]) {
    const out = resolve(ROOT, 'public', `icon-${size}.png`);
    await sharp(icon(size)).resize(size, size).png().toFile(out);
    record(out);
  }
  const apple = resolve(ROOT, 'public', 'apple-touch-icon.png');
  await sharp(icon(180)).resize(180, 180).png().toFile(apple);
  record(apple);

  // A crisp favicon.ico beats a downscaled PNG at 16px.
  const favicon = resolve(ROOT, 'public', 'favicon.ico');
  await sharp(icon(64)).resize(64, 64).png().toFile(favicon.replace('.ico', '-64.png'));
  record(favicon.replace('.ico', '-64.png'));

  console.log('  icons  192/512/apple-touch/64');
}

async function main() {
  rmSync(MEDIA_OUT, { recursive: true, force: true });
  mkdirSync(MEDIA_OUT, { recursive: true });
  mkdirSync(OG_OUT, { recursive: true });

  const files = readdirSync(SOURCE)
    .filter((name) => /\.(jpe?g|png)$/i.test(name))
    .sort();

  if (files.length === 0) {
    console.warn('build-images: assets/source is empty — run prepare-media first.');
  }

  console.log(`build-images: ${files.length} source image(s)`);
  for (const file of files) await buildImage(file);

  const ogSource = files.includes('residential-duplex-block-front-elevation.jpg')
    ? 'residential-duplex-block-front-elevation.jpg'
    : files[0];
  if (ogSource) {
    await buildOgCard('en', ogSource);
    await buildOgCard('fr', ogSource);
  }
  await buildIcons();

  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`build-images: manifest -> ${MANIFEST.replace(ROOT, '.')}`);

  if (oversize.length > 0) {
    console.error(`\n${oversize.length} output(s) over 200KB:`);
    for (const item of oversize) console.error(`  ${item}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
