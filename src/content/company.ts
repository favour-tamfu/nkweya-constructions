import type { Company } from '@/types/content';

/**
 * Company facts. Everything here is supplied and publishable — no stand-ins.
 * A field that has no confirmed value is simply absent from this file and from
 * the pages, rather than carried as an empty slot.
 */
export const company: Company = {
  tradingName: 'Nkweya & Sons Constructions',
  principal: {
    name: 'Nkweya Francis',
    role: { en: 'Founding engineer', fr: 'Ingénieur fondateur' },
    qualifications: {
      en: [
        "Master's Degree in Civil Engineering (research)",
        'DIPET II certified',
        'Over 25 years in civil engineering',
      ],
      fr: [
        'Master en Génie Civil (recherche)',
        'Certifié DIPET II',
        'Plus de 25 ans en génie civil',
      ],
    },
  },
  phones: ['+237656766513', '+237692704279', '+237675644544'],
  /** Every WhatsApp button on the site opens this number. */
  whatsappPrimary: '+237656766513',
  emails: ['nkweyfran@yahoo.com', 'nkweyafrancis@gmail.com'],
  citiesServed: ['buea', 'limbe', 'douala', 'yaounde', 'bamenda'],
};

export const primaryPhoneDisplay = '+237 656 766 513';
