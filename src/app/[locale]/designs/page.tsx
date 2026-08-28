import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { designs } from '@/content/designs';
import { assertLocale } from '@/lib/locale';
import { breadcrumbSchema, buildMetadata, localePath } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { RenderNoticeBanner } from '@/components/media/RenderNotice';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCta } from '@/components/sections/FinalCta';
import { DesignGallery } from '@/components/sections/DesignGallery';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = assertLocale(raw);
  const t = await getTranslations({ locale, namespace: 'meta.pages.designs' });
  return buildMetadata({ locale, href: '/designs', title: t('title'), description: t('description') });
}

export default async function DesignsPage({
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
          { name: t('nav.designs'), path: localePath('/designs', locale) },
        ])}
      />

      <PageHeader
        eyebrow={t('designs.eyebrow')}
        title={t('designs.title')}
        lede={<p>{t('designs.intro')}</p>}
        crumbs={[{ label: t('nav.designs') }]}
      />

      <Section tone="limewash">
        <RenderNoticeBanner label={t('render.label')} explain={t('render.explain')} />

        <div className="mt-12 space-y-16 md:space-y-24">
          {designs.map((design, index) => (
            <Reveal key={design.slug} delay={index === 0 ? 0 : 60}>
              <article>
                <div className="grid gap-6 md:grid-cols-12 md:gap-10">
                  <div className="md:col-span-4">
                    <h2 className="font-display text-[24px] font-bold leading-tight text-slate md:text-[28px]">
                      {design.title[locale]}
                    </h2>
                    <dl className="mt-5 space-y-3">
                      <div>
                        <dt className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-mortar">
                          {t('designs.buildingType')}
                        </dt>
                        <dd className="mt-1 text-[15px] text-slate">{design.buildingType[locale]}</dd>
                      </div>
                      {design.storeys ? (
                        <div>
                          <dt className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-mortar">
                            {t('designs.storeys')}
                          </dt>
                          <dd className="figure-numerals mt-1 text-[15px] text-slate">
                            {design.storeys}
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                    <div className="mt-6 border-l-2 border-stucco pl-4">
                      <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-mortar">
                        {t('designs.note')}
                      </p>
                      <p className="mt-2 text-[15px] leading-[1.6] text-mortar">
                        {design.note[locale]}
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-8">
                    <DesignGallery
                      images={design.images.map((media) => ({
                        slug: media.src,
                        alt: media.alt[locale],
                        caption: media.caption?.[locale],
                      }))}
                      renderLabel={t('render.label')}
                      viewLargerLabel={t('designs.viewLarger')}
                      closeLabel={t('designs.closeViewer')}
                      previousLabel={t('designs.previousImage')}
                      nextLabel={t('designs.nextImage')}
                      counterTemplate={t('designs.imageCounter', { current: '{current}', total: '{total}' })}
                      priority={index === 0}
                    />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCta title={t('designs.ctaTitle')} body={t('designs.ctaBody')} />
    </main>
  );
}
