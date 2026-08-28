import type { Project } from '@/types/content';

/**
 * Completed buildings. Photographs only — architectural visualisations belong
 * in `designs.ts` and never stand in for a finished building here.
 */
export const projects: Project[] = [
  {
    slug: 'first-trust-bank-limbe',
    title: 'First Trust Bank',
    type: 'commercial',
    sector: 'banking',
    city: 'limbe',
    region: { en: 'South West', fr: 'Sud-Ouest' },
    summary: {
      en: 'A bank branch in Limbe, built to banking-sector specification and delivered to a client whose own technical review runs alongside the works.',
      fr: 'Une agence bancaire à Limbe, construite selon le cahier des charges du secteur bancaire et livrée à un client dont la revue technique accompagne les travaux.',
    },
    scope: {
      en: [
        'Reinforced concrete frame and blockwork',
        'Roofing and rainwater goods',
        'Electrical and plumbing installation',
        'Internal finishing and external works',
        'Engineering supervision through to handover',
      ],
      fr: [
        'Ossature en béton armé et maçonnerie',
        'Couverture et évacuation des eaux pluviales',
        'Installations électriques et de plomberie',
        'Finitions intérieures et aménagements extérieurs',
        'Supervision d’ingénierie jusqu’à la réception',
      ],
    },
    images: [],
    featured: true,
  },
  {
    slug: 'ccc-building-limbe',
    title: 'CCC Building',
    type: 'commercial',
    city: 'limbe',
    region: { en: 'South West', fr: 'Sud-Ouest' },
    summary: {
      en: 'A commercial building in Limbe, on the coast, where salt exposure governs reinforcement cover and the specification of every external fixing.',
      fr: 'Un immeuble commercial à Limbe, sur la côte, où l’exposition au sel commande l’enrobage des armatures et la spécification de chaque fixation extérieure.',
    },
    scope: {
      en: [
        'Foundations to the soil investigation',
        'Reinforced concrete frame and blockwork',
        'Roofing and rainwater goods',
        'Services installation and internal finishing',
        'Engineering supervision through to handover',
      ],
      fr: [
        'Fondations conformes à l’étude de sol',
        'Ossature en béton armé et maçonnerie',
        'Couverture et évacuation des eaux pluviales',
        'Installation des réseaux et finitions intérieures',
        'Supervision d’ingénierie jusqu’à la réception',
      ],
    },
    images: [],
    featured: true,
  },
];

export const projectBySlug = (slug: string) => projects.find((item) => item.slug === slug);
