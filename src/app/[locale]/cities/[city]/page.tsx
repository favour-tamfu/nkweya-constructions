import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cities, cityBySlug } from '@/content/cities';
import { projects } from '@/content/projects';
import { services } from '@/content/services';
import { company } from '@/content/company';
import { assertLocale } from '@/lib/locale';
import { whatsappHref } from '@/lib/whatsapp';
import { breadcrumbSchema, buildMetadata, localePath } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, buttonClassName } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCta } from '@/components/sections/FinalCta';
import { ServiceIcon } from '@/components/icons/ServiceIcons';
import { IconCheck, IconWhatsApp } from '@/components/icons/NavIcons';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => cities.map((city) => ({ locale, city: city.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}): Promise<Metadata> {
  const { locale: raw, city: slug } = await params;
  const locale = assertLocale(raw);
  const city = cityBySlug(slug);
  if (!city) return {};

  const t = await getTranslations({ locale, namespace: 'meta.pages.cities' });
  return buildMetadata({
    locale,
    href: { pathname: '/cities/[city]', params: { city: slug } },
    title: t('titleTemplate', { city: city.name, region: city.region[locale] }),
    description: t('descriptionTemplate', { city: city.name }),
  });
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale: raw, city: slug } = await params;
  const locale = assertLocale(raw);
  setRequestLocale(locale);
  const city = cityBySlug(slug);
  if (!city) notFound();

  const t = await getTranslations();
  const here = projects.filter((project) => city.projects.includes(project.slug));
  const others = cities.filter((item) => item.slug !== city.slug);

  const wa = whatsappHref(company.whatsappPrimary, t('whatsapp.city', { city: city.name }));

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: t('nav.home'), path: localePath('/', locale) },
          {
            name: city.name,
            path: localePath({ pathname: '/cities/[city]', params: { city: slug } }, locale),
          },
        ])}
      />

      <PageHeader
        eyebrow={t('cities.eyebrow')}
        title={t('cities.titleTemplate', { city: city.name })}
        lede={<p>{city.intro[locale]}</p>}
        crumbs={[{ label: city.name }]}
      >
        <dl className="flex flex-wrap gap-x-12 gap-y-5">
          <div>
            <dt className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-dim">
              {t('cities.regionLabel')}
            </dt>
            <dd className="mt-1.5 font-display text-[19px] font-bold text-white">
              {city.region[locale]}
            </dd>
          </div>
          <div>
            <dt className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-dim">
              {t('cities.languageLabel')}
            </dt>
            <dd className="mt-1.5 font-display text-[19px] font-bold text-white">
              {city.primaryLanguage === 'fr' ? 'Français' : 'English'}
            </dd>
          </div>
        </dl>
      </PageHeader>

      {/* ---------------------------------------------------------------- */}
      {/* What shapes a build here                                          */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="limewash" labelledBy="conditions-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading id="conditions-heading" title={t('cities.conditionsTitle')} />
            <ul className="mt-6 space-y-4">
              {city.conditions[locale].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-b border-hairline pb-4 text-[16px] leading-[1.6] text-mortar md:text-[17px]"
                >
                  <IconCheck className="mt-1.5 h-4 w-4 shrink-0 text-russet" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="border-l-2 border-russet bg-card p-6">
              <h2 className="font-display text-[19px] font-bold text-slate md:text-[21px]">
                {t('cities.projectsHere')}
              </h2>
              {here.length > 0 ? (
                <ul className="mt-4">
                  {here.map((project) => (
                    <li key={project.slug}>
                      <Link
                        href={{ pathname: '/projects/[slug]', params: { slug: project.slug } }}
                        className="flex items-baseline justify-between gap-4 border-b border-hairline py-3 no-underline transition-colors hover:text-russet"
                      >
                        <span className="font-display text-[17px] font-bold text-slate">
                          {project.title}
                        </span>
                        <span className="font-body text-[13px] text-mortar">
                          {t(`projects.types.${project.type}`)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-[15px] leading-[1.6] text-mortar">
                  {t('cities.noProjectsHere')}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClassName('whatsapp', undefined, true)}
                >
                  <IconWhatsApp className="h-5 w-5" />
                  {t('cta.whatsapp')}
                </a>
                <Link href="/contact" className={buttonClassName('outline', undefined, true)}>
                  {t('cta.contact')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Services offered here                                             */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="stucco" labelledBy="services-here-heading">
        <SectionHeading id="services-here-heading" title={t('cities.servicesHere')} />
        <ul className="mt-8 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-5">
          {services.map((service, index) => (
            <Reveal as="li" key={service.slug} delay={index * 50} className="bg-card">
              <Link
                href={{ pathname: '/services/[slug]', params: { slug: service.slug } }}
                className="flex h-full flex-col p-5 no-underline transition-colors hover:bg-limewash"
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
      {/* The other cities                                                  */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="slate" labelledBy="other-cities-heading">
        <SectionHeading id="other-cities-heading" title={t('cities.otherCities')} onDark />
        <ul className="mt-8 grid gap-px bg-rule-dark sm:grid-cols-2 lg:grid-cols-4">
          {others.map((item) => (
            <li key={item.slug} className="bg-slate-800">
              <Link
                href={{ pathname: '/cities/[city]', params: { city: item.slug } }}
                className="flex h-full flex-col p-5 no-underline transition-colors hover:bg-slate"
              >
                <h3 className="font-display text-[20px] font-bold text-white">{item.name}</h3>
                <p className="mt-1 flex-1 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-iroko">
                  {item.region[locale]}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 font-body text-[13px] font-semibold text-iroko">
                  {t('cta.readMore')}
                  <ArrowRight />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta
        title={t('cities.ctaTitle', { city: city.name })}
        body={t('cities.ctaBody')}
        whatsappMessage={t('whatsapp.city', { city: city.name })}
      />
    </main>
  );
}
