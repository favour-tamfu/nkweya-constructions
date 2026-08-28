import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { services } from '@/content/services';
import { assertLocale } from '@/lib/locale';
import { buildMetadata, breadcrumbSchema, localePath } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, buttonClassName } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCta } from '@/components/sections/FinalCta';
import { ServiceIcon } from '@/components/icons/ServiceIcons';
import { IconCheck, IconExcluded } from '@/components/icons/NavIcons';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = assertLocale(raw);
  const t = await getTranslations({ locale, namespace: 'meta.pages.services' });
  return buildMetadata({ locale, href: '/services', title: t('title'), description: t('description') });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = assertLocale(raw);
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: t('nav.home'), path: localePath('/', locale) },
          { name: t('nav.services'), path: localePath('/services', locale) },
        ])}
      />

      <PageHeader
        eyebrow={t('services.eyebrow')}
        title={t('services.title')}
        lede={<p>{t('services.intro')}</p>}
        crumbs={[{ label: t('nav.services') }]}
      />

      <Section tone="limewash">
        <ul className="grid gap-px bg-hairline">
          {services.map((service, index) => {
            const includes = service.includes[locale].slice(0, 4);
            const excludes = service.excludes[locale].slice(0, 3);

            return (
              <Reveal as="li" key={service.slug} delay={Math.min(index * 50, 200)} className="bg-limewash">
                <article className="grid gap-6 bg-card p-6 md:grid-cols-12 md:gap-8 md:p-9">
                  <div className="md:col-span-4">
                    <div className="flex items-start gap-4">
                      <ServiceIcon name={service.icon} className="h-9 w-9 shrink-0 text-russet" />
                      <div>
                        <h2 className="font-display text-[21px] font-bold leading-snug text-slate md:text-[24px]">
                          <Link
                            href={{ pathname: '/services/[slug]', params: { slug: service.slug } }}
                            className="text-slate no-underline transition-colors hover:text-russet"
                          >
                            {service.name[locale]}
                          </Link>
                        </h2>
                      </div>
                    </div>
                    <p className="mt-4 text-[15px] leading-[1.6] text-mortar">
                      {service.summary[locale]}
                    </p>
                    <Link
                      href={{ pathname: '/services/[slug]', params: { slug: service.slug } }}
                      className={`${buttonClassName('text')} mt-4`}
                    >
                      {t('cta.readMore')}
                      <ArrowRight />
                    </Link>
                  </div>

                  <div className="md:col-span-4">
                    <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-mortar">
                      {t('services.includes')}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {includes.map((item) => (
                        <li key={item} className="flex gap-2.5 text-[15px] leading-snug text-slate">
                          <IconCheck className="mt-1 h-3.5 w-3.5 shrink-0 text-russet" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-4">
                    <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-mortar">
                      {t('services.excludes')}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {excludes.map((item) => (
                        <li key={item} className="flex gap-2.5 text-[15px] leading-snug text-mortar">
                          <IconExcluded className="mt-1 h-3.5 w-3.5 shrink-0 text-dim" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>

        <p className="prose-measure mt-8 border-l-2 border-russet bg-stucco px-5 py-4 text-[15px] leading-[1.6] text-mortar">
          {t('services.excludesNote')}
        </p>
      </Section>

      <FinalCta />
    </main>
  );
}
