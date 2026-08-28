/**
 * build-video — poster frames, still frames and web-weight re-encodes.
 *
 * IMPORTANT, and contrary to §0.2 of the build spec: these four clips are NOT
 * renders. They are real footage of real work — a slab pour with the crew on
 * it, a multi-storey structure under construction, slab reinforcement laid out
 * before a pour, and a concrete cube being crushed on a compression machine.
 * The spec's "the media are renders, not photographs" holds for the eight
 * stills; whoever wrote it had evidently not opened the videos.
 *
 * That matters, because it means the site has genuine photographic evidence of
 * work in progress. It is NOT evidence of a completed building — First Trust
 * Bank and the CCC Building still need photographing — and nothing here is
 * captioned as though it were. Which city each clip was shot in is unknown, so
 * no clip claims one.
 *
 * §9: never autoplay, `preload="none"`, poster extracted at build time. On
 * metered Cameroonian data an autoplaying 9MB hero video is indefensible.
 *
 * Skips cleanly and exits 0 when ffmpeg is unavailable — CI must not depend on
 * a 28MB binary it does not need.
 */
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const RAW = resolve(process.cwd(), '..', 'media');
const VIDEO_OUT = resolve(process.cwd(), 'public', 'video');
const STILLS_OUT = resolve(process.cwd(), 'assets', 'source');
const MANIFEST = resolve(process.cwd(), 'src', 'generated', 'video-manifest.json');

interface Clip {
  slug: string;
  /** Seconds into the clip for the poster frame. */
  posterAt: number;
  /** Extra frames pulled as real still photography, keyed by SEO slug. */
  stills: { slug: string; at: number }[];
}

const CLIPS: Record<string, Clip> = {
  'WhatsApp Video 2026-08-22 at 10.38.30 PM.mp4': {
    slug: 'concrete-slab-pour-in-progress',
    posterAt: 2,
    stills: [{ slug: 'site-concrete-slab-pour-crew', at: 2 }],
  },
  'WhatsApp Video 2026-08-22 at 10.38.30 PM (1).mp4': {
    slug: 'multi-storey-structure-under-construction',
    posterAt: 2,
    stills: [{ slug: 'site-multi-storey-structure-scaffolding', at: 2 }],
  },
  'WhatsApp Video 2026-08-22 at 10.38.31 PM.mp4': {
    slug: 'slab-reinforcement-before-pour',
    posterAt: 1,
    stills: [{ slug: 'site-slab-reinforcement-mesh-before-pour', at: 1 }],
  },
  'WhatsApp Video 2026-08-22 at 10.38.31 PM (1).mp4': {
    slug: 'concrete-cube-compression-test',
    posterAt: 3,
    stills: [{ slug: 'site-concrete-cube-compression-test', at: 3 }],
  },
};

export interface VideoEntry {
  slug: string;
  src: string;
  poster: string;
  posterBlur: string;
  width: number;
  height: number;
  bytes: number;
}

function ffmpegPath(): string | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const found = require('ffmpeg-static') as string | null;
    return found && existsSync(found) ? found : null;
  } catch {
    return null;
  }
}

