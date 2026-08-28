import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { company } from '@/content/company';
import { cities } from '@/content/cities';
import { services } from '@/content/services';
import { siteWork } from '@/content/site-work';
import { processStages } from '@/content/process';
import { assertLocale } from '@/lib/locale';
import { whatsappHref } from '@/lib/whatsapp';
import { breadcrumbSchema, buildMetadata, localePath } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, buttonClassName } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ResponsiveImage } from '@/components/media/ResponsiveImage';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCta } from '@/components/sections/FinalCta';
import { ServiceIcon } from '@/components/icons/ServiceIcons';
import { IconWhatsApp } from '@/components/icons/NavIcons';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = assertLocale(raw);
  const t = await getTranslations({ locale, namespace: 'meta.pages.about' });
  return buildMetadata({ locale, href: '/about', title: t('title'), description: t('description') });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = assertLocale(raw);
  setRequestLocale(locale);
  const t = await getTranslations();
  const wa = whatsappHref(company.whatsappPrimary, t('whatsapp.default'));

  // The cube-test frame: quality control, which is what this section is about.
  const evidence = siteWork.find((item) => item.slug === 'concrete-cube-compression-test');
  // Soil investigation, design, structure, handover — the sequence described.
  const capabilityStages = processStages.filter((stage) => [3, 4, 8, 11].includes(stage.number));

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: t('nav.home'), path: localePath('/', locale) },
          { name: t('nav.about'), path: localePath('/about', locale) },
        ])}
      />

      <PageHeader
        eyebrow={t('about.eyebrow')}
        title={t('about.title')}
        lede={<p>{t('about.lede')}</p>}
        crumbs={[{ label: t('nav.about') }]}
      />

      {/* ---------------------------------------------------------------- */}
      {/* The engineer. Portrait frame stays until the photograph arrives.  */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="limewash" labelledBy="engineer-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <div
              className="flex items-center justify-center border border-hairline bg-card"
              style={{ aspectRatio: '4 / 5' }}
            >
              <div className="flex max-w-[24ch] flex-col items-center gap-3 px-6 text-center">
                <svg
                  viewBox="0 0 24 24"
                  className="h-12 w-12 text-stucco"
                  aria-hidden
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.1"
                >
                  <circle cx="12" cy="8.5" r="4" />
                  <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
                </svg>
                <p className="font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-mortar">
                  {t('about.portraitPending')}
                </p>
              </div>
            </div>

            <ul className="mt-px grid gap-px bg-hairline">
              {company.principal.qualifications[locale].map((item) => (
                <li key={item} className="bg-card p-4 text-[15px] leading-snug text-slate">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-8">
            <p className="font-body text-[11px] font-semibold uppercase leading-none tracking-[0.22em] text-russet">
              {t('about.engineerRole')}
            </p>
            <h2
              id="engineer-heading"
              className="mt-4 font-display text-[30px] font-extrabold leading-[1.08] tracking-[-0.01em] text-slate md:text-[40px]"
            >
              {t('about.engineerTitle')}
            </h2>
            <div className="prose-measure mt-6 space-y-5 text-[16px] leading-[1.65] text-mortar md:text-[17px]">
              <p>{t('about.engineerBio')}</p>
              <p>{t('about.engineerBioTwo')}</p>
            </div>

            <h3 className="mt-10 font-display text-[22px] font-bold text-slate md:text-[26px]">
              {t('about.positioningTitle')}
            </h3>
            <p className="prose-measure mt-4 text-[16px] leading-[1.65] text-mortar md:text-[17px]">
              {t('about.positioningBody')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClassName('whatsapp', undefined, false, 'lg')}
              >
                <IconWhatsApp className="h-5 w-5" />
                {t('cta.whatsapp')}
              </a>
              <Link href="/contact" className={buttonClassName('outline', undefined, false, 'lg')}>
                {t('cta.contact')}
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* How we work                                                       */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="slate" labelledBy="capability-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
          <div className="lg:col-span-7">
            <SectionHeading
              id="capability-heading"
              title={t('about.capabilityTitle')}
              body={t('about.capabilityBody')}
              onDark
            />

            {/* The stages this actually shows up as, so the band carries its height. */}
            <ol className="mt-8 grid gap-px bg-rule-dark sm:grid-cols-2">
              {capabilityStages.map((stage) => (
                <li key={stage.number} className="flex gap-4 bg-slate-800 p-4">
                  <span className="figure-numerals w-7 shrink-0 font-display text-[18px] font-extrabold text-iroko">
                    {String(stage.number).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block font-display text-[16px] font-bold text-white">
                      {stage.name[locale]}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-[14px] leading-snug text-ash">
                      {stage.what[locale]}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            <Link
              href="/process"
              className={`${buttonClassName('text')} mt-6 text-iroko hover:text-white`}
            >
              {t('cta.process')}
              <ArrowRight />
            </Link>
          </div>

          {evidence ? (
            <figure className="m-0 lg:col-span-5">
              {/*
                Portrait source, shown portrait. Cropping it to a landscape band
                cut the machine in half and gained nothing.
              */}
              <ResponsiveImage
                slug={evidence.imageSlug}
                alt={evidence.title[locale]}
                sizes="(min-width: 1024px) 38vw, 92vw"
                aspect="3 / 4"
              />
              <figcaption className="mt-3 text-[14px] leading-snug text-ash">
                {evidence.caption[locale]}
              </figcaption>
            </figure>
          ) : null}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* What we offer                                                     */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="limewash" labelledBy="services-heading">
        <SectionHeading id="services-heading" title={t('about.servicesTitle')} />
        <ul className="mt-8 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-5">
          {services.map((service, index) => (
            <Reveal as="li" key={service.slug} delay={index * 50} className="bg-card">
              <Link
                href={{ pathname: '/services/[slug]', params: { slug: service.slug } }}
                className="flex h-full flex-col p-5 no-underline transition-colors hover:bg-stucco"
              >
                <ServiceIcon name={service.icon} className="h-7 w-7 text-russet" />
                <h3 className="mt-4 flex-1 font-display text-[17px] font-bold leading-snug text-slate">
                  {service.name[locale]}
                </h3>
                <span className="mt-4 inline-flex items-center gap-2 font-body text-[13px] font-semibold text-russet">
                  {t('cta.readMore')}
                  <ArrowRight />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Where we work                                                     */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="stucco" labelledBy="coverage-heading">
        <SectionHeading
          id="coverage-heading"
          title={t('about.coverageTitle')}
          body={t('about.coverageBody')}
        />
        <ul className="mt-8 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-5">
          {cities.map((city, index) => (
            <Reveal as="li" key={city.slug} delay={index * 50} className="bg-card">
              <Link
                href={{ pathname: '/cities/[city]', params: { city: city.slug } }}
                className="flex h-full flex-col p-5 no-underline transition-colors hover:bg-limewash"
              >
                <h3 className="font-display text-[21px] font-bold text-slate">{city.name}</h3>
                <p className="mt-1 flex-1 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-russet">
                  {city.region[locale]}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 font-body text-[13px] font-semibold text-russet">
                  {t('cta.readMore')}
                  <ArrowRight />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <FinalCta title={t('about.ctaTitle')} body={t('about.ctaBody')} />
    </main>
  );
}
