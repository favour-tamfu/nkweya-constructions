import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { company } from '@/content/company';
import { cities } from '@/content/cities';
import { displayPhone, telHref } from '@/lib/whatsapp';
import { LogoMark } from '@/components/icons/LogoMark';

export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();
  const email = company.emails[0];

  return (
    <footer className="bg-slate text-ash">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-[18px] py-14 md:grid-cols-12 md:gap-8 md:px-14 md:py-16">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3 text-white">
            <LogoMark />
            <p className="font-display text-[17px] font-bold leading-tight">
              Nkweya &amp; Sons
              <span className="block font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-dim">
                Constructions
              </span>
            </p>
          </div>
          <p className="mt-5 max-w-[34ch] font-display text-[19px] leading-snug text-iroko">
            {t('meta.tagline')}
          </p>
          <p className="mt-4 font-body text-[13px] uppercase tracking-[0.14em] text-dim">
            {t('footer.tagline')}
          </p>
        </div>

        <nav className="md:col-span-2" aria-label={t('footer.explore')}>
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-iroko">
            {t('footer.explore')}
          </p>
          <ul className="mt-4 flex flex-col">
            {(
              [
                ['/services', 'services'],
                ['/projects', 'projects'],
                ['/designs', 'designs'],
                ['/process', 'process'],
              ] as const
            ).map(([href, key]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex min-h-11 items-center py-1 text-[15px] text-nav no-underline transition-colors hover:text-white"
                >
                  {t(`nav.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="md:col-span-2" aria-label={t('footer.company')}>
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-iroko">
            {t('footer.company')}
          </p>
          <ul className="mt-4 flex flex-col">
            {(
              [
                ['/about', 'about'],
                ['/contact', 'contact'],
              ] as const
            ).map(([href, key]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex min-h-11 items-center py-1 text-[15px] text-nav no-underline transition-colors hover:text-white"
                >
                  {t(`nav.${key}`)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/legal/privacy"
                className="inline-flex min-h-11 items-center py-1 text-[15px] text-nav no-underline transition-colors hover:text-white"
              >
                {t('footer.privacy')}
              </Link>
            </li>
            <li>
              <Link
                href="/legal/terms"
                className="inline-flex min-h-11 items-center py-1 text-[15px] text-nav no-underline transition-colors hover:text-white"
              >
                {t('footer.terms')}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-iroko">
            {t('footer.reach')}
          </p>
          <ul className="mt-4 flex flex-col">
            {company.phones.map((phone, index) => (
              <li key={phone}>
                <a
                  href={telHref(phone)}
                  className="inline-flex min-h-11 items-center gap-2 py-1 font-body text-[15px] tabular-nums text-white no-underline transition-colors hover:text-iroko"
                >
                  {displayPhone(phone)}
                  {index === 0 ? (
                    <span className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-dim">
                      {t('contact.primaryLabel')}
                    </span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
          {email ? (
            <a
              href={`mailto:${email}`}
              className="mt-2 inline-flex min-h-11 items-center break-all text-[15px] text-white no-underline hover:text-iroko"
            >
              {email}
            </a>
          ) : null}

          <p className="mt-6 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-iroko">
            {t('nav.cities')}
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-1 gap-y-1">
            {cities.map((city, index) => (
              <li key={city.slug} className="flex items-center">
                <Link
                  href={{ pathname: '/cities/[city]', params: { city: city.slug } }}
                  className="inline-flex min-h-11 items-center py-1 text-[15px] text-nav no-underline transition-colors hover:text-white"
                >
                  {city.name}
                </Link>
                {index < cities.length - 1 ? (
                  <span aria-hidden className="px-1.5 text-dim">
                    ·
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-rule-dark">
        <div className="mx-auto max-w-[1440px] px-[18px] py-6 text-sm md:px-14">
          <p>
            © {year} {company.tradingName}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
