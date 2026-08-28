import type { City } from '@/types/content';

/**
 * Five cities across four regions, anglophone and francophone.
 * Each page carries the conditions that genuinely shape a build there.
 */
export const cities: City[] = [
  {
    slug: 'buea',
    name: 'Buea',
    region: { en: 'South West', fr: 'Sud-Ouest' },
    primaryLanguage: 'en',
    intro: {
      en: 'Buea sits on the flank of Mount Cameroon, in the South West region. Slope, volcanic ground and heavy rainfall are the three constants any build there works around.',
      fr: 'Buea s’étend sur le flanc du mont Cameroun, dans la région du Sud-Ouest. Pente, sols volcaniques et fortes pluies sont les trois constantes avec lesquelles tout chantier y compose.',
    },
    conditions: {
      en: [
        'Sloping sites are the norm rather than the exception, so retaining and terracing are priced into the earthworks from the start.',
        'Volcanic soils vary sharply over short distances, which makes a plot-specific soil investigation more useful here than almost anywhere.',
        'High rainfall places drainage, roof falls and site access at the centre of the programme.',
      ],
      fr: [
        'Les terrains en pente sont la règle plutôt que l’exception : soutènements et terrassements en gradins sont chiffrés dès le départ.',
        'Les sols volcaniques varient fortement sur de courtes distances, ce qui rend l’étude de sol par parcelle particulièrement utile ici.',
        'La forte pluviométrie place le drainage, les pentes de toiture et l’accès au chantier au cœur du planning.',
      ],
    },
    projects: [],
  },
  {
    slug: 'limbe',
    name: 'Limbe',
    region: { en: 'South West', fr: 'Sud-Ouest' },
    primaryLanguage: 'en',
    intro: {
      en: 'Limbe is on the coast, and salt-laden air is not a detail there — it governs reinforcement cover, the specification of every external fixing, and how long a roof lasts. Both First Trust Bank and the CCC Building are here.',
      fr: 'Limbe est sur la côte, et l’air chargé de sel n’y est pas un détail : il commande l’enrobage des armatures, la spécification de chaque fixation extérieure et la durée de vie d’une toiture. First Trust Bank et le CCC Building s’y trouvent tous deux.',
    },
    conditions: {
      en: [
        'Salt exposure calls for increased concrete cover to reinforcement and corrosion-resistant fixings on anything external.',
        'Coastal humidity shortens the life of untreated timber and standard roofing fasteners, which changes the specification rather than the price alone.',
        'Low-lying ground near the shore makes water table depth a foundation question, not a drainage one.',
      ],
      fr: [
        'L’exposition au sel impose un enrobage accru des armatures et des fixations résistant à la corrosion sur tout élément extérieur.',
        'L’humidité côtière réduit la durée de vie des bois non traités et des fixations de couverture courantes : c’est la spécification qui change, pas seulement le prix.',
        'Les terrains bas proches du rivage font du niveau de la nappe une question de fondation, et non de drainage.',
      ],
    },
    projects: ['first-trust-bank-limbe', 'ccc-building-limbe'],
  },
  {
    slug: 'douala',
    name: 'Douala',
    region: { en: 'Littoral', fr: 'Littoral' },
    primaryLanguage: 'fr',
    intro: {
      en: 'Douala is Cameroon’s commercial capital and its largest construction market, in the francophone Littoral region. Low-lying ground and a high water table are the recurring engineering questions.',
      fr: 'Douala est la capitale économique du Cameroun et son plus grand marché de la construction, dans la région francophone du Littoral. Terrains bas et nappe phréatique élevée y sont les questions d’ingénierie récurrentes.',
    },
    conditions: {
      en: [
        'A high water table frequently means dewatering during excavation and a foundation designed for soft ground.',
        'Dense urban plots restrict lorry access and crane positions, which shapes both the programme and the method.',
        'Material supply is the strongest of the five cities, which shortens lead times on anything specified.',
      ],
      fr: [
        'Une nappe élevée impose souvent un rabattement pendant les terrassements et une fondation conçue pour sol compressible.',
        'La densité urbaine limite l’accès des camions et les positions de grue, ce qui conditionne planning et mode opératoire.',
        'L’approvisionnement est le meilleur des cinq villes, ce qui raccourcit les délais sur tout élément prescrit.',
      ],
    },
    projects: [],
  },
  {
    slug: 'yaounde',
    name: 'Yaoundé',
    region: { en: 'Centre', fr: 'Centre' },
    primaryLanguage: 'fr',
    intro: {
      en: 'Yaoundé is the administrative capital, in the francophone Centre region — a city of hills, where slope, retaining and lorry access decide more about a programme than most clients expect.',
      fr: 'Yaoundé est la capitale administrative, dans la région francophone du Centre — une ville de collines, où la pente, les soutènements et l’accès des camions pèsent sur le planning plus que la plupart des clients ne l’imaginent.',
    },
    conditions: {
      en: [
        'Hillside plots mean retaining structures and stepped foundations are common, and both belong in the design rather than in a variation.',
        'Access roads to elevated plots limit lorry size, which affects delivery scheduling and therefore the pour programme.',
        'Lateritic soils are generally competent but vary with depth of fill, so previously levelled plots warrant particular attention.',
      ],
      fr: [
        'Les parcelles à flanc de colline appellent souvent soutènements et fondations en redans, à intégrer en conception plutôt qu’en avenant.',
        'Les voies d’accès aux parcelles en hauteur limitent le gabarit des camions, ce qui influe sur les livraisons et donc sur le programme de coulage.',
        'Les sols latéritiques sont généralement portants mais varient selon l’épaisseur de remblai : les terrains déjà nivelés méritent une attention particulière.',
      ],
    },
    projects: [],
  },
  {
    slug: 'bamenda',
    name: 'Bamenda',
    region: { en: 'North West', fr: 'Nord-Ouest' },
    primaryLanguage: 'en',
    intro: {
      en: 'Bamenda is the North West regional capital, below an escarpment on the Bamenda highlands. Altitude, a long rainy season and locally quarried stone all shape how buildings there are put together.',
      fr: 'Bamenda est le chef-lieu du Nord-Ouest, adossée à l’escarpement des hauts plateaux. L’altitude, une longue saison des pluies et la pierre de carrière locale façonnent la manière d’y construire.',
    },
    conditions: {
      en: [
        'A long rainy season narrows the window for earthworks and roofing, so sequencing is planned around it rather than against it.',
        'Locally quarried stone is readily available and well suited to boundary walls, foundations and facing work.',
        'Cooler highland temperatures affect concrete curing times, which changes striking schedules rather than the mix alone.',
      ],
      fr: [
        'Une longue saison des pluies réduit la fenêtre des terrassements et de la couverture : le phasage se planifie avec elle, non contre elle.',
        'La pierre de carrière locale est disponible et bien adaptée aux clôtures, fondations et parements.',
        'Les températures plus fraîches des hauts plateaux allongent la cure du béton, ce qui décale les décoffrages plus qu’il ne modifie la formulation.',
      ],
    },
    projects: [],
  },
];

export const cityBySlug = (slug: string) => cities.find((item) => item.slug === slug);
