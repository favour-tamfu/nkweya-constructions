/**
 * check-interactive — nothing on the site should be clickable but inert.
 *
 * `check-links.ts` proves every internal href resolves to a file. It says
 * nothing about the other ways a control can be dead: an anchor with no href
 * at all, one pointing at `#`, a button with no accessible name, or an
 * external link that was mistyped and will never load.
 *
 * Everything here is checked against the exported HTML, which is what a
 * visitor actually receives.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const OUT = resolve(process.cwd(), 'out');

/** External schemes the site legitimately uses. */
const ALLOWED_SCHEMES = ['https:', 'http:', 'tel:', 'mailto:'];

/** Hosts the site links out to on purpose. */
const EXPECTED_HOSTS = ['wa.me'];

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

function visibleMarkup(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');
}

function audit(file: string): Issue[] {
  const html = visibleMarkup(readFileSync(file, 'utf8'));
  const page = file.replace(OUT, '').replace(/\\/g, '/');
  const issues: Issue[] = [];

  /* Anchors ---------------------------------------------------------- */
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const attrs = match[1] ?? '';
    const inner = (match[2] ?? '').replace(/<[^>]+>/g, '').trim();
    const href = attrs.match(/\bhref="([^"]*)"/)?.[1];

    if (href === undefined) {
      issues.push({ page, rule: 'anchor-no-href', detail: `<a${attrs.slice(0, 60)}>` });
      continue;
    }
    if (href === '' || href === '#') {
      issues.push({ page, rule: 'anchor-dead-href', detail: `href="${href}" — "${inner.slice(0, 40)}"` });
      continue;
    }

    // An in-page anchor must point at an id that exists on this page.
    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (id && !new RegExp(`id="${id}"`).test(html)) {
        issues.push({ page, rule: 'anchor-missing-target', detail: `${href} has no matching id` });
      }
      continue;
    }

    if (href.startsWith('/')) continue; // covered by check-links

    const scheme = href.match(/^([a-z]+:)/i)?.[1]?.toLowerCase();
    if (!scheme || !ALLOWED_SCHEMES.includes(scheme)) {
      issues.push({ page, rule: 'anchor-odd-scheme', detail: href.slice(0, 60) });
      continue;
    }

    if (scheme === 'tel:' && !/^tel:\+?[0-9]{6,}$/.test(href)) {
      issues.push({ page, rule: 'tel-malformed', detail: href });
    }
    if (scheme === 'mailto:' && !/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/.test(href)) {
      issues.push({ page, rule: 'mailto-malformed', detail: href });
    }
    if (scheme === 'https:' || scheme === 'http:') {
      const host = href.replace(/^https?:\/\//i, '').split('/')[0] ?? '';
      if (!EXPECTED_HOSTS.includes(host)) {
        issues.push({ page, rule: 'unexpected-external-host', detail: host });
      }
      // A wa.me link with no digits would open an empty chat.
      if (host === 'wa.me' && !/wa\.me\/\d{8,}/.test(href)) {
        issues.push({ page, rule: 'whatsapp-no-number', detail: href.slice(0, 70) });
      }
    }

    if (!inner && !/aria-label=/.test(attrs)) {
      issues.push({ page, rule: 'anchor-no-name', detail: href.slice(0, 50) });
    }
  }

  /* Buttons ---------------------------------------------------------- */
  for (const match of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
    const attrs = match[1] ?? '';
    const inner = (match[2] ?? '').replace(/<[^>]+>/g, '').trim();

    if (!inner && !/aria-label=|aria-labelledby=/.test(attrs)) {
      issues.push({ page, rule: 'button-no-name', detail: `<button${attrs.slice(0, 60)}>` });
    }
    // A button with no type inside a form submits it by accident.
    if (!/\btype="/.test(attrs)) {
      issues.push({ page, rule: 'button-no-type', detail: `"${inner.slice(0, 40)}"` });
    }
  }

  return issues;
}

function main() {
  if (!existsSync(OUT)) {
    console.warn('check-interactive: no out/ directory; skipping.');
    process.exit(0);
  }

  const pages = walk(OUT).filter((file) => file.endsWith('.html'));
  const issues = pages.flatMap(audit);

  if (issues.length === 0) {
    console.log(
      `check-interactive: ${pages.length} page(s) — no dead links or unlabelled controls.`,
    );
    process.exit(0);
  }

  const byRule = new Map<string, Issue[]>();
  for (const issue of issues) {
    byRule.set(issue.rule, [...(byRule.get(issue.rule) ?? []), issue]);
  }

  console.error(`check-interactive: ${issues.length} issue(s):`);
  for (const [rule, items] of byRule) {
    console.error(`  ${rule} — ${items.length}`);
    for (const detail of [...new Set(items.map((item) => item.detail))].slice(0, 4)) {
      console.error(`      ${detail}`);
    }
    console.error(`      e.g. ${items[0]?.page}`);
  }
  process.exit(1);
}

main();
