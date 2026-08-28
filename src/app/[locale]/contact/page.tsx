import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { company } from '@/content/company';
import { cities } from '@/content/cities';
import { processStages } from '@/content/process';
import { assertLocale } from '@/lib/locale';
import { displayPhone, telHref, whatsappHref } from '@/lib/whatsapp';
import { breadcrumbSchema, buildMetadata, localePath } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, buttonClassName } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { PageHeader } from '@/components/sections/PageHeader';
import { PhoneList } from '@/components/sections/PhoneList';
import { IconMail, IconWhatsApp } from '@/components/icons/NavIcons';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = assertLocale(raw);
  const t = await getTranslations({ locale, namespace: 'meta.pages.contact' });
  return buildMetadata({ locale, href: '/contact', title: t('title'), description: t('description') });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = assertLocale(raw);
  setRequestLocale(locale);
  const t = await getTranslations();

  const wa = whatsappHref(company.whatsappPrimary, t('whatsapp.default'));
  const firstStages = processStages.slice(0, 3);

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: t('nav.home'), path: localePath('/', locale) },
          { name: t('nav.contact'), path: localePath('/contact', locale) },
        ])}
      />

      <PageHeader
        eyebrow={t('contact.eyebrow')}
        title={t('contact.title')}
        lede={<p>{t('contact.intro')}</p>}
        crumbs={[{ label: t('nav.contact') }]}
      />

      <Section tone="limewash">
        <div className="grid gap-px bg-hairline lg:grid-cols-3">
          {/* WhatsApp first — it is how most clients get in touch. */}
          <div className="flex flex-col bg-card p-6 md:p-8">
            <IconWhatsApp className="h-8 w-8 text-whatsapp" />
            <h2 className="mt-5 font-display text-[21px] font-bold text-slate">
              {t('contact.whatsappTitle')}
            </h2>
            <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-mortar">
              {t('contact.whatsappBody')}
            </p>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName('whatsapp', 'mt-6', true)}
            >
              <IconWhatsApp className="h-5 w-5" />
              {t('cta.whatsapp')}
            </a>
          </div>

          <div className="flex flex-col bg-card p-6 md:p-8">
            <h2 className="font-display text-[21px] font-bold text-slate">{t('contact.phones')}</h2>
            <div className="mt-5 flex-1">
              <PhoneList
                phones={company.phones.map((phone, index) => ({
                  raw: phone,
                  display: displayPhone(phone),
                  href: telHref(phone),
                  primary: index === 0,
                }))}
                primaryLabel={t('contact.primaryLabel')}
                copyLabel={t('contact.copyNumber')}
                copiedLabel={t('contact.copied')}
              />
            </div>
          </div>

          <div className="flex flex-col bg-card p-6 md:p-8">
            <IconMail className="h-8 w-8 text-russet" />
            <h2 className="mt-5 font-display text-[21px] font-bold text-slate">
              {t('contact.emailTitle')}
            </h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-mortar">{t('contact.emailBody')}</p>
            <ul className="mt-4 flex-1">
              {company.emails.map((email) => (
                <li key={email}>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex min-h-11 items-center break-all text-[16px] text-russet no-underline hover:text-russet-dark"
                  >
                    {email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="stucco">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading title={t('contact.nextTitle')} body={t('contact.nextBody')} />
            <ol className="mt-8 grid gap-px bg-hairline">
              {firstStages.map((stage) => (
                <li key={stage.number} className="flex gap-5 bg-card p-5">
                  <span className="figure-numerals w-8 shrink-0 font-display text-[22px] font-extrabold text-stucco">
                    {String(stage.number).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block font-display text-[17px] font-bold text-slate">
                      {stage.name[locale]}
                    </span>
                    <span className="mt-1 block text-[15px] leading-snug text-mortar">
                      {stage.what[locale]}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <Link href="/process" className={`${buttonClassName('text')} mt-6`}>
              {t('cta.process')}
              <ArrowRight />
            </Link>
          </div>

          <div className="lg:col-span-5">
            <h2 className="font-display text-[22px] font-bold text-slate md:text-[26px]">
              {t('contact.citiesTitle')}
            </h2>
            <ul className="mt-6 grid gap-px bg-hairline">
              {cities.map((city) => (
                <li key={city.slug} className="bg-card">
                  <Link
                    href={{ pathname: '/cities/[city]', params: { city: city.slug } }}
                    className="flex items-center justify-between gap-4 p-4 no-underline transition-colors hover:bg-limewash"
                  >
                    <span>
                      <span className="block font-display text-[18px] font-bold text-slate">
                        {city.name}
                      </span>
                      <span className="block font-body text-[12px] uppercase tracking-[0.14em] text-mortar">
                        {city.region[locale]}
                      </span>
                    </span>
                    <ArrowRight className="text-russet" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </main>
  );
}
