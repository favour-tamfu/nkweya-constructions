import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

export function assertLocale(locale: string): (typeof routing.locales)[number] {
  if (!hasLocale(routing.locales, locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }
  return locale;
}

export function alternateLocale(
  locale: (typeof routing.locales)[number],
): (typeof routing.locales)[number] {
  return locale === 'en' ? 'fr' : 'en';
}
