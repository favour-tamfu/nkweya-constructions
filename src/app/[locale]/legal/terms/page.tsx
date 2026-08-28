import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { assertLocale } from '@/lib/locale';
import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/sections/PageHeader';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = assertLocale(raw);
  const t = await getTranslations({ locale, namespace: 'meta.pages.terms' });
  return buildMetadata({
    locale,
    href: '/legal/terms',
    title: t('title'),
    description: t('description'),
  });
}

export default async function TermsPage({
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
      <PageHeader
        title={t('legal.termsTitle')}
        crumbs={[{ label: t('footer.terms') }]}
        tone="slate"
      />
      <Section tone="limewash">
        <div className="prose-measure space-y-5 text-[16px] leading-[1.65] text-mortar md:text-[17px]">
          <p>{t('legal.termsBody')}</p>
          <p>{t('legal.termsRenders')}</p>
        </div>
      </Section>
    </main>
  );
}