function run(bin: string, args: string[]) {
  const result = spawnSync(bin, args, { encoding: 'utf8', timeout: 240_000 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr?.slice(-800) ?? 'ffmpeg failed');
}

/** One frame at `at` seconds, written as a high-quality JPEG. */
function grabFrame(ffmpeg: string, input: string, at: number, dest: string, width = 900) {
  run(ffmpeg, [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-ss', String(at), '-i', input,
    '-frames:v', '1',
    '-vf', `scale=${width}:-2`,
    '-q:v', '2', dest,
  ]);
}

async function main() {
  const ffmpeg = ffmpegPath();
  if (!ffmpeg) {
    console.warn('build-video: ffmpeg not available — skipping (this is not an error).');
    if (!existsSync(MANIFEST)) writeFileSync(MANIFEST, '{}\n', 'utf8');
    return;
  }
  if (!existsSync(RAW)) {
    console.warn(`build-video: no raw folder at ${RAW} — skipping.`);
    if (!existsSync(MANIFEST)) writeFileSync(MANIFEST, '{}\n', 'utf8');
    return;
  }

  mkdirSync(VIDEO_OUT, { recursive: true });
  mkdirSync(STILLS_OUT, { recursive: true });

  const present = new Set(readdirSync(RAW));
  const manifest: Record<string, VideoEntry> = {};

  for (const [raw, clip] of Object.entries(CLIPS)) {
    if (!present.has(raw)) {
      console.warn(`  skip (missing): ${raw}`);
      continue;
    }
    const input = join(RAW, raw);

    // Stills go into assets/source so build-images treats them exactly like
    // any other photograph — same responsive ladder, same manifest.
    for (const still of clip.stills) {
      grabFrame(ffmpeg, input, still.at, join(STILLS_OUT, `${still.slug}.jpg`), 900);
      console.log(`  still  ${still.slug}.jpg`);
    }

    // Poster. Narrower and leaner than the stills — it is only ever shown at
    // card size behind a play button.
    const posterRaw = join(VIDEO_OUT, `${clip.slug}-poster-raw.jpg`);
    grabFrame(ffmpeg, input, clip.posterAt, posterRaw, 480);
    const posterOut = join(VIDEO_OUT, `${clip.slug}-poster.jpg`);
    await sharp(posterRaw)
      .jpeg({ quality: 58, mozjpeg: true, progressive: true })
      .toFile(posterOut);
    const posterMeta = await sharp(posterOut).metadata();
    const blur = await sharp(posterRaw).resize({ width: 20 }).webp({ quality: 28 }).toBuffer();
    try {
      const { rmSync } = await import('node:fs');
      rmSync(posterRaw, { force: true });
    } catch {
      /* leaving the intermediate behind is harmless */
    }

    // WhatsApp has already compressed these hard, so a re-encode usually makes
    // them BIGGER. Remux first — same streams, zero quality loss, but with the
    // moov atom moved to the front so playback can start before the whole file
    // has arrived. Then try a real re-encode, and keep whichever is smaller.
    const videoOut = join(VIDEO_OUT, `${clip.slug}.mp4`);
    run(ffmpeg, [
      '-y', '-hide_banner', '-loglevel', 'error',
      '-i', input,
      '-c', 'copy', '-movflags', '+faststart',
      videoOut,
    ]);
    const remuxed = statSync(videoOut).size;

    const candidate = join(VIDEO_OUT, `${clip.slug}-reencode.mp4`);
    run(ffmpeg, [
      '-y', '-hide_banner', '-loglevel', 'error',
      '-i', input,
      '-vf', 'scale=w=720:h=1280:force_original_aspect_ratio=decrease:force_divisible_by=2',
      '-c:v', 'libx264', '-crf', '31', '-preset', 'slow', '-profile:v', 'main',
      '-maxrate', '900k', '-bufsize', '1800k',
      '-c:a', 'aac', '-b:a', '64k', '-ac', '1',
      '-movflags', '+faststart',
      candidate,
    ]);

    const { renameSync, rmSync: removeSync } = await import('node:fs');
    let strategy = 'remux';
    if (statSync(candidate).size < remuxed * 0.92) {
      removeSync(videoOut, { force: true });
      renameSync(candidate, videoOut);
      strategy = 're-encode';
    } else {
      removeSync(candidate, { force: true });
    }

    const before = statSync(input).size;
    const after = statSync(videoOut).size;

    manifest[clip.slug] = {
      slug: clip.slug,
      src: `/video/${clip.slug}.mp4`,
      poster: `/video/${clip.slug}-poster.jpg`,
      posterBlur: `data:image/webp;base64,${blur.toString('base64')}`,
      width: posterMeta.width ?? 0,
      height: posterMeta.height ?? 0,
      bytes: after,
    };

    console.log(
      `  ${clip.slug}  ${(before / 1024 / 1024).toFixed(1)}MB -> ${(after / 1024 / 1024).toFixed(1)}MB (${strategy})  poster ${posterMeta.width}x${posterMeta.height} ${(statSync(posterOut).size / 1024).toFixed(0)}KB`,
    );
  }

  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`build-video: manifest -> ${MANIFEST.replace(process.cwd(), '.')}`);
  console.log('build-video: re-run `npm run build:images` to pick up the new stills.');
}

main().catch((error) => {
  console.error('build-video:', error instanceof Error ? error.message : error);
  process.exit(1);
});
