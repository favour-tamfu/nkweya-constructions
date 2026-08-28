import type { Locale } from '@/types/content';

/**
 * The thousands separator: U+202F NARROW NO-BREAK SPACE.
 *
 * Correct typography for FCFA in both English and French Cameroon, and — the
 * practical reason — it is non-breaking, so "12 500 000 FCFA" can never wrap
 * across two lines and be misread as two different figures on a narrow phone.
 */
const THIN_NBSP = ' ';

/**
 * FCFA has no minor unit. `Intl` gets close but appends the currency in a
 * position that reads oddly in English, so the suffix is applied by hand.
 */
export function formatFcfa(value: number, _locale: Locale): string {
  // `_locale` is unused: FCFA is grouped and suffixed identically in English
  // and French. It stays in the signature so every formatter here is called
  // the same way, and so a locale-specific rule can land without a refactor.
  const grouped = Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, THIN_NBSP);
  return `${grouped} FCFA`;
}

/** 12 500 000 -> "12,5 M FCFA" / "12.5M FCFA". For headline figures only. */
export function formatFcfaShort(value: number, locale: Locale): string {
  const decimal = locale === 'fr' ? ',' : '.';
  if (value >= 1_000_000) {
    const millions = (value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1);
    return `${millions.replace('.', decimal)} M FCFA`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)} k FCFA`;
  }
  return formatFcfa(value, locale);
}

export function formatSqm(value: number, locale: Locale): string {
  const decimal = locale === 'fr' ? ',' : '.';
  const shown = Number.isInteger(value) ? String(value) : value.toFixed(1).replace('.', decimal);
  return `${shown} m²`;
}

/** ISO date -> "12 March 2026" / "12 mars 2026". */
export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-CM' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
