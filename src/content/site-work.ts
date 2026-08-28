import type { Localized } from '@/types/content';

/**
 * Footage from live sites: a slab pour, a structure in elevation,
 * reinforcement laid out before concrete covers it, and a concrete cube on a
 * compression machine.
 *
 * Captions describe what is visibly happening. Neither the city nor the date
 * of any clip is recorded, so neither is stated.
 */
export interface SiteWork {
  slug: string;
  /** Key into the video manifest. */
  videoSlug: string;
  /** Key into the image manifest — a frame taken from the clip. */
  imageSlug: string;
  title: Localized<string>;
  caption: Localized<string>;
  /** The service this work belongs to. */
  service?: string;
}

export const siteWork: SiteWork[] = [
  {
    slug: 'slab-reinforcement-before-pour',
    videoSlug: 'slab-reinforcement-before-pour',
    imageSlug: 'site-slab-reinforcement-mesh-before-pour',
    title: {
      en: 'Slab reinforcement, before the pour',
      fr: 'Ferraillage de dalle, avant coulage',
    },
    caption: {
      en: 'Reinforcement mesh tied out over the formwork with the electrical conduit already run through it. A slab can be inspected at this moment and at no later one — an hour on, it is under concrete. This is the hold point structural supervision exists for.',
      fr: 'Treillis d’armature ligaturé sur le coffrage, gaine électrique déjà passée. Une dalle se contrôle à cet instant et à aucun autre : une heure plus tard, elle est sous le béton. C’est le point d’arrêt que la supervision structurelle a pour raison d’être.',
    },
    service: 'structural-supervision',
  },
  {
    slug: 'concrete-slab-pour',
    videoSlug: 'concrete-slab-pour-in-progress',
    imageSlug: 'site-concrete-slab-pour-crew',
    title: {
      en: 'Placing concrete on a slab',
      fr: 'Coulage du béton sur une dalle',
    },
    caption: {
      en: 'A full crew placing and spreading concrete across a floor slab, with aggregate and sand stockpiled on the ground below. A pour is one continuous operation: once it begins it does not stop, so everything it depends on is settled before the first batch is mixed.',
      fr: 'Une équipe complète met en place et répartit le béton sur une dalle de plancher, granulats et sable stockés au sol en contrebas. Un coulage est une opération continue : une fois lancé, il ne s’arrête pas — tout ce dont il dépend est donc réglé avant la première gâchée.',
    },
  },
  {
    slug: 'multi-storey-structure',
    videoSlug: 'multi-storey-structure-under-construction',
    imageSlug: 'site-multi-storey-structure-scaffolding',
    title: {
      en: 'A multi-storey structure in elevation',
      fr: 'Une structure à plusieurs niveaux en élévation',
    },
    caption: {
      en: 'Frame and blockwork complete across several floors, with the crew rendering the façade off timber scaffolding and mortar mixed on the ground. This is the stage the process page calls gros œuvre — the part of a building that is not corrected afterwards.',
      fr: 'Ossature et maçonnerie achevées sur plusieurs niveaux, l’équipe enduit la façade depuis un échafaudage bois, mortier gâché au sol. C’est l’étape que la page processus appelle le gros œuvre — la partie d’un bâtiment qui ne se reprend pas après coup.',
    },
  },
  {
    slug: 'concrete-cube-compression-test',
    videoSlug: 'concrete-cube-compression-test',
    imageSlug: 'site-concrete-cube-compression-test',
    title: {
      en: 'Concrete cube on the compression machine',
      fr: 'Éprouvette de béton sur la presse',
    },
    caption: {
      en: 'A concrete cube crushed on a compression testing machine to establish the strength the mix actually reached. Specifying a concrete grade is straightforward; testing is how the batch is shown to have delivered it.',
      fr: 'Une éprouvette de béton écrasée sur une presse afin d’établir la résistance réellement atteinte par la formulation. Prescrire une classe de béton est simple ; l’essai est ce qui prouve que la gâchée l’a tenue.',
    },
    service: 'structural-supervision',
  },
];

export const siteWorkBySlug = (slug: string) => siteWork.find((item) => item.slug === slug);
