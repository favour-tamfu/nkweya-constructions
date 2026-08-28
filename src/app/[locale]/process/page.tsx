import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { processStages } from '@/content/process';
import { assertLocale } from '@/lib/locale';
import { breadcrumbSchema, buildMetadata, localePath } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, buttonClassName } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCta } from '@/components/sections/FinalCta';
import { IconCheck } from '@/components/icons/NavIcons';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = assertLocale(raw);
  const t = await getTranslations({ locale, namespace: 'meta.pages.process' });
  return buildMetadata({ locale, href: '/process', title: t('title'), description: t('description') });
}

export default async function ProcessPage({
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
          { name: t('nav.process'), path: localePath('/process', locale) },
        ])}
      />

      <PageHeader
        eyebrow={t('process.eyebrow')}
        title={t('process.title')}
        lede={<p>{t('process.intro')}</p>}
        crumbs={[{ label: t('nav.process') }]}
      />

      <Section tone="limewash">
        <ol className="relative">
          {/* The spine. Hidden on mobile, where the numbers carry the sequence. */}
          <span
            aria-hidden
            className="absolute bottom-8 left-[27px] top-8 hidden w-px bg-stucco md:block"
          />

          {processStages.map((stage, index) => {
            const isSoilStudy = stage.number === 3;

            return (
              <Reveal as="li" key={stage.number} delay={Math.min(index * 30, 180)}>
                <article className="relative flex gap-5 pb-10 md:gap-8 md:pb-14">
                  <div className="relative z-10 shrink-0">
                    <span
                      className={`figure-numerals flex h-14 w-14 items-center justify-center font-display text-[19px] font-extrabold text-white ${
                        isSoilStudy ? 'bg-russet' : 'bg-slate'
                      }`}
                    >
                      {String(stage.number).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-[22px] font-bold leading-tight text-slate md:text-[26px]">
                      {stage.name[locale]}
                    </h2>

                    <p className="prose-measure mt-3 text-[16px] leading-[1.65] text-mortar md:text-[17px]">
                      {stage.what[locale]}
                    </p>

                    {isSoilStudy ? (
                      <p className="prose-measure mt-4 border-l-2 border-russet bg-stucco px-4 py-3 text-[15px] leading-[1.6] text-mortar">
                        {t('process.soilHighlight')}
                      </p>
                    ) : null}

                    <div className="mt-5 border-t border-hairline pt-4">
                      <p className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-mortar">
                        {t('process.clientSupplies')}
                      </p>
                      <ul className="mt-2.5 flex flex-wrap gap-x-6 gap-y-2">
                        {stage.clientSupplies[locale].map((item) => (
                          <li
                            key={item}
                            className="flex gap-2 text-[15px] leading-snug text-slate"
                          >
                            <IconCheck className="mt-1 h-3.5 w-3.5 shrink-0 text-russet" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ol>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className={buttonClassName('primary', undefined, false, 'lg')}>
            {t('cta.contact')}
          </Link>
          <Link href="/services" className={`${buttonClassName('text')} px-4`}>
            {t('cta.services')}
            <ArrowRight />
          </Link>
        </div>
      </Section>

      <FinalCta title={t('process.ctaTitle')} body={t('process.ctaBody')} />
    </main>
  );
}
