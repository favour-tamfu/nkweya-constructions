/**
 * localize-routes — makes next-intl's translated pathnames real on disk.
 *
 * THE BUG THIS FIXES, because it is not obvious:
 *
 * next-intl resolves `<Link href="/projects">` to `/fr/realisations/` — the
 * translated pathname from `i18n/routing.ts`. Normally its middleware rewrites
 * that back to the internal route at request time. Under `output: 'export'`
 * there is no middleware and no server: Next writes the directory tree from
 * the file system, so the build emits `out/fr/projects/` while every French
 * link on the site points at `/fr/realisations/`.
 *
 * The result is a bilingual site where every French URL 404s — which §7 of the
 * build spec calls "the most common bilingual bug there is".
 *
 * So after `next build`, the emitted directories are renamed to the localized
 * paths the links actually use. Only the static prefix of a route matters:
 * moving `fr/projects` also moves `fr/projects/ccc-building-limbe`, which is
 * why `/projects/[slug]` needs no rule of its own.
 */
import { existsSync, mkdirSync, readdirSync, renameSync, rmdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { publishedPathnames, routing } from '../src/i18n/routing';

const OUT = resolve(process.cwd(), 'out');

interface Move {
  locale: string;
  from: string;
  to: string;
}

/** `/projects/[slug]` -> `/projects`. Dynamic segments never rename. */
function staticPrefix(pathname: string): string {
  const cut = pathname.indexOf('/[');
  const base = cut === -1 ? pathname : pathname.slice(0, cut);
  return base.replace(/\/$/, '');
}

function collectMoves(): Move[] {
  const moves = new Map<string, Move>();

  for (const [key, mapping] of Object.entries(publishedPathnames)) {
    if (typeof mapping === 'string') continue; // same in every locale

    for (const locale of routing.locales) {
      const localized = (mapping as Record<string, string>)[locale];
      if (!localized) continue;

      const from = staticPrefix(key);
      const to = staticPrefix(localized);
      if (!from || !to || from === to) continue;

      moves.set(`${locale}:${from}`, { locale, from, to });
    }
  }

  // Deepest first, so `/legal/privacy` is moved out before `/legal` is tidied.
  return [...moves.values()].sort(
    (a, b) => b.from.split('/').length - a.from.split('/').length,
  );
}

function main() {
  if (!existsSync(OUT)) {
    console.error('localize-routes: no out/ directory — run `next build` first.');
    process.exit(1);
  }

  const moves = collectMoves();
  let moved = 0;

  for (const move of moves) {
    const from = join(OUT, move.locale, move.from);
    const to = join(OUT, move.locale, move.to);

    if (!existsSync(from)) continue;
    if (existsSync(to)) {
      console.warn(`  skip (target exists): ${move.locale}${move.from} -> ${move.to}`);
      continue;
    }

    mkdirSync(dirname(to), { recursive: true });
    renameSync(from, to);
    console.log(`  ${move.locale}${move.from}  ->  ${move.locale}${move.to}`);
    moved += 1;

    // Tidy the now-empty parent, e.g. fr/legal after both children moved out.
    const parent = dirname(from);
    if (parent !== join(OUT, move.locale) && existsSync(parent)) {
      try {
        if (readdirSync(parent).length === 0) rmdirSync(parent);
      } catch {
        /* not empty, or in use — leaving it is harmless */
      }
    }
  }

  console.log(`localize-routes: ${moved} route(s) renamed to their translated paths.`);
}

main();
