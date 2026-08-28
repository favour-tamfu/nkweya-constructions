import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { services } from '@/content/services';
import { buttonClassName } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

export default async function LocaleNotFound() {
  const t = await getTranslations();

  return (
    <main>
      <Section tone="slate" size="loose">
        <p className="figure-numerals font-display text-[64px] font-extrabold leading-none text-iroko md:text-[96px]">
          404
        </p>
        <h1 className="mt-6 max-w-[20ch] font-display text-[32px] font-extrabold leading-[1.06] tracking-[-0.02em] text-white md:text-[44px]">
          {t('notFound.title')}
        </h1>
        <p className="prose-measure mt-5 text-[17px] leading-[1.65] text-ash">{t('notFound.body')}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className={buttonClassName('primary', undefined, false, 'lg')}>
            {t('notFound.home')}
          </Link>
          <Link href="/contact" className={buttonClassName('secondary', undefined, false, 'lg')}>
            {t('cta.contact')}
          </Link>
        </div>
      </Section>

      <Section tone="limewash">
        <h2 className="font-display text-[22px] font-bold text-slate md:text-[26px]">
          {t('nav.services')}
        </h2>
        <ul className="mt-6 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-5">
          {services.map((service) => (
            <li key={service.slug} className="bg-card">
              <Link
                href={{ pathname: '/services/[slug]', params: { slug: service.slug } }}
                className="flex min-h-full items-center p-5 font-display text-[16px] font-bold text-slate no-underline transition-colors hover:bg-stucco"
              >
                {service.name.en}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
