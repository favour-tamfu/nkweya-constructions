import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { bitter, franklin } from '@/lib/fonts';
import { assertLocale } from '@/lib/locale';
import { buildMetadata, organisationSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyActionBar } from '@/components/layout/StickyActionBar';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#2b353a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = assertLocale(raw);
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    ...buildMetadata({
      locale,
      href: '/',
      title: t('homeTitle'),
      description: t('homeDescription'),
    }),
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nkweyaandsons.com',
    ),
    applicationName: t('siteName'),
    icons: {
      icon: [
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    formatDetection: { telephone: true },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!hasLocale(routing.locales, raw)) notFound();
  const locale = raw;
  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale });

  return (
    <html lang={locale} className={`${bitter.variable} ${franklin.variable}`}>
      <body className="site-wrap font-body">
        <a href="#main" className="skip-link">
          {t('nav.skipToContent')}
        </a>
        <JsonLd data={organisationSchema(locale)} />
        <NextIntlClientProvider messages={messages}>
          <Header whatsappMessage={t('whatsapp.default')} />
          <div id="main">{children}</div>
          <Footer />
          <StickyActionBar whatsappMessage={t('whatsapp.default')} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
