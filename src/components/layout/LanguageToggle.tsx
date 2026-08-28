'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/cn';

export const LOCALE_STORAGE_KEY = 'nkweya-locale';

/**
 * §7: the toggle keeps you on the same page. `/en/projects` goes to
 * `/fr/realisations`, never a bounce to the homepage — the most common bug in
 * bilingual builds, and the one that makes visitors stop using the toggle.
 *
 * next-intl's `usePathname` returns the internal pathname, so `router.replace`
 * with the other locale resolves the translated route for us.
 */
export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function choose(next: (typeof routing.locales)[number]) {
    if (next === locale) return;
    try {
      // A manual choice beats detection, and it has to survive a return visit.
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* private mode, or storage disabled — the toggle still works */
    }
    router.replace(pathname as never, { locale: next });
  }

  return (
    <div
      className={cn(
        'flex items-center font-body text-[12px] font-semibold uppercase tracking-[0.12em]',
        !compact && 'border border-border-dark',
      )}
      role="group"
      aria-label={t('language')}
    >
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => choose(code)}
            aria-pressed={active}
            lang={code}
            className={cn(
              'inline-flex min-h-11 items-center justify-center px-3 transition-colors duration-150',
              compact && 'min-w-11 px-2',
              active
                ? 'bg-slate-800 text-iroko'
                : 'text-nav hover:bg-slate-800 hover:text-white',
            )}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
