import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { company } from '@/content/company';
import { displayPhone, telHref, whatsappHref } from '@/lib/whatsapp';
import { buttonClassName } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { IconPhone, IconWhatsApp } from '@/components/icons/NavIcons';

/**
 * One primary action, repeated down every page. WhatsApp sits beside it
 * because it is how most clients here make first contact.
 */
export async function FinalCta({
  title,
  body,
  whatsappMessage,
}: {
  title?: string;
  body?: string;
  whatsappMessage?: string;
}) {
  const t = await getTranslations();
  const wa = whatsappHref(company.whatsappPrimary, whatsappMessage ?? t('whatsapp.default'));

  return (
    <Section tone="russet">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[46ch]">
          <h2 className="font-display text-[26px] font-extrabold leading-[1.12] text-white md:text-[34px]">
            {title ?? t('home.finalTitle')}
          </h2>
          <p className="mt-4 text-[16px] leading-[1.6] text-on-russet md:text-[17px]">
            {body ?? t('home.finalBody')}
          </p>
          <a
            href={telHref(company.whatsappPrimary)}
            className="mt-5 inline-flex min-h-11 items-center gap-2 font-body text-[17px] font-semibold tabular-nums text-white no-underline hover:text-on-russet"
          >
            <IconPhone className="h-5 w-5" />
            {displayPhone(company.whatsappPrimary)}
          </a>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <Link href="/contact" className={buttonClassName('inverse', undefined, false, 'lg')}>
            {t('cta.contact')}
          </Link>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClassName('secondary', undefined, false, 'lg')}
          >
            <IconWhatsApp className="h-5 w-5" />
            {t('cta.whatsapp')}
          </a>
        </div>
      </div>
    </Section>
  );
}
