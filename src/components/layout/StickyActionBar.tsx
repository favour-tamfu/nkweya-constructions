import { getTranslations } from 'next-intl/server';
import { company } from '@/content/company';
import { telHref, whatsappHref } from '@/lib/whatsapp';
import { IconMail, IconPhone, IconWhatsApp } from '@/components/icons/NavIcons';
import { Link } from '@/i18n/navigation';

/**
 * WhatsApp · Call · Contact, equal thirds, fixed to the bottom on mobile.
 *
 * `env(safe-area-inset-bottom)` keeps it clear of the iPhone home indicator,
 * and `.site-wrap` in globals.css carries a matching spacer so the bar never
 * covers the footer.
 *
 * Most visitors here arrive on a phone, and WhatsApp is how they get in touch,
 * so it stays within a thumb's reach on every page.
 */
export async function StickyActionBar({ whatsappMessage }: { whatsappMessage: string }) {
  const t = await getTranslations('cta');
  const wa = whatsappHref(company.whatsappPrimary, whatsappMessage);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-hairline bg-card md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[54px] flex-col items-center justify-center gap-1 font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-whatsapp-ink no-underline active:bg-stucco"
      >
        <IconWhatsApp className="h-5 w-5 text-whatsapp" />
        {t('whatsappShort')}
      </a>
      <a
        href={telHref(company.whatsappPrimary)}
        className="flex min-h-[54px] flex-col items-center justify-center gap-1 border-x border-hairline font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-slate no-underline active:bg-stucco"
      >
        <IconPhone className="h-5 w-5" />
        {t('callShort')}
      </a>
      <Link
        href="/contact"
        className="flex min-h-[54px] flex-col items-center justify-center gap-1 bg-russet font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-white no-underline active:bg-russet-deep"
      >
        <IconMail className="h-5 w-5" />
        {t('contactShort')}
      </Link>
    </div>
  );
}
