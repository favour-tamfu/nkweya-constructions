import type { Design } from '@/types/content';

/**
 * Architectural visualisations — computer drawings of proposed schemes, not
 * photographs of completed buildings. Every image here renders with its
 * label, and none of them appears in `projects.ts`.
 */
export const designs: Design[] = [
  {
    slug: 'two-storey-duplex-block',
    title: {
      en: 'Two-storey duplex block',
      fr: 'Immeuble duplex à deux niveaux',
    },
    buildingType: {
      en: 'Semi-detached residential, two units',
      fr: 'Résidentiel jumelé, deux logements',
    },
    storeys: 2,
    images: [
      {
        src: 'residential-duplex-block-front-elevation',
        kind: 'render',
        alt: {
          en: 'Architectural visualisation of a two-storey semi-detached duplex block with a brown hipped roof, timber-clad entrance bays and a stone perimeter wall.',
          fr: 'Vue d’architecte d’un immeuble duplex jumelé à deux niveaux, toiture à quatre pans brune, halls d’entrée habillés de bois et mur de clôture en pierre.',
        },
        caption: {
          en: 'Front elevation — paired entrances, first-floor balconies to each unit.',
          fr: 'Élévation principale — entrées jumelées, balcons à l’étage pour chaque logement.',
        },
      },
      {
        src: 'residential-duplex-block-street-view',
        kind: 'render',
        alt: {
          en: 'Street-level visualisation of the same duplex block seen from the approach road, with parking along the boundary wall.',
          fr: 'Vue depuis la rue du même immeuble duplex, avec stationnement le long du mur de clôture.',
        },
        caption: {
          en: 'Street view — the approach and the boundary treatment.',
          fr: 'Vue depuis la rue — l’accès et le traitement de la clôture.',
        },
      },
      {
        src: 'residential-duplex-block-driveway-view',
        kind: 'render',
        alt: {
          en: 'Wide visualisation of the duplex block showing the full driveway frontage and the landscaped verge.',
          fr: 'Vue large de l’immeuble duplex montrant toute la façade sur allée et l’accotement paysager.',
        },
        caption: {
          en: 'Driveway frontage across the full width of the plot.',
          fr: 'Façade sur allée, sur toute la largeur de la parcelle.',
        },
      },
    ],
    note: {
      en: 'A visualisation, not a finished building. Layout, finishes and roof profile are all set at design stage and change with the plot and the budget.',
      fr: 'Une vue d’architecte, non un bâtiment achevé. Distribution, finitions et profil de toiture se fixent en phase de conception et évoluent selon la parcelle et le budget.',
    },
  },
  {
    slug: 'two-storey-residential-block',
    title: {
      en: 'Two-storey residential block',
      fr: 'Immeuble résidentiel à deux niveaux',
    },
    buildingType: {
      en: 'Multi-unit residential',
      fr: 'Résidentiel collectif',
    },
    storeys: 2,
    images: [
      {
        src: 'two-storey-residential-block-aerial-view',
        kind: 'render',
        alt: {
          en: 'Aerial visualisation of a two-storey residential block with a grey tiled hipped roof, rendered walls and a stone-faced boundary wall.',
          fr: 'Vue aérienne d’architecte d’un immeuble résidentiel à deux niveaux, toiture à quatre pans en tuiles grises, murs enduits et clôture en pierre.',
        },
        caption: {
          en: 'Aerial view — roof geometry and the relationship to the neighbouring plot.',
          fr: 'Vue aérienne — géométrie de la toiture et rapport à la parcelle voisine.',
        },
      },
    ],
    note: {
      en: 'Shown from above because roof geometry is where a residential block is won or lost — falls, valleys, and the run-off that follows the rains.',
      fr: 'Présenté vu du dessus, car c’est la géométrie de la toiture qui fait la qualité d’un immeuble résidentiel : pentes, noues et évacuation des eaux de pluie.',
    },
  },
  {
    slug: 'five-storey-apartment-building',
    title: {
      en: 'Five-storey apartment building',
      fr: 'Immeuble d’habitation à cinq niveaux',
    },
    buildingType: {
      en: 'Apartments over ground-floor commercial',
      fr: 'Logements sur rez-de-chaussée commercial',
    },
    storeys: 5,
    images: [
      {
        src: 'five-storey-apartment-building-front-elevation',
        kind: 'render',
        alt: {
          en: 'Architectural visualisation of a five-storey apartment building with stacked balconies, green accent panels and a shuttered commercial unit at ground level.',
          fr: 'Vue d’architecte d’un immeuble d’habitation à cinq niveaux, balcons superposés, panneaux d’accent verts et local commercial à rideau au rez-de-chaussée.',
        },
        caption: {
          en: 'Front elevation — a balcony to every flat, commercial unit at street level.',
          fr: 'Élévation principale — un balcon par appartement, local commercial en pied d’immeuble.',
        },
      },
    ],
    note: {
      en: 'Apartments above, rentable frontage below. A ground-floor commercial unit changes the structural grid and the foundation, so it belongs in the design rather than in an afterthought.',
      fr: 'Des logements en hauteur, une façade louable en bas. Un local commercial au rez-de-chaussée modifie la trame porteuse et les fondations : cela se décide en conception, jamais après coup.',
    },
  },
  {
    slug: 'six-storey-apartment-block',
    title: {
      en: 'Six-storey apartment block',
      fr: 'Immeuble d’habitation à six niveaux',
    },
    buildingType: {
      en: 'Multi-unit residential tower',
      fr: 'Tour résidentielle collective',
    },
    storeys: 6,
    images: [
      {
        src: 'six-storey-apartment-block-corner-view',
        kind: 'render',
        alt: {
          en: 'Corner visualisation of a six-storey apartment block in white and dark grey render, with planted balconies and a roof terrace.',
          fr: 'Vue d’angle d’un immeuble d’habitation à six niveaux, enduit blanc et gris foncé, balcons plantés et terrasse en toiture.',
        },
        caption: {
          en: 'Corner view — planted balconies and the roof terrace.',
          fr: 'Vue d’angle — balcons plantés et terrasse en toiture.',
        },
      },
      {
        src: 'six-storey-apartment-block-front-elevation',
        kind: 'render',
        alt: {
          en: 'Front elevation visualisation of the six-storey apartment block seen across open ground.',
          fr: 'Élévation principale de l’immeuble à six niveaux, vue depuis un terrain dégagé.',
        },
        caption: {
          en: 'Front elevation from the approach.',
          fr: 'Élévation principale depuis l’accès.',
        },
      },
      {
        src: 'six-storey-apartment-block-three-quarter-view',
        kind: 'render',
        alt: {
          en: 'Three-quarter visualisation of the six-storey apartment block showing the blank gable and the balcony stack together.',
          fr: 'Vue de trois quarts de l’immeuble à six niveaux montrant le pignon aveugle et la file de balcons.',
        },
        caption: {
          en: 'Three-quarter view — the blank gable and the balcony stack.',
          fr: 'Vue de trois quarts — le pignon aveugle et la file de balcons.',
        },
      },
    ],
    note: {
      en: 'At six storeys a soil investigation stops being advisable and becomes structural. Nothing at this height is priced or programmed before the ground has been tested.',
      fr: 'À six niveaux, l’étude de sol cesse d’être conseillée pour devenir structurelle. À cette hauteur, rien ne se chiffre ni ne se planifie avant d’avoir sondé le terrain.',
    },
  },
];

export const designBySlug = (slug: string) => designs.find((item) => item.slug === slug);
