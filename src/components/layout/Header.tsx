'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { company } from '@/content/company';
import { whatsappHref } from '@/lib/whatsapp';
import { cn } from '@/lib/cn';
import { buttonClassName } from '@/components/ui/Button';
import { LogoMark } from '@/components/icons/LogoMark';
import { IconClose, IconMenu, IconWhatsApp } from '@/components/icons/NavIcons';
import { LanguageToggle } from './LanguageToggle';

const links = [
  { href: '/services', key: 'services' },
  { href: '/projects', key: 'projects' },
  { href: '/designs', key: 'designs' },
  { href: '/process', key: 'process' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const;

export function Header({ whatsappMessage }: { whatsappMessage: string }) {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wa = whatsappHref(company.whatsappPrimary, whatsappMessage);

  // Close on route change — otherwise the panel survives a navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // The header condenses once the hero is behind you. Passive listener, and
  // rAF-throttled so it cannot cost anything on a mid-range Android.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setCondensed(window.scrollY > 24);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Escape closes, focus returns to the toggle, and the page behind stops
  // scrolling while the panel is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-slate text-white transition-shadow duration-200',
        condensed && 'shadow-[0_1px_0_0_var(--color-border-dark)]',
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-[18px] transition-[padding] duration-200 md:px-14',
          condensed ? 'py-2' : 'py-3',
        )}
      >
        <Link href="/" className="flex min-h-12 items-center gap-3 no-underline">
          <LogoMark />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[15px] font-bold tracking-[-0.01em] text-white md:text-[17px]">
              Nkweya &amp; Sons
            </span>
            <span
              className={cn(
                'mt-1 hidden font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-dim transition-opacity duration-200 sm:block',
                condensed && 'opacity-0',
              )}
            >
              Constructions
            </span>
          </span>
        </Link>

        <nav className="hidden items-center xl:flex" aria-label={t('nav.menu')}>
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'relative inline-flex min-h-11 items-center px-3 py-3 font-body text-[13px] font-medium no-underline transition-colors duration-150',
                isActive(item.href) ? 'text-white' : 'text-nav hover:text-white',
              )}
            >
              {t(`nav.${item.key}`)}
              <span
                className={cn(
                  'absolute inset-x-3 bottom-1.5 h-px origin-left bg-iroko transition-transform duration-200 ease-out',
                  isActive(item.href) ? 'scale-x-100' : 'scale-x-0',
                )}
                aria-hidden
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <LanguageToggle />
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClassName('secondary', undefined, false, 'sm')}
          >
            <IconWhatsApp className="h-4 w-4" />
            {t('cta.whatsappShort')}
          </a>
          <Link href="/contact" className={buttonClassName('primary', undefined, false, 'sm')}>
            {t('cta.contact')}
          </Link>
        </div>

        <div className="flex items-center gap-1 xl:hidden">
          <LanguageToggle compact />
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex min-h-12 min-w-12 items-center justify-center text-nav hover:text-white"
            aria-expanded={open}
            aria-controls="primary-menu"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        id="primary-menu"
        ref={panelRef}
        hidden={!open}
        className="max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-border-dark bg-slate px-[18px] pb-6 pt-2 xl:hidden"
      >
        <nav className="flex flex-col" aria-label={t('nav.menu')}>
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'flex min-h-12 items-center border-b border-rule-dark py-3 font-body text-[16px] no-underline',
                isActive(item.href) ? 'text-iroko' : 'text-nav',
              )}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>
        <div className="mt-5 flex flex-col gap-3">
          <Link href="/contact" className={buttonClassName('primary', undefined, true)}>
            {t('cta.contact')}
          </Link>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClassName('whatsapp', undefined, true)}
          >
            <IconWhatsApp className="h-5 w-5" />
            {t('cta.whatsapp')}
          </a>
        </div>
      </div>
    </header>
  );
}
