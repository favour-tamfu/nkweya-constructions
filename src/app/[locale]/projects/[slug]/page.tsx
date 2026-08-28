import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { projects, projectBySlug } from '@/content/projects';
import { cityBySlug } from '@/content/cities';
import { company } from '@/content/company';
import { assertLocale } from '@/lib/locale';
import { whatsappHref } from '@/lib/whatsapp';
import { breadcrumbSchema, buildMetadata, localePath } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, buttonClassName } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ResponsiveImage } from '@/components/media/ResponsiveImage';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCta } from '@/components/sections/FinalCta';
import { IconCheck, IconWhatsApp } from '@/components/icons/NavIcons';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = assertLocale(raw);
  const project = projectBySlug(slug);
  if (!project) return {};

  const cityName = project.city.charAt(0).toUpperCase() + project.city.slice(1);
  return buildMetadata({
    locale,
    href: { pathname: '/projects/[slug]', params: { slug } },
    title: `${project.title}, ${cityName} — Nkweya & Sons Constructions`,
    description: project.summary[locale],
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = assertLocale(raw);
  setRequestLocale(locale);
  const project = projectBySlug(slug);
  if (!project) notFound();

  const t = await getTranslations();
  const city = cityBySlug(project.city);
  const cityName = project.city.charAt(0).toUpperCase() + project.city.slice(1);
  const others = projects.filter((item) => item.slug !== project.slug);

  const wa = whatsappHref(
    company.whatsappPrimary,
    t('whatsapp.project', { project: project.title }),
  );

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: t('nav.home'), path: localePath('/', locale) },
          { name: t('nav.projects'), path: localePath('/projects', locale) },
          {
            name: project.title,
            path: localePath({ pathname: '/projects/[slug]', params: { slug } }, locale),
          },
        ])}
      />

      <PageHeader
        eyebrow={t('projects.eyebrow')}
        title={project.title}
        lede={<p>{project.summary[locale]}</p>}
        crumbs={[{ label: t('nav.projects'), href: '/projects' }, { label: project.title }]}
      >
        <dl className="grid gap-px bg-rule-dark sm:grid-cols-3">
          <div className="bg-slate-800 p-4">
            <dt className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-dim">
              {t('projects.city')}
            </dt>
            <dd className="mt-1.5 font-display text-[17px] font-bold text-white">{cityName}</dd>
          </div>
          <div className="bg-slate-800 p-4">
            <dt className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-dim">
              {t('projects.region')}
            </dt>
            <dd className="mt-1.5 font-display text-[17px] font-bold text-white">
              {project.region[locale]}
            </dd>
          </div>
          <div className="bg-slate-800 p-4">
            <dt className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-dim">
              {project.sector ? t('projects.sector') : t('projects.filterType')}
            </dt>
            <dd className="mt-1.5 font-display text-[17px] font-bold text-white">
              {project.sector
                ? t(`projects.sectors.${project.sector}`)
                : t(`projects.types.${project.type}`)}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Section tone="limewash">
        {project.images.length > 0 ? (
          <ul className="mb-12 grid gap-6 sm:grid-cols-2">
            {project.images.map((media) => (
              <li key={media.src}>
                <figure className="m-0">
                  <ResponsiveImage
                    slug={media.src}
                    alt={media.alt[locale]}
                    sizes="(min-width: 640px) 46vw, 92vw"
                  />
                  {media.caption ? (
                    <figcaption className="mt-3 text-[15px] text-mortar">
                      {media.caption[locale]}
                    </figcaption>
                  ) : null}
                </figure>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[24px] font-bold text-slate md:text-[28px]">
              {t('projects.scope')}
            </h2>
            <ul className="mt-5 space-y-3">
              {project.scope[locale].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-b border-hairline pb-3 text-[16px] text-slate"
                >
                  <IconCheck className="mt-1.5 h-4 w-4 shrink-0 text-russet" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-5">
            {city ? (
              <div className="border-l-2 border-russet bg-card p-6">
                <h2 className="font-display text-[19px] font-bold text-slate md:text-[21px]">
                  {t('cities.titleTemplate', { city: city.name })}
                </h2>
                <p className="mt-3 text-[15px] leading-[1.6] text-mortar">{city.intro[locale]}</p>
                <Link
                  href={{ pathname: '/cities/[city]', params: { city: project.city } }}
                  className={`${buttonClassName('text')} mt-4`}
                >
                  {t('cta.readMore')}
                  <ArrowRight />
                </Link>
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3">
              <Link href="/contact" className={buttonClassName('primary', undefined, true)}>
                {t('cta.contact')}
              </Link>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClassName('outline', undefined, true)}
              >
                <IconWhatsApp className="h-5 w-5" />
                {t('cta.whatsapp')}
              </a>
            </div>
          </aside>
        </div>
      </Section>

      {others.length > 0 ? (
        <Section tone="stucco">
          <SectionHeading title={t('projects.completedTitle')} />
          <ul className="mt-8 grid gap-px bg-hairline sm:grid-cols-2">
            {others.map((item) => (
              <li key={item.slug} className="bg-card">
                <Link
                  href={{ pathname: '/projects/[slug]', params: { slug: item.slug } }}
                  className="flex h-full flex-col p-6 no-underline transition-colors hover:bg-limewash"
                >
                  <h3 className="font-display text-[20px] font-bold text-slate">{item.title}</h3>
                  <p className="mt-2 flex-1 text-[15px] leading-[1.6] text-mortar">
                    {item.summary[locale]}
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

      <FinalCta whatsappMessage={t('whatsapp.project', { project: project.title })} />
    </main>
  );
}
