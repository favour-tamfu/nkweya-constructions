import type { Project } from '@/types/content';

/**
 * Completed buildings. Photographs only — architectural visualisations belong
 * in `designs.ts` and never stand in for a finished building here.
 *
 * Both are in Limbe, and both house a category-two microfinance institution:
 * Community Credit Company (CCC Plc) and First Trust Savings and Loan. Their
 * sector is recorded as `banking` because that is how a visitor searches for
 * it, but the copy says savings and loan, which is what they are.
 */
export const projects: Project[] = [
  {
    slug: 'ccc-building-limbe',
    title: 'CCC Building',
    type: 'commercial',
    sector: 'banking',
    city: 'limbe',
    region: { en: 'South West', fr: 'Sud-Ouest' },
    summary: {
      en: 'A five-storey commercial building in Limbe, carrying the Limbe branch of Community Credit Company at street level, with balconied offices above.',
      fr: 'Un immeuble commercial de cinq niveaux à Limbe, abritant l’agence Community Credit Company en pied d’immeuble, avec des bureaux à balcon aux étages.',
    },
    scope: {
      en: [
        'Foundations to the soil investigation',
        'Reinforced concrete frame and blockwork across five levels',
        'Steep hipped roof with dormer and rainwater goods',
        'Balconies and balustrades to every upper floor',
        'External cladding, render and window installation',
        'Services installation and internal finishing',
        'Engineering supervision through to handover',
      ],
      fr: [
        'Fondations conformes à l’étude de sol',
        'Ossature en béton armé et maçonnerie sur cinq niveaux',
        'Toiture à forte pente avec lucarne et évacuation des eaux pluviales',
        'Balcons et garde-corps à chaque étage',
        'Bardage extérieur, enduits et pose des menuiseries',
        'Installation des réseaux et finitions intérieures',
        'Supervision d’ingénierie jusqu’à la réception',
      ],
    },
    images: [
      {
        src: 'ccc-building-limbe-completed-facade',
        kind: 'photo',
        alt: {
          en: 'The completed CCC Building in Limbe: a five-storey commercial building in dark cladding with white window surrounds, balconies to each upper floor and a steep dark hipped roof, with CCC Plc Limbe Branch signage above the ground floor.',
          fr: 'Le CCC Building achevé à Limbe : un immeuble commercial de cinq niveaux en bardage sombre, encadrements de fenêtres blancs, balcons à chaque étage et toiture à forte pente, avec l’enseigne CCC Plc Limbe Branch au-dessus du rez-de-chaussée.',
        },
        caption: {
          en: 'The completed building on its opening day, Limbe.',
          fr: 'L’immeuble achevé, le jour de son inauguration, à Limbe.',
        },
      },
    ],
    featured: true,
  },
  {
    slug: 'first-trust-bank-limbe',
    title: 'First Trust',
    type: 'commercial',
    sector: 'banking',
    city: 'limbe',
    region: { en: 'South West', fr: 'Sud-Ouest' },
    summary: {
      en: 'A branch for First Trust Savings and Loan in Limbe, on a coast where salt exposure governs reinforcement cover and every external fixing.',
      fr: 'Une agence First Trust Savings and Loan à Limbe, sur une côte où le sel commande l’enrobage des armatures et chaque fixation extérieure.',
    },
    scope: {
      en: [
        'Foundations to the soil investigation',
        'Reinforced concrete frame and blockwork',
        'Roofing and rainwater goods',
        'Increased reinforcement cover for coastal salt exposure',
        'Services installation and internal finishing',
        'Engineering supervision through to handover',
      ],
      fr: [
        'Fondations conformes à l’étude de sol',
        'Ossature en béton armé et maçonnerie',
        'Couverture et évacuation des eaux pluviales',
        'Enrobage d’armatures renforcé contre l’exposition au sel',
        'Installation des réseaux et finitions intérieures',
        'Supervision d’ingénierie jusqu’à la réception',
      ],
    },
    images: [],
    featured: true,
  },
];

export const projectBySlug = (slug: string) => projects.find((item) => item.slug === slug);
