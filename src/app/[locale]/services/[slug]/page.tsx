import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { services, serviceBySlug } from '@/content/services';
import { projects } from '@/content/projects';
import { siteWork } from '@/content/site-work';
import { company } from '@/content/company';
import { assertLocale } from '@/lib/locale';
import { whatsappHref } from '@/lib/whatsapp';
import { breadcrumbSchema, buildMetadata, faqSchema, localePath, serviceSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, buttonClassName } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ResponsiveImage } from '@/components/media/ResponsiveImage';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCta } from '@/components/sections/FinalCta';
import { Disclosure } from '@/components/ui/Disclosure';
import { ServiceIcon } from '@/components/icons/ServiceIcons';
import { IconCheck, IconExcluded, IconWhatsApp } from '@/components/icons/NavIcons';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services.map((service) => ({ locale, slug: service.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = assertLocale(raw);
  const service = serviceBySlug(slug);
  if (!service) return {};

  return buildMetadata({
    locale,
    href: { pathname: '/services/[slug]', params: { slug } },
    title: `${service.name[locale]} — Nkweya & Sons Constructions`,
    description: service.summary[locale],
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = assertLocale(raw);
  setRequestLocale(locale);
  const service = serviceBySlug(slug);
  if (!service) notFound();

  const t = await getTranslations();
  const others = services.filter((item) => item.slug !== service.slug);
  const related = projects.filter((project) => service.relatedProjects.includes(project.slug));
  const evidence = siteWork.filter((item) => item.service === service.slug);

  const includes = service.includes[locale];
  const excludes = service.excludes[locale];

  const wa = whatsappHref(
    company.whatsappPrimary,
    t('whatsapp.service', { service: service.name[locale] }),
  );

  const path = localePath({ pathname: '/services/[slug]', params: { slug } }, locale);

  return (
    <main>
      <JsonLd
        data={[
          serviceSchema({
            name: service.name[locale],
            description: service.summary[locale],
            path,
          }),
          breadcrumbSchema([
            { name: t('nav.home'), path: localePath('/', locale) },
            { name: t('nav.services'), path: localePath('/services', locale) },
            { name: service.name[locale], path },
          ]),
          ...(faqSchema(service.faqs.map((faq) => ({ q: faq.q[locale], a: faq.a[locale] })))
            ? [faqSchema(service.faqs.map((faq) => ({ q: faq.q[locale], a: faq.a[locale] })))!]
            : []),
        ]}
      />

      <PageHeader
        eyebrow={t('services.eyebrow')}
        title={service.name[locale]}
        lede={<p>{service.summary[locale]}</p>}
        crumbs={[
          { label: t('nav.services'), href: '/services' },
          { label: service.name[locale] },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/contact" className={buttonClassName('primary', undefined, false, 'lg')}>
            {t('cta.contact')}
          </Link>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClassName('secondary', undefined, false, 'lg')}
          >
            <IconWhatsApp className="h-5 w-5" />
            {t('services.detailCta')}
          </a>
        </div>
      </PageHeader>

      {/* -------------------------------------------------------------- */}
      {/* Included / excluded. No competitor publishes the second column. */}
      {/* -------------------------------------------------------------- */}
      <Section tone="limewash">
        <div className="grid gap-px bg-hairline md:grid-cols-2">
          <div className="bg-card p-6 md:p-8">
            <h2 className="font-display text-[21px] font-bold text-slate md:text-[24px]">
              {t('services.includes')}
            </h2>
            <ul className="mt-6 space-y-3.5">
              {includes.map((item) => (
                <li key={item} className="flex gap-3 text-[16px] leading-[1.55] text-slate">
                  <IconCheck className="mt-1.5 h-4 w-4 shrink-0 text-russet" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card p-6 md:p-8">
            <h2 className="font-display text-[21px] font-bold text-slate md:text-[24px]">
              {t('services.excludes')}
            </h2>
            <p className="mt-2 text-[14px] leading-snug text-mortar">{t('services.excludesNote')}</p>
            <ul className="mt-6 space-y-3.5">
              {excludes.map((item) => (
                <li key={item} className="flex gap-3 text-[16px] leading-[1.55] text-mortar">
                  <IconExcluded className="mt-1.5 h-4 w-4 shrink-0 text-dim" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </Section>

      {/* -------------------------------------------------------------- */}
      {/* Evidence from the client's own site footage, where it applies.  */}
      {/* -------------------------------------------------------------- */}
      {evidence.length > 0 ? (
        <Section tone="stucco">
          <SectionHeading
            eyebrow={t('siteWork.eyebrow')}
            title={t('siteWork.relatedService')}
            body={service.name[locale]}
          />
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {evidence.map((item, index) => (
              <Reveal as="li" key={item.slug} delay={index * 70}>
                <ResponsiveImage
                  slug={item.imageSlug}
                  alt={item.title[locale]}
                  sizes="(min-width: 640px) 45vw, 92vw"
                  aspect="4 / 3"
                />
                <h3 className="mt-4 font-display text-[18px] font-bold text-slate">
                  {item.title[locale]}
                </h3>
                <p className="mt-2 text-[15px] leading-[1.55] text-mortar">{item.caption[locale]}</p>
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* -------------------------------------------------------------- */}
      {/* FAQs — also emitted as FAQPage structured data.                 */}
      {/* -------------------------------------------------------------- */}
      {service.faqs.length > 0 ? (
        <Section tone={evidence.length > 0 ? 'limewash' : 'stucco'}>
          <SectionHeading title={t('services.faqs')} />
          <div className="mt-8 max-w-[80ch]">
            {service.faqs.map((faq, index) => (
              <Disclosure key={index} summary={faq.q[locale]}>
                <p>{faq.a[locale]}</p>
              </Disclosure>
            ))}
          </div>
        </Section>
      ) : null}

      {/* -------------------------------------------------------------- */}
      {/* Related buildings.                                              */}
      {/* -------------------------------------------------------------- */}
      {related.length > 0 ? (
        <Section tone="limewash">
          <SectionHeading title={t('services.relatedProjects')} />
          <ul className="mt-8 grid gap-px bg-hairline sm:grid-cols-2">
            {related.map((project) => (
              <li key={project.slug} className="bg-card">
                <Link
                  href={{ pathname: '/projects/[slug]', params: { slug: project.slug } }}
                  className="flex h-full flex-col p-6 no-underline transition-colors hover:bg-stucco"
                >
                  <h3 className="font-display text-[20px] font-bold text-slate">{project.title}</h3>
                  <p className="mt-1 flex-1 text-[14px] text-mortar">
                    {t(`projects.types.${project.type}`)} · {project.region[locale]}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 font-body text-[14px] font-semibold text-russet">
                    {t('cta.readMore')}
                    <ArrowRight />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* -------------------------------------------------------------- */}
      {/* The other four services.                                        */}
      {/* -------------------------------------------------------------- */}
      <Section tone="slate">
        <SectionHeading title={t('services.otherServices')} onDark />
        <ul className="mt-8 grid gap-px bg-rule-dark sm:grid-cols-2 lg:grid-cols-4">
          {others.map((item) => (
            <li key={item.slug} className="bg-slate-800">
              <Link
                href={{ pathname: '/services/[slug]', params: { slug: item.slug } }}
                className="flex h-full flex-col p-5 no-underline transition-colors hover:bg-slate"
              >
                <ServiceIcon name={item.icon} className="h-7 w-7 text-iroko" />
                <h3 className="mt-4 flex-1 font-display text-[17px] font-bold leading-snug text-white">
                  {item.name[locale]}
                </h3>
                <span className="mt-4 inline-flex items-center gap-2 font-body text-[13px] font-semibold text-iroko">
                  {t('cta.readMore')}
                  <ArrowRight />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta whatsappMessage={t('whatsapp.service', { service: service.name[locale] })} />
    </main>
  );
}
