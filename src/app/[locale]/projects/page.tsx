import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { projects } from '@/content/projects';
import { siteWork } from '@/content/site-work';
import { serviceBySlug } from '@/content/services';
import { assertLocale } from '@/lib/locale';
import { breadcrumbSchema, buildMetadata, localePath } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, buttonClassName } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SiteVideo } from '@/components/media/SiteVideo';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCta } from '@/components/sections/FinalCta';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = assertLocale(raw);
  const t = await getTranslations({ locale, namespace: 'meta.pages.projects' });
  return buildMetadata({ locale, href: '/projects', title: t('title'), description: t('description') });
}

export default async function ProjectsPage({
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
          { name: t('nav.projects'), path: localePath('/projects', locale) },
        ])}
      />

      <PageHeader
        eyebrow={t('projects.eyebrow')}
        title={t('projects.title')}
        lede={<p>{t('projects.intro')}</p>}
        crumbs={[{ label: t('nav.projects') }]}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Completed buildings                                               */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="limewash" labelledBy="completed-heading">
        <SectionHeading id="completed-heading" title={t('projects.completedTitle')} />

        <ul className="mt-8 grid gap-px bg-hairline md:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal as="li" key={project.slug} delay={index * 60} className="bg-card">
              <Link
                href={{ pathname: '/projects/[slug]', params: { slug: project.slug } }}
                className="group flex h-full flex-col p-6 no-underline transition-colors hover:bg-stucco md:p-8"
              >
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-russet">
                  {t(`projects.types.${project.type}`)}
                  {project.sector ? ` · ${t(`projects.sectors.${project.sector}`)}` : ''}
                </p>
                <h3 className="mt-3 font-display text-[24px] font-bold leading-snug text-slate md:text-[28px]">
                  {project.title}
                </h3>
                <p className="mt-2 font-body text-[14px] text-mortar">
                  {project.city.charAt(0).toUpperCase() + project.city.slice(1)},{' '}
                  {project.region[locale]}
                </p>
                <p className="mt-4 flex-1 text-[15px] leading-[1.6] text-mortar">
                  {project.summary[locale]}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-body text-[14px] font-semibold text-russet">
                  {t('cta.readMore')}
                  <ArrowRight />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Work in progress — the four site clips live here.                 */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="stucco" labelledBy="site-work-heading">
        <SectionHeading
          id="site-work-heading"
          eyebrow={t('siteWork.eyebrow')}
          title={t('siteWork.title')}
          body={t('siteWork.intro')}
        />

        {/*
          A two-up card grid rather than alternating full-width rows: the clips
          are portrait phone video, and giving each one half a screen leaves a
          column of dead space beside a short caption.
        */}
        <ul className="mt-10 grid gap-px bg-hairline md:grid-cols-2">
          {siteWork.map((item) => {
            const service = item.service ? serviceBySlug(item.service) : undefined;

            return (
              <Reveal as="li" key={item.slug} className="bg-card">
                <article className="flex h-full flex-col gap-5 p-5 sm:flex-row sm:p-6">
                  <div className="w-full shrink-0 sm:w-[180px]">
                    <SiteVideo
                      slug={item.videoSlug}
                      label={item.title[locale]}
                      playLabel={t('siteWork.playVideo')}
                      sizeLabel={t('siteWork.videoSize', { size: '{size}' })}
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="font-display text-[19px] font-bold leading-snug text-slate md:text-[21px]">
                      {item.title[locale]}
                    </h3>
                    <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-mortar">
                      {item.caption[locale]}
                    </p>

                    {service ? (
                      <p className="mt-4 border-t border-hairline pt-3">
                        <span className="block font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-mortar">
                          {t('siteWork.relatedService')}
                        </span>
                        <Link
                          href={{ pathname: '/services/[slug]', params: { slug: service.slug } }}
                          className={`${buttonClassName('text')} mt-0.5 text-[14px]`}
                        >
                          {service.name[locale]}
                          <ArrowRight />
                        </Link>
                      </p>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>

        <p className="mt-6 text-[13px] text-mortar">{t('siteWork.videoNote')}</p>

      </Section>

      <FinalCta />
    </main>
  );
}
