import type { ProcessStage } from '@/types/content';

/**
 * The stages between a first conversation and a set of keys.
 *
 * Each states what happens and what the client provides. Programme and
 * commercial terms are set per project, in the written contract at stage six,
 * because they depend on the plot, the design and the season.
 */
export const processStages: ProcessStage[] = [
  {
    number: 1,
    name: { en: 'First contact', fr: 'Premier contact' },
    what: {
      en: 'You call, write on WhatsApp, or send a message through this site. We establish what you want to build, where the plot is, and whether you already have drawings or a builder in place.',
      fr: 'Vous appelez, écrivez sur WhatsApp ou passez par ce site. Nous précisons ce que vous voulez construire, où se trouve la parcelle, et si vous disposez déjà de plans ou d’une entreprise.',
    },
    clientSupplies: {
      en: ['What you want to build', 'The town and the location of the plot'],
      fr: ['Ce que vous voulez construire', 'La ville et l’emplacement de la parcelle'],
    },
  },
  {
    number: 2,
    name: { en: 'Site visit', fr: 'Visite du site' },
    what: {
      en: 'We walk the plot: access for lorries, slope, drainage, neighbouring structures, and which services reach the boundary. Much of what determines a build cost is visible on the ground and appears on no drawing.',
      fr: 'Nous parcourons la parcelle : accès des camions, pente, drainage, constructions voisines, et réseaux arrivant en limite. Une grande part de ce qui détermine un coût se voit sur le terrain et ne figure sur aucun plan.',
    },
    clientSupplies: {
      en: ['Access to the plot', 'Land title or purchase documents'],
      fr: ['L’accès à la parcelle', 'Le titre foncier ou les actes d’achat'],
    },
  },
  {
    number: 3,
    name: { en: 'Soil investigation', fr: 'Étude de sol' },
    what: {
      en: 'Trial pits and boreholes establish bearing capacity and water table before anything is designed. This decides the foundation, and the foundation carries everything above it. We carry out this work ourselves rather than sending you elsewhere for it.',
      fr: 'Puits de reconnaissance et sondages établissent la portance et le niveau de la nappe avant toute conception. C’est ce qui décide des fondations, et les fondations portent tout le reste. Nous réalisons cette étude nous-mêmes plutôt que de vous renvoyer ailleurs.',
    },
    clientSupplies: {
      en: ['Clear access for the drilling rig'],
      fr: ['Un accès dégagé pour la foreuse'],
    },
  },
  {
    number: 4,
    name: { en: 'Design and drawings', fr: 'Conception et plans' },
    what: {
      en: 'Architectural and structural drawings are produced against the soil report and your brief. Changes are inexpensive at this stage and costly later, so this is the point to settle room sizes and layout.',
      fr: 'Les plans d’architecte et de structure sont établis à partir du rapport de sol et de votre programme. Les modifications coûtent peu à ce stade et cher plus tard : c’est ici qu’il faut arrêter les surfaces et la distribution.',
    },
    clientSupplies: {
      en: [
        'Your brief — rooms, storeys, how the building will be used',
        'Existing drawings, if you have them',
      ],
      fr: [
        'Votre programme — pièces, niveaux, usage du bâtiment',
        'Les plans existants, le cas échéant',
      ],
    },
  },
  {
    number: 5,
    name: { en: 'Building permit', fr: 'Permis de construire' },
    what: {
      en: 'The permit file goes to the council with the stamped drawings. The procedure and the office differ by city, and the waiting time belongs to the council rather than to the works — so the file is lodged early.',
      fr: 'Le dossier de permis part à la mairie avec les plans visés. La procédure et le service compétent diffèrent selon la ville, et le délai relève de l’administration et non du chantier : le dossier est donc déposé tôt.',
    },
    clientSupplies: {
      en: ['Land title', 'Identity documents', 'Council fees'],
      fr: ['Le titre foncier', 'Les pièces d’identité', 'Les frais de mairie'],
    },
  },
  {
    number: 6,
    name: { en: 'Quotation and contract', fr: 'Devis et contrat' },
    what: {
      en: 'A priced bill of quantities against the final drawings, then a written contract setting out scope, stage payments, programme and exclusions. Work begins on site once that is signed.',
      fr: 'Un devis quantitatif chiffré sur les plans définitifs, puis un contrat écrit précisant le périmètre, l’échéancier, le planning et les exclusions. Les travaux démarrent une fois le contrat signé.',
    },
    clientSupplies: {
      en: ['Confirmed budget', 'Signature on the contract'],
      fr: ['Un budget confirmé', 'La signature du contrat'],
    },
  },
  {
    number: 7,
    name: { en: 'Foundations', fr: 'Fondations' },
    what: {
      en: 'Setting out, excavation, blinding, reinforcement and the foundation pour, to the depths the soil report calls for. Everything above ground rests on the accuracy of this stage.',
      fr: 'Implantation, terrassement, béton de propreté, ferraillage et coulage des fondations, aux profondeurs prescrites par le rapport de sol. Tout ce qui s’élève ensuite repose sur la précision de cette étape.',
    },
    clientSupplies: {
      en: ['Site access, and water where available'],
      fr: ['L’accès au chantier, et l’eau si disponible'],
    },
  },
  {
    number: 8,
    name: { en: 'Structure', fr: 'Gros œuvre' },
    what: {
      en: 'Columns, beams, slabs and blockwork — the frame and the walls. Reinforcement is inspected before every pour, and concrete is tested to confirm the mix reached its specified grade.',
      fr: 'Poteaux, poutres, dalles et maçonnerie — l’ossature et les murs. Le ferraillage est contrôlé avant chaque coulage, et le béton est testé pour confirmer que la formulation atteint la classe prescrite.',
    },
    clientSupplies: {
      en: ['Decisions on any variation, in writing'],
      fr: ['Vos décisions sur les modifications, par écrit'],
    },
  },
  {
    number: 9,
    name: { en: 'Roofing', fr: 'Toiture' },
    what: {
      en: 'Roof structure, covering and rainwater goods. Closing the building in ahead of the rains is a programme decision taken months earlier, not on the day.',
      fr: 'Charpente, couverture et évacuation des eaux pluviales. Mettre le bâtiment hors d’eau avant les pluies est une décision de planning prise des mois plus tôt, non le jour même.',
    },
    clientSupplies: {
      en: ['Choice of roof covering'],
      fr: ['Le choix de la couverture'],
    },
  },
  {
    number: 10,
    name: { en: 'Finishing', fr: 'Second œuvre' },
    what: {
      en: 'Plastering, screeds, electrical and plumbing second fix, joinery, tiling and painting. This is the longest stage, and the one where prompt decisions keep the programme.',
      fr: 'Enduits, chapes, électricité et plomberie en seconde phase, menuiseries, carrelage et peinture. C’est l’étape la plus longue, et celle où des décisions rapides tiennent le planning.',
    },
    clientSupplies: {
      en: [
        'Selections — tiles, sanitary ware, doors, paint colours',
        'Timely decisions as the work proceeds',
      ],
      fr: [
        'Vos choix — carrelage, sanitaires, portes, teintes',
        'Des décisions prises au rythme du chantier',
      ],
    },
  },
  {
    number: 11,
    name: { en: 'Handover', fr: 'Réception' },
    what: {
      en: 'A joint inspection against a snagging list, every item closed out, then the keys, the as-built drawings and the guarantees. A building is finished when the list is clear, not when it looks finished.',
      fr: 'Une visite conjointe avec liste de réserves, chaque point levé, puis la remise des clés, des plans de récolement et des garanties. Un bâtiment est achevé quand la liste est soldée, non quand il en a l’air.',
    },
    clientSupplies: {
      en: ['Your attendance at the inspection'],
      fr: ['Votre présence à la visite de réception'],
    },
  },
];
