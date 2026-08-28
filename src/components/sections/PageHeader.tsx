import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Eyebrow } from '@/components/ui/Section';
import { cn } from '@/lib/cn';

export interface Crumb {
  label: string;
  href?: Parameters<typeof Link>[0]['href'];
}

/**
 * The masthead every inner page opens with. One `h1` per page (§13.2), and the
 * breadcrumb doubles as the BreadcrumbList the page also emits as JSON-LD.
 */
export async function PageHeader({
  eyebrow,
  title,
  lede,
  crumbs = [],
  children,
  tone = 'slate',
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
  tone?: 'slate' | 'limewash';
}) {
  const t = await getTranslations('nav');
  const onDark = tone === 'slate';

  return (
    <header className={cn(onDark ? 'bg-slate text-white' : 'bg-limewash text-slate')}>
      <div className="mx-auto max-w-[1440px] px-[18px] pb-10 pt-8 md:px-14 md:pb-16 md:pt-12">
        {crumbs.length > 0 ? (
          <nav aria-label={t('breadcrumb')} className="mb-6">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-[12px]">
              <li>
                <Link
                  href="/"
                  className={cn(
                    'inline-flex min-h-9 items-center no-underline transition-colors',
                    onDark ? 'text-dim hover:text-iroko' : 'text-mortar hover:text-russet',
                  )}
                >
                  {t('home')}
                </Link>
              </li>
              {crumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span aria-hidden className={onDark ? 'text-rule-dark' : 'text-stucco'}>
                    /
                  </span>
                  {crumb.href && index < crumbs.length - 1 ? (
                    <Link
                      href={crumb.href}
                      className={cn(
                        'inline-flex min-h-9 items-center no-underline transition-colors',
                        onDark ? 'text-dim hover:text-iroko' : 'text-mortar hover:text-russet',
                      )}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      aria-current="page"
                      className={cn('inline-flex min-h-9 items-center', onDark ? 'text-ash' : 'text-slate')}
                    >
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {eyebrow ? <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow> : null}

        <h1
          className={cn(
            'max-w-[20ch] font-display text-[32px] font-extrabold leading-[1.06] tracking-[-0.02em] md:text-[48px]',
            Boolean(eyebrow) && 'mt-4',
            onDark ? 'text-white' : 'text-slate',
          )}
        >
          {title}
        </h1>

        {lede ? (
          <div
            className={cn(
              'prose-measure mt-5 text-[17px] leading-[1.65] md:text-[18px]',
              onDark ? 'text-ash' : 'text-mortar',
            )}
          >
            {lede}
          </div>
        ) : null}

        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}
