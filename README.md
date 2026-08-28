# Nkweya & Sons Constructions — website

**Live:** https://favour-tamfu.github.io/nkweya-constructions/

Bilingual (EN/FR) static site for a Cameroonian civil engineering contractor
working across Buea, Limbe, Douala, Yaoundé and Bamenda.

**Stack** — Next.js 15 App Router with `output: 'export'` · React 19 ·
TypeScript strict · Tailwind v4 · next-intl · sharp. No CMS, no backend, no
animation library. Deploys to Cloudflare Pages as static files.

---

## Getting started

```bash
npm install
npm run dev            # http://localhost:3000 -> redirects to /en/
npm run preview        # build, then serve the real site with published URLs
npm run build          # prebuild generates images, postbuild localises routes
npm start              # serve an existing out/ directory
```

### Dev URLs differ from published URLs

Published: `/en/our-work`, `/fr/realisations`, `/fr/a-propos`.
In `next dev`: `/en/projects`, `/fr/projects`, `/fr/about`.

Rewriting a translated URL back to its App Router directory is middleware's
job, and `output: 'export'` has no server to run middleware on. Production does
not need middleware — `scripts/localize-routes.ts` renames the emitted
directories after the build — but `next dev` has no such step, so a translated
pathname would 404 on every link.

`src/i18n/routing.ts` therefore maps every route to itself in development and
to its published pathname in production. Everything else is identical; use
`npm run preview` to see the real URLs, and `npm run check:links` verifies them
on every build.

## Pages

| Route (EN) | Route (FR) | |
|---|---|---|
| `/` | `/` | Home |
| `/services` · `/services/[slug]` | same | Five services, each with scope and exclusions |
| `/our-work` · `/our-work/[slug]` | `/realisations` | Completed buildings, plus site footage |
| `/designs` | `/vues-architecte` | Architectural visualisations, with lightbox |
| `/process` | `/processus` | Eleven stages from first contact to handover |
| `/about` | `/a-propos` | The company and the engineer |
| `/building-in/[city]` | `/construire-a/[city]` | Five city pages |
| `/contact` | `/contact` | Phone, WhatsApp, email |
| `/legal/privacy` · `/legal/terms` | `/mentions/…` | |

## Content

All copy lives in typed modules under `src/content/` and in
`src/messages/{en,fr}.json`. Nothing is hard-coded in a page.

Two rules the test suite enforces:

- **No placeholder text.** `content.test.ts` walks every content module and both
  message files looking for bracketed stand-ins, "lorem ipsum", "TBC" or
  "TODO", and fails if it finds any.
- **No comparative copy.** The same suite fails the build if the site's text
  mentions competitors or comparisons. The voice is about the practice and its
  work, nothing else.

A visualisation is never presented as a completed building: `designs.ts` images
are all `kind: 'render'` and always render with a label, and a test asserts that
no render slug appears in `projects.ts`.

### The videos

The client's four clips are real site footage — a slab pour, a structure in
elevation, reinforcement before a pour, and a concrete cube on a compression
machine. They sit on `/our-work` under "Work in progress", with the two that
show inspection linked to the structural supervision service. Poster frames and
still frames are extracted at build time by `scripts/build-video.ts`; nothing
downloads until a visitor presses play.

## Layout

```
assets/source/        committed source images — the input to build-images
scripts/
  prepare-media.ts    renames the client's exports, crops the phone screenshots
  build-images.ts     AVIF/WebP/JPEG ladders, LQIP, OG cards, icons, manifest
  build-video.ts      poster frames, still frames, web-weight re-encodes
  localize-routes.ts  postbuild — renames out/fr/about to out/fr/a-propos etc.
  check-links.ts      every internal link resolves
  check-a11y.ts       static WCAG 2.1 AA rules
  check-budget.ts     per-page transfer and JS budgets
  shoot.ts            screenshots at 390px and 1440px, flags overflow
src/
  app/[locale]/       all routes; the root layout is a pass-through so this
                      segment owns <html lang>
  components/         layout · sections · ui · media · icons · seo
  content/            typed content modules
  lib/                formatters, media manifest, seo helpers
  messages/           en.json · fr.json
  i18n/               routing (translated pathnames), request, navigation
```

## Why `localize-routes` exists

next-intl resolves `<Link href="/projects">` to `/fr/realisations/`. Its
middleware normally rewrites that at request time — but `output: 'export'` has
no server, so the build emits `out/fr/projects/` while every French link points
at `/fr/realisations/`.

Without the postbuild step, **every French URL 404s and the build still reports
success.** `npm run check:links` catches it if the step is ever skipped.

## Checks

```bash
npm run typecheck
npm run lint
npm test                   # content invariants, formatters, i18n parity
npm run check:links        # after a build
npm run check:a11y         # after a build
npm run check:budget       # after a build
```

Homepage first visit, gzipped:

| | measured | limit |
|---|---|---|
| JavaScript | 118 KB | 150 KB |
| Total transfer | 273 KB | 500 KB |
| Largest image | < 120 KB | 120 KB |

`polyfills.js` (38.7 KB) is `nomodule` and is not counted — no browser that
supports ES modules downloads it.

## Regenerating media

Only needed when new files arrive. Reads `../media/`.

```bash
npm run media:prepare   # rename + de-screenshot into assets/source/
npm run media:video     # posters, stills, re-encodes (needs ffmpeg-static)
npm run build:images    # responsive derivatives + manifest
```

## Still to come

- A portrait of Nkweya Francis. The About page holds a framed slot for it.
- Photographs of First Trust Bank and the CCC Building in Limbe.

## Deployment

`.github/workflows/deploy.yml` publishes to GitHub Pages on every push to
`main`. It runs the full gate — typecheck, lint, tests, build, links,
accessibility, budget — and only uploads the artifact if all of it passes.

Two environment variables drive the deployment:

| | |
|---|---|
| `NEXT_PUBLIC_BASE_PATH` | `/nkweya-constructions` — the path the site is served under |
| `NEXT_PUBLIC_SITE_URL` | `https://favour-tamfu.github.io/nkweya-constructions` — the full origin |

### Why the base path needs care

A GitHub Pages project site is served from `/<repo>/`. Next applies `basePath`
to `<Link>`, the router and `/_next/*` by itself — but **not** to raw strings,
and this site has several: `<img src>` and `<source srcSet>` built from the
image manifest, `<video src>` and `poster` from the video manifest, the
metadata icon URLs, and the `window.location.replace` in the root locale
splash. `src/lib/base-path.ts` prefixes each of those from the same variable
the config reads.

`check-links` and `check-budget` strip the prefix before resolving a URL
against `out/`, since the built files have no such directory.

### Moving to a custom domain

Set `NEXT_PUBLIC_BASE_PATH` to an empty string and `NEXT_PUBLIC_SITE_URL` to
the new origin, then add the domain in the repository's Pages settings. Nothing
else changes — an empty base path is the default everywhere.
