/**
 * check-a11y — the WCAG 2.1 AA rules from §13.2 that can be verified in the
 * exported HTML without a browser.
 *
 * Deliberately limited to what static markup can prove: one h1, no skipped
 * heading levels, alt text on every image, a lang attribute, a form label for
 * every control, and a skip link. Contrast and tap-target size are settled by
 * the design tokens and the 48px minimums in the component layer; layout and
 * focus order need a real browser.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const OUT = resolve(process.cwd(), 'out');

interface Issue {
  page: string;
  rule: string;
  detail: string;
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

/** Strips <script> and <style> bodies so their contents are never scanned. */
function visibleMarkup(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');
}

function audit(file: string): Issue[] {
  const raw = readFileSync(file, 'utf8');
  const html = visibleMarkup(raw);
  const page = file.replace(OUT, '').replace(/\\/g, '/');
  const issues: Issue[] = [];

  /* lang ------------------------------------------------------------- */
  const lang = raw.match(/<html[^>]+lang="([^"]+)"/);
  if (!lang) issues.push({ page, rule: 'html-lang', detail: 'no lang attribute' });
  else if (!/^(en|fr)$/.test(lang[1] ?? '')) {
    issues.push({ page, rule: 'html-lang', detail: `unexpected lang "${lang[1]}"` });
  }

  /* headings --------------------------------------------------------- */
  const headings = [...html.matchAll(/<h([1-6])[^>]*>/g)].map((match) => Number(match[1]));
  const h1Count = headings.filter((level) => level === 1).length;
  if (h1Count === 0) issues.push({ page, rule: 'one-h1', detail: 'no h1' });
  if (h1Count > 1) issues.push({ page, rule: 'one-h1', detail: `${h1Count} h1 elements` });

  let previous = 0;
  for (const level of headings) {
    if (previous && level > previous + 1) {
      issues.push({
        page,
        rule: 'heading-order',
        detail: `h${previous} followed by h${level}`,
      });
      break;
    }
    previous = level;
  }

  /* images ----------------------------------------------------------- */
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = match[0];
    if (!/\balt=/.test(tag)) {
      issues.push({ page, rule: 'img-alt', detail: `img without alt: ${tag.slice(0, 90)}` });
    } else if (/\balt=""/.test(tag) && !/aria-hidden|role="presentation"/.test(tag)) {
      // An empty alt is correct for decoration, but decoration should say so.
      issues.push({ page, rule: 'img-alt', detail: 'empty alt without aria-hidden' });
    }
    if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag)) {
      issues.push({ page, rule: 'img-dimensions', detail: 'img without width/height (CLS)' });
    }
  }

  /* form controls ---------------------------------------------------- */
  const labelFor = new Set(
    [...html.matchAll(/<label[^>]+for="([^"]+)"/g)].map((match) => match[1]),
  );

  // A control nested inside a <label> is labelled implicitly. That is valid
  // HTML and correctly announced, and it is how the estimator's radio group is
  // built — so collect those before flagging anything as unlabelled.
  const implicitlyLabelled = new Set<string>();
  for (const label of html.matchAll(/<label\b[^>]*>([\s\S]*?)<\/label>/g)) {
    for (const control of (label[1] ?? '').matchAll(/<(input|select|textarea)\b[^>]*>/g)) {
      implicitlyLabelled.add(control[0]);
    }
  }

  for (const match of html.matchAll(/<(input|select|textarea)\b[^>]*>/g)) {
    const tag = match[0];
    if (/type="(hidden|submit|button)"/.test(tag)) continue;
    const id = tag.match(/\bid="([^"]+)"/)?.[1];
    const labelled =
      (id && labelFor.has(id)) ||
      implicitlyLabelled.has(tag) ||
      /aria-label=|aria-labelledby=/.test(tag);
    if (!labelled) {
      issues.push({ page, rule: 'form-label', detail: `unlabelled control: ${tag.slice(0, 80)}` });
    }
  }

  /* buttons and links need an accessible name ------------------------ */
  for (const match of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
    const attrs = match[1] ?? '';
    const text = (match[2] ?? '').replace(/<[^>]+>/g, '').trim();
    if (!text && !/aria-label=|aria-labelledby=/.test(attrs)) {
      issues.push({ page, rule: 'button-name', detail: 'button with no accessible name' });
    }
  }

  /* skip link -------------------------------------------------------- */
  // Only pages with a navigation block to skip past need one. The root-level
  // language chooser and 404 are a heading and two links — a skip link there
  // would be one more thing to tab through, not one less.
  const isLocalePage = /^\/(en|fr)\//.test(page);
  if (isLocalePage && !/class="skip-link"/.test(html)) {
    issues.push({ page, rule: 'skip-link', detail: 'no skip-to-content link' });
  }

  /* external links ---------------------------------------------------- */
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/rel="[^"]*noopener/.test(match[0])) {
      issues.push({ page, rule: 'target-blank-rel', detail: 'target=_blank without rel=noopener' });
    }
  }

  return issues;
}

function main() {
  if (!existsSync(OUT)) {
    console.warn('check-a11y: no out/ directory; skipping.');
    process.exit(0);
  }

  const pages = walk(OUT).filter((file) => file.endsWith('.html'));
  const issues = pages.flatMap(audit);

  if (issues.length === 0) {
    console.log(`check-a11y: ${pages.length} page(s) — no static issues found.`);
    process.exit(0);
  }

  // Group by rule; one broken component shows up on fifty pages.
  const byRule = new Map<string, Issue[]>();
  for (const issue of issues) {
    byRule.set(issue.rule, [...(byRule.get(issue.rule) ?? []), issue]);
  }

  console.error(`check-a11y: ${issues.length} issue(s) across ${pages.length} page(s):`);
  for (const [rule, items] of byRule) {
    console.error(`  ${rule} — ${items.length} occurrence(s)`);
    const unique = [...new Set(items.map((item) => item.detail))].slice(0, 3);
    for (const detail of unique) console.error(`      ${detail}`);
    console.error(`      e.g. ${items[0]?.page}`);
  }
  process.exit(1);
}

main();
