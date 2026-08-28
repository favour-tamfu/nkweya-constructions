import { getTranslations } from 'next-intl/server';

/** Four facts about the practice, immediately under the hero. */
export async function TrustBar() {
  const t = await getTranslations('trust');

  const items = [
    { value: t('years'), note: t('yearsNote') },
    { value: t('cities'), note: t('citiesNote') },
    { value: t('credentials'), note: t('credentialsNote') },
    { value: t('services'), note: t('servicesNote') },
  ];

  return (
    <section className="border-b border-rule-dark bg-slate-800" aria-label={t('credentials')}>
      <ul className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-rule-dark md:grid-cols-4">
        {items.map((item) => (
          <li key={item.note} className="bg-slate-800 px-[18px] py-6 md:px-8 md:py-7">
            <p className="figure-numerals font-display text-[20px] font-extrabold leading-tight text-white md:text-[24px]">
              {item.value}
            </p>
            <p className="mt-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-dim">
              {item.note}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
