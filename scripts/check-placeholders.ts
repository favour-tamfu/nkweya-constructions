/**
 * check-placeholders — §13.3, the mechanism that stops this site shipping with
 * the placeholder rot found on every competitor audited.
 *
 * Every one of the eight Cameroonian construction sites in the market research
 * went live with something unfinished still visible: lorem ipsum testimonials
 * attributed to "Alice Howard" (twice), homepage counters reading "0+ projects"
 * and "0% client satisfaction", statistics charts rendering "No Data Found",
 * and a portfolio of stock projects in New York, Malmö, Toronto and Athens.
 *
 * Discipline does not prevent that; a failing build does. This warns in
 * development and FAILS when SITE_STAGE=launch.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SCAN = [join(ROOT, 'src/content'), join(ROOT, 'src/messages')];

/** [UPPERCASE BRACKETS] — an unsupplied fact (§0.1). */
const BRACKET = /\[[A-ZÀ-Ý][A-ZÀ-Ý0-9_ /:,'’—–-]*\]/;

/** A TODO is worth flagging wherever it sits, comments included. */
const TODO = /\bTODO\b|\bFIXME\b/;

/**
 * Placeholder prose that must never reach a visitor. Checked outside comments
 * only: the content files legitimately DISCUSS lorem ipsum, because explaining
 * why three competitors still have it in their testimonial slots is the reason
 * this check exists.
 */
const FILLER = /lorem ipsum|dolor sit amet|Alice Howard|John Doe/i;

/** Rough but sufficient: drops // line comments and block comments. */
function withoutComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

const isLaunch = process.env.SITE_STAGE === 'launch';

interface Finding {
  file: string;
  detail: string;
  blocking: boolean;
}

function walk(dir: string): string[] {
  try {
    return readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      return statSync(full).isDirectory() ? walk(full) : [full];
    });
  } catch {
    return [];
  }
}

const findings: Finding[] = [];

function add(file: string, detail: string, blocking = true) {
  findings.push({ file, detail, blocking });
}

function read(path: string): string {
  try {
    return readFileSync(join(ROOT, path), 'utf8');
  } catch {
    return '';
  }
}

/* --- unfilled brackets and TODOs across all content ------------------- */
for (const dir of SCAN) {
  for (const file of walk(dir)) {
    if (!/\.(ts|tsx|json|mdx)$/.test(file)) continue;
    const text = readFileSync(file, 'utf8');
    const rel = relative(ROOT, file).replace(/\\/g, '/');

    const brackets = text.match(new RegExp(BRACKET, 'g'));
    if (brackets) {
      const unique = [...new Set(brackets)];
      add(rel, `${unique.length} unfilled placeholder(s): ${unique.slice(0, 3).join(', ')}${unique.length > 3 ? ' …' : ''}`);
    }
    if (TODO.test(text)) add(rel, 'TODO / FIXME');
    if (FILLER.test(withoutComments(text))) add(rel, 'placeholder filler text in published content');
  }
}

/* --- the company email must not be free-mail (§4.1) ------------------- */
const company = read('src/content/company.ts');
if (/^\s*email:\s*'[^']*(gmail|yahoo|hotmail|outlook)\.com'/im.test(company)) {
  add(
    'src/content/company.ts',
    'company.email is a free-mail address — a client about to wire 30M FCFA reads that as "not a real company"',
  );
}
if (/foundedYear:\s*0\b/.test(company)) add('src/content/company.ts', 'foundingYear is still 0');
if (/permanent:\s*0\b/.test(company)) add('src/content/company.ts', 'staffCount is still 0');

/* --- cost rates (§10) -------------------------------------------------- */
const costs = read('src/content/costs.ts');
if (/perSqmMinFcfa:\s*0\b/.test(costs) || /perSqmMaxFcfa:\s*0\b/.test(costs)) {
  add('src/content/costs.ts', 'zero-valued cost rates — the estimator cannot produce a figure');
}
if (/priceFcfa:\s*0\b/.test(costs)) {
  add('src/content/costs.ts', 'zero-valued material prices');
}

/* --- projects (§0.2) --------------------------------------------------- */
const projects = read('src/content/projects.ts');
if (/year:\s*0\b/.test(projects)) add('src/content/projects.ts', 'zero-valued project year');
if (/images:\s*\[\s*\]/.test(projects)) {
  add(
    'src/content/projects.ts',
    'a completed building with no photographs — the critical path (§0.2)',
  );
}

/* --- testimonials ------------------------------------------------------ */
const testimonials = read('src/content/testimonials.ts');
if (/export const testimonials: Testimonial\[\] = \[\s*\]/.test(testimonials)) {
  add(
    'src/content/testimonials.ts',
    'no testimonials — better than invented ones, but this is the strongest missing proof',
    false,
  );
}

/* --- report ------------------------------------------------------------ */
if (findings.length === 0) {
  console.log('check-placeholders: clean.');
  process.exit(0);
}

const blocking = findings.filter((item) => item.blocking);
const advisory = findings.filter((item) => !item.blocking);

const log = isLaunch ? console.error : console.warn;
log(
  `check-placeholders: ${blocking.length} blocking, ${advisory.length} advisory` +
    (isLaunch ? ' — SITE_STAGE=launch, this build fails.' : ' (warning only; set SITE_STAGE=launch to enforce)'),
);

const byFile = new Map<string, Finding[]>();
for (const item of findings) {
  byFile.set(item.file, [...(byFile.get(item.file) ?? []), item]);
}
for (const [file, items] of byFile) {
  log(`  ${file}`);
  for (const item of items) log(`    ${item.blocking ? '·' : '~'} ${item.detail}`);
}

if (!isLaunch) {
  console.warn(
    '\n  These are real facts nobody has supplied yet. See 03-content-checklist.md.\n' +
      '  Nothing here will be filled in with something plausible.',
  );
}

process.exit(isLaunch && blocking.length > 0 ? 1 : 0);
