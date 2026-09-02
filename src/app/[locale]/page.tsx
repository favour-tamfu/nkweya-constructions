import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { company } from '@/content/company';
import { services } from '@/content/services';
import { designs } from '@/content/designs';
import { projects } from '@/content/projects';
import { siteWork } from '@/content/site-work';
import { processStages } from '@/content/process';
import { cities } from '@/content/cities';
import { assertLocale } from '@/lib/locale';
import { whatsappHref } from '@/lib/whatsapp';
import { buildMetadata } from '@/lib/seo';
import { buttonClassName, ArrowRight } from '@/components/ui/Button';
import { Section, SectionHeading, Eyebrow } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ResponsiveImage } from '@/components/media/ResponsiveImage';
import { RenderNotice } from '@/components/media/RenderNotice';
import { ServiceIcon } from '@/components/icons/ServiceIcons';
import { IconArrowDown, IconWhatsApp } from '@/components/icons/NavIcons';
import { TrustBar } from '@/components/sections/TrustBar';
import { FinalCta } from '@/components/sections/FinalCta';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = assertLocale(raw);
  const t = await getTranslations({ locale, namespace: 'meta' });
  return buildMetadata({
    locale,
    href: '/',
    title: t('homeTitle'),
    description: t('homeDescription'),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = assertLocale(raw);
  setRequestLocale(locale);
  const t = await getTranslations();
  const wa = whatsappHref(company.whatsappPrimary, t('whatsapp.default'));

  const hero = designs[0]?.images[0];
  const featuredDesigns = designs.slice(0, 3);
  const previewStages = processStages.slice(0, 4);
  const evidence = siteWork.slice(0, 3);

  return (
    <main>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative isolate bg-slate text-white">
        {hero ? (
          <div className="absolute inset-0">
            <ResponsiveImage
              slug={hero.src}
              alt={hero.alt[locale]}
              sizes="100vw"
              priority
              aspect="auto"
              className="h-full w-full bg-slate"
              imgClassName="opacity-45"
              objectPosition="center 55%"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, rgba(43,53,58,0.93) 0%, rgba(43,53,58,0.78) 48%, rgba(43,53,58,0.48) 100%)',
              }}
            />
          </div>
        ) : null}

        <div className="relative mx-auto flex min-h-[76svh] max-w-[1440px] flex-col justify-end gap-6 px-[18px] pb-12 pt-16 md:min-h-[80svh] md:px-14 md:pb-16 md:pt-28">
          {hero ? (
            <RenderNotice
              label={t('render.label')}
              className="left-[18px] top-4 md:left-14 md:top-6"
            />
          ) : null}

          <Eyebrow onDark>{t('home.eyebrow')}</Eyebrow>

          <h1 className="max-w-[15ch] font-display text-[34px] font-extrabold leading-[1.04] tracking-[-0.02em] text-white sm:text-[42px] md:text-[56px] lg:text-[64px]">
            {t('meta.tagline')}
          </h1>

          <p className="max-w-[46ch] text-[17px] leading-[1.6] text-ash md:text-[19px]">
            {t('meta.heroSubline')}
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/contact" className={buttonClassName('primary', undefined, false, 'lg')}>
              {t('cta.talk')}
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName('whatsapp', undefined, false, 'lg')}
            >
              <IconWhatsApp className="h-5 w-5" />
              {t('cta.whatsapp')}
            </a>
          </div>

          <a
            href="#services"
            className="group mt-6 hidden items-center gap-2 self-start font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-dim no-underline transition-colors hover:text-iroko md:inline-flex"
          >
            {t('home.heroScroll')}
            <IconArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
          </a>
        </div>
      </section>

      <TrustBar />

      {/* ---------------------------------------------------------------- */}
      {/* Who we build for                                                  */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="limewash">
        <Eyebrow>{t('home.audienceEyebrow')}</Eyebrow>
        <div className="mt-8 grid gap-px bg-hairline md:grid-cols-2">
          <Reveal className="bg-limewash">
            <div className="flex h-full flex-col p-6 md:p-8">
              <h2 className="font-display text-[24px] font-bold leading-tight md:text-[28px]">
                {t('home.audienceCommercial')}
              </h2>
              <p className="mt-4 max-w-[46ch] flex-1 text-mortar">
                {t('home.audienceCommercialBody')}
              </p>
              <Link
                href={{ pathname: '/services/[slug]', params: { slug: 'commercial-construction' } }}
                className={`${buttonClassName('text')} mt-6 self-start`}
              >
                {t('cta.services')}
                <ArrowRight />
              </Link>
            </div>
          </Reveal>
          <Reveal className="bg-limewash" delay={80}>
            <div className="flex h-full flex-col p-6 md:p-8">
              <h2 className="font-display text-[24px] font-bold leading-tight md:text-[28px]">
                {t('home.audienceResidential')}
              </h2>
              <p className="mt-4 max-w-[46ch] flex-1 text-mortar">
                {t('home.audienceResidentialBody')}
              </p>
              <Link href="/process" className={`${buttonClassName('text')} mt-6 self-start`}>
                {t('cta.process')}
                <ArrowRight />
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Services                                                          */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="stucco" id="services" labelledBy="services-heading">
        <SectionHeading
          id="services-heading"
          eyebrow={t('home.servicesEyebrow')}
          title={t('home.servicesTitle')}
          body={t('home.servicesBody')}
        />
        <ul className="mt-10 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal as="li" key={service.slug} delay={Math.min(index * 60, 240)} className="bg-card">
              <Link
                href={{ pathname: '/services/[slug]', params: { slug: service.slug } }}
                className="group flex h-full flex-col p-6 no-underline transition-colors duration-200 hover:bg-limewash md:p-7"
              >
                <ServiceIcon name={service.icon} className="h-8 w-8 text-russet" />
                <h3 className="mt-5 font-display text-[19px] font-bold leading-snug text-slate md:text-[21px]">
                  {service.name[locale]}
                </h3>
                <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-mortar">
                  {service.summary[locale]}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 font-body text-[14px] font-semibold text-russet">
                  {t('cta.readMore')}
                  <ArrowRight />
                </span>
              </Link>
            </Reveal>
          ))}
          <li className="hidden bg-slate lg:block">
            <div className="flex h-full flex-col justify-between p-6 md:p-7">
              <p className="font-display text-[19px] font-bold leading-snug text-white md:text-[21px]">
                {t('home.processTitle')}
              </p>
              <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-ash">
                {t('home.processBody')}
              </p>
              <Link href="/process" className={`${buttonClassName('secondary')} mt-6 self-start`}>
                {t('cta.process')}
              </Link>
            </div>
          </li>
        </ul>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Work in progress — the site footage.                              */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="limewash" labelledBy="work-heading">
        <SectionHeading
          id="work-heading"
          eyebrow={t('home.workEyebrow')}
          title={t('home.workTitle')}
          body={t('home.workBody')}
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {evidence.map((item, index) => (
            <Reveal as="li" key={item.slug} delay={Math.min(index * 70, 210)}>
              <Link href="/projects" className="group block no-underline">
                <ResponsiveImage
                  slug={item.imageSlug}
                  alt={item.title[locale]}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                  aspect="4 / 5"
                  className="transition-opacity duration-200 group-hover:opacity-90"
                />
                <h3 className="mt-4 font-display text-[18px] font-bold leading-snug text-slate">
                  {item.title[locale]}
                </h3>
                <p className="mt-2 line-clamp-3 text-[15px] leading-[1.55] text-mortar">
                  {item.caption[locale]}
                </p>
              </Link>
            </Reveal>
          ))}
        </ul>
        <Link href="/projects" className={`${buttonClassName('text')} mt-8`}>
          {t('cta.projects')}
          <ArrowRight />
        </Link>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Completed buildings                                               */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="slate" labelledBy="projects-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              id="projects-heading"
              eyebrow={t('home.projectsEyebrow')}
              title={t('home.projectsTitle')}
              body={t('home.projectsBody')}
              onDark
            />
            <Link
              href="/projects"
              className={`${buttonClassName('text')} mt-6 text-iroko hover:text-white`}
            >
              {t('cta.projects')}
              <ArrowRight />
            </Link>
          </div>
          <ul className="grid gap-px bg-rule-dark lg:col-span-7">
            {projects.map((project) => (
              <li key={project.slug} className="bg-slate-800">
                <Link
                  href={{ pathname: '/projects/[slug]', params: { slug: project.slug } }}
                  className="flex flex-col no-underline transition-colors hover:bg-slate"
                >
                  {project.images[0] ? (
                    <ResponsiveImage
                      slug={project.images[0].src}
                      alt={project.images[0].alt[locale]}
                      sizes="(min-width: 1024px) 56vw, 92vw"
                      aspect="16 / 9"
                    />
                  ) : null}
                  <span className="flex flex-col gap-3 p-6 md:p-7">
                  <span className="flex flex-wrap items-baseline justify-between gap-3">
                    <span className="font-display text-[20px] font-bold text-white md:text-[22px]">
                      {project.title}
                    </span>
                    <span className="inline-flex items-center gap-2 font-body text-[14px] font-semibold text-iroko">
                      {project.city.charAt(0).toUpperCase() + project.city.slice(1)}
                      <ArrowRight />
                    </span>
                  </span>
                  <span className="block text-[15px] leading-[1.55] text-ash">
                    {project.summary[locale]}
                  </span>
                  <span className="font-body text-[12px] uppercase tracking-[0.14em] text-dim">
                    {t(`projects.types.${project.type}`)}
                    {project.sector ? ` · ${t(`projects.sectors.${project.sector}`)}` : ''} ·{' '}
                    {project.region[locale]}
                  </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Design visualisations                                             */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="stucco" labelledBy="designs-heading">
        <SectionHeading
          id="designs-heading"
          eyebrow={t('home.designsEyebrow')}
          title={t('home.designsTitle')}
          body={t('home.designsBody')}
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDesigns.map((design, index) => {
            const cover = design.images[0];
            if (!cover) return null;
            return (
              <Reveal as="li" key={design.slug} delay={Math.min(index * 70, 210)}>
                <Link href="/designs" className="group block no-underline">
                  <div className="relative">
                    <ResponsiveImage
                      slug={cover.src}
                      alt={cover.alt[locale]}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                      aspect="16 / 10"
                      className="transition-opacity duration-200 group-hover:opacity-90"
                    />
                    <RenderNotice label={t('render.label')} />
                  </div>
                  <h3 className="mt-4 font-display text-[18px] font-bold leading-snug text-slate">
                    {design.title[locale]}
                  </h3>
                  <p className="mt-1 text-[14px] text-mortar">{design.buildingType[locale]}</p>
                </Link>
              </Reveal>
            );
          })}
        </ul>
        <Link href="/designs" className={`${buttonClassName('text')} mt-8`}>
          {t('cta.designs')}
          <ArrowRight />
        </Link>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* The engineer, with a preview of the process.                      */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="limewash" labelledBy="engineer-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow>{t('home.engineerEyebrow')}</Eyebrow>
            <h2
              id="engineer-heading"
              className="mt-3 font-display text-[30px] font-extrabold leading-[1.1] tracking-[-0.01em] text-slate md:text-[40px]"
            >
              {company.principal.name}
            </h2>
            <p className="mt-2 font-body text-[13px] font-semibold uppercase tracking-[0.16em] text-russet">
              {company.principal.role[locale]}
            </p>
            <p className="prose-measure mt-6 text-mortar">{t('home.engineerBody')}</p>
            <ul className="mt-8 grid gap-px bg-hairline sm:grid-cols-3">
              {company.principal.qualifications[locale].map((item) => (
                <li key={item} className="bg-card p-4 text-[15px] leading-snug text-slate">
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/about" className={`${buttonClassName('outline')} mt-8`}>
              {t('cta.engineer')}
            </Link>
          </div>
          <div className="lg:col-span-5">
            <ul className="grid gap-px bg-hairline">
              {previewStages.map((stage) => (
                <li key={stage.number} className="flex gap-5 bg-card p-5">
                  <span className="figure-numerals w-8 shrink-0 font-display text-[22px] font-extrabold text-stucco">
                    {String(stage.number).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block font-display text-[17px] font-bold text-slate">
                      {stage.name[locale]}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-[14px] leading-snug text-mortar">
                      {stage.what[locale]}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/process" className={`${buttonClassName('text')} mt-4`}>
              {t('cta.process')}
              <ArrowRight />
            </Link>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Where we build                                                    */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="stucco" labelledBy="cities-heading">
        <SectionHeading
          id="cities-heading"
          eyebrow={t('home.citiesEyebrow')}
          title={t('home.citiesTitle')}
          body={t('home.citiesBody')}
        />
        <ul className="mt-10 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-5">
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

      <FinalCta />
    </main>
  );
}
