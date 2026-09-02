import type { Service } from '@/types/content';

/**
 * The five services offered. Each states what is included and, equally, what
 * is not — scope boundaries belong in the first conversation, not in a dispute
 * at finishing stage.
 *
 * Commercial terms and programme are set per project in the written contract,
 * because they follow from the plot, the design and the season.
 */
export const services: Service[] = [
  {
    slug: 'commercial-construction',
    name: {
      en: 'Commercial construction',
      fr: 'Construction commerciale',
    },
    summary: {
      en: 'Office buildings, bank and financial-institution branches, and retail structures, built to full specification from foundation to handover.',
      fr: 'Immeubles de bureaux, agences bancaires et d’établissements financiers, et commerces, construits selon le cahier des charges, des fondations à la livraison.',
    },
    includes: {
      en: [
        'Setting out, excavation and foundations to the soil report',
        'Reinforced concrete frame — columns, beams and slabs',
        'Blockwork, roofing and rainwater goods',
        'Electrical and plumbing first and second fix',
        'Plastering, screeds, tiling, joinery and painting',
        'Site supervision by a qualified engineer throughout',
        'Snagging list, joint handover and as-built drawings',
      ],
      fr: [
        'Implantation, terrassement et fondations selon le rapport de sol',
        'Ossature en béton armé — poteaux, poutres et dalles',
        'Maçonnerie, couverture et évacuation des eaux pluviales',
        'Électricité et plomberie, première et seconde phases',
        'Enduits, chapes, carrelage, menuiseries et peinture',
        'Suivi de chantier par un ingénieur qualifié, en continu',
        'Liste de réserves, réception conjointe et plans de récolement',
      ],
    },
    excludes: {
      en: [
        'Land purchase, survey and title registration',
        'Council permit fees, paid by the client directly',
        'Loose furniture, IT and security equipment fit-out',
        'Utility connection charges levied by ENEO or Camwater',
        'Specialist works not named in the signed bill of quantities',
      ],
      fr: [
        'Achat du terrain, bornage et immatriculation foncière',
        'Frais de permis en mairie, réglés directement par le client',
        'Mobilier, informatique et équipements de sécurité',
        'Frais de raccordement facturés par ENEO ou Camwater',
        'Travaux spécialisés non désignés au devis quantitatif signé',
      ],
    },
    faqs: [
      {
        q: {
          en: 'Do you work to an architect’s drawings, or produce your own?',
          fr: 'Travaillez-vous sur les plans d’un architecte, ou produisez-vous les vôtres ?',
        },
        a: {
          en: 'Either. If you arrive with a stamped set we build to it, and the structural drawings are checked against the soil report before anything is set out. If you have no drawings, they are produced at stage four of the process.',
          fr: 'Les deux. Si vous arrivez avec un jeu de plans visés, nous construisons dessus, et les plans de structure sont vérifiés contre le rapport de sol avant toute implantation. Si vous n’avez pas de plans, ils sont établis à l’étape quatre du processus.',
        },
      },
      {
        q: {
          en: 'What happens if the price of cement moves during the build?',
          fr: 'Que se passe-t-il si le prix du ciment évolue en cours de chantier ?',
        },
        a: {
          en: 'That belongs in the contract, not in a conversation halfway through. The signed contract states which items are fixed, which are subject to variation, and how a variation is agreed and recorded in writing before it is carried out.',
          fr: 'Cela relève du contrat, non d’une discussion à mi-chantier. Le contrat signé précise quels postes sont fermes, lesquels sont révisables, et comment une révision est convenue et consignée par écrit avant exécution.',
        },
      },
      {
        q: {
          en: 'Can you build outside the five cities you list?',
          fr: 'Construisez-vous hors des cinq villes annoncées ?',
        },
        a: {
          en: 'Buea, Limbe, Douala, Yaoundé and Bamenda are where the company has worked and where it can mobilise. Anywhere else is a conversation about access, labour and supply before it is a quotation.',
          fr: 'Buea, Limbe, Douala, Yaoundé et Bamenda sont les villes où l’entreprise a travaillé et où elle peut se mobiliser. Ailleurs, c’est d’abord une discussion sur l’accès, la main-d’œuvre et l’approvisionnement, avant d’être un devis.',
        },
      },
    ],
    icon: 'commercial',
    relatedProjects: ['first-trust-bank-limbe', 'ccc-building-limbe'],
  },
  {
    slug: 'residential-construction',
    name: {
      en: 'Residential construction',
      fr: 'Construction résidentielle',
    },
    summary: {
      en: 'Private homes and multi-unit residential blocks, managed from groundbreaking through finishing.',
      fr: 'Maisons individuelles et immeubles d’habitation, du terrassement aux finitions.',
    },
    includes: {
      en: [
        'Site clearance, setting out and foundations',
        'Structure and blockwork to the approved drawings',
        'Roof structure, covering and rainwater goods',
        'Electrical and plumbing installation',
        'Plastering, floor finishes, joinery and painting',
        'Stage-by-stage progress reporting to the client',
        'Snagging and handover with the guarantees in writing',
      ],
      fr: [
        'Nettoyage du terrain, implantation et fondations',
        'Structure et maçonnerie selon les plans approuvés',
        'Charpente, couverture et évacuation des eaux pluviales',
        'Installations électriques et de plomberie',
        'Enduits, revêtements de sol, menuiseries et peinture',
        'Comptes rendus d’avancement étape par étape',
        'Levée des réserves et réception, garanties par écrit',
      ],
    },
    excludes: {
      en: [
        'Land purchase and title documents',
        'Council permit fees',
        'Furniture, appliances and window dressings',
        'Boundary walls and landscaping, unless separately priced',
        'Borehole and water storage, unless separately priced',
      ],
      fr: [
        'Achat du terrain et titres de propriété',
        'Frais de permis en mairie',
        'Mobilier, électroménager et habillage des ouvertures',
        'Clôtures et aménagements paysagers, sauf chiffrage séparé',
        'Forage et stockage d’eau, sauf chiffrage séparé',
      ],
    },
    faqs: [
      {
        q: {
          en: 'Can I build in stages as money becomes available?',
          fr: 'Puis-je construire par étapes, au fur et à mesure de mes moyens ?',
        },
        a: {
          en: 'Many people do, and it is a reasonable way to build. It has to be planned into the design and the programme, though — a building left standing at slab level through a rainy season needs protecting, and that costs money nobody budgeted.',
          fr: 'Beaucoup le font, et c’est une manière raisonnable de construire. Encore faut-il l’intégrer à la conception et au planning : un bâtiment laissé au niveau de la dalle pendant une saison des pluies doit être protégé, et cela coûte un argent que personne n’avait prévu.',
        },
      },
      {
        q: {
          en: 'I am abroad. Can you build for me without my being there?',
          fr: 'Je suis à l’étranger. Pouvez-vous construire sans que je sois présent ?',
        },
        a: {
          en: 'Yes, and it is common. What makes it work is written reporting at each stage, dated photographs, and a contract that says what happens when something on site has to be decided quickly. Ask for those three things from any contractor, not only this one.',
          fr: 'Oui, et c’est courant. Ce qui le rend viable : des comptes rendus écrits à chaque étape, des photos datées, et un contrat qui précise ce qui se passe lorsqu’une décision doit être prise vite sur le chantier. Exigez ces trois éléments de toute entreprise, pas seulement de celle-ci.',
        },
      },
      {
        q: {
          en: 'How much does a three-bedroom house cost?',
          fr: 'Combien coûte une maison de trois chambres ?',
        },
        a: {
          en: 'It depends on floor area, finishing level, the city, and — more than most people expect — what the soil report says about the foundation. We give you a figure after a site visit and a priced bill of quantities against the drawings, because a figure given before anyone has seen the plot is not one you can build to.',
          fr: 'Cela dépend de la surface, du niveau de finition, de la ville et — plus qu’on ne le croit — de ce que le rapport de sol indique pour les fondations. Nous chiffrons après une visite de site et un devis quantitatif établi sur les plans : un montant annoncé avant d’avoir vu la parcelle n’est pas un montant sur lequel on peut bâtir.',
        },
      },
    ],
    icon: 'residential',
    relatedProjects: [],
  },
  {
    slug: 'structural-supervision',
    name: {
      en: 'Structural supervision',
      fr: 'Supervision structurelle',
    },
    summary: {
      en: 'On-site engineering oversight ensuring designs are followed and structural work meets standard.',
      fr: 'Suivi d’ingénierie sur chantier pour que les plans soient respectés et que le gros œuvre tienne la norme.',
    },
    includes: {
      en: [
        'Review of the structural drawings against the soil report',
        'Inspection of reinforcement before every concrete pour',
        'Checks on concrete mix, cover, curing and formwork',
        'Verification of setting out, levels and column positions',
        'Written stage reports with dated photographs',
        'A defects list you can put in front of your builder',
      ],
      fr: [
        'Examen des plans de structure au regard du rapport de sol',
        'Contrôle du ferraillage avant chaque coulage de béton',
        'Vérification du dosage, de l’enrobage, de la cure et des coffrages',
        'Contrôle de l’implantation, des niveaux et des poteaux',
        'Rapports d’étape écrits, avec photos datées',
        'Une liste de non-conformités à présenter à votre constructeur',
      ],
    },
    excludes: {
      en: [
        'Carrying out the building work itself',
        'Managing or paying your builder’s labour and suppliers',
        'Architectural design or planning applications',
        'Legal action against a contractor on your behalf',
        'Continuous presence on site — inspections are at agreed hold points',
      ],
      fr: [
        'L’exécution des travaux elle-même',
        'La gestion ou le paiement de la main-d’œuvre et des fournisseurs',
        'La conception architecturale ou les demandes d’autorisation',
        'Toute action en justice contre une entreprise pour votre compte',
        'Une présence permanente — les contrôles ont lieu aux points d’arrêt convenus',
      ],
    },
    faqs: [
      {
        q: {
          en: 'I already have a builder. Why would I pay someone else as well?',
          fr: 'J’ai déjà un constructeur. Pourquoi en payer un second ?',
        },
        a: {
          en: 'Because the things that go wrong structurally are invisible a week later. Reinforcement is checkable for a few hours before a pour and never again. Supervision is an independent pair of qualified eyes at the moments that cannot be revisited.',
          fr: 'Parce que ce qui se dégrade structurellement devient invisible une semaine plus tard. Le ferraillage est contrôlable quelques heures avant le coulage, et plus jamais ensuite. La supervision, c’est un regard qualifié et indépendant aux moments qui ne se rejouent pas.',
        },
      },
      {
        q: {
          en: 'Will this put me in conflict with my builder?',
          fr: 'Cela va-t-il me mettre en conflit avec mon constructeur ?',
        },
        a: {
          en: 'A competent builder generally welcomes it — the reports document that the work was done properly, which protects them too. Tell them at the start rather than sending an engineer to the site unannounced.',
          fr: 'Un constructeur compétent l’accueille en général favorablement : les rapports attestent que le travail a été bien fait, ce qui le protège aussi. Prévenez-le dès le départ plutôt que d’envoyer un ingénieur sur le chantier à l’improviste.',
        },
      },
      {
        q: {
          en: 'At what point in a build should supervision start?',
          fr: 'À quel moment la supervision doit-elle commencer ?',
        },
        a: {
          en: 'Before the foundation is poured, ideally before it is excavated. Coming in at finishing stage means everything that matters structurally is already buried.',
          fr: 'Avant le coulage des fondations, idéalement avant même le terrassement. Intervenir au stade des finitions, c’est arriver quand tout ce qui compte structurellement est déjà enfoui.',
        },
      },
      {
        q: {
          en: 'What do I actually receive?',
          fr: 'Que reçois-je concrètement ?',
        },
        a: {
          en: 'A written report at each agreed inspection point, with dated photographs, stating what was checked, what conformed, and what did not — in language you can hand to your builder without needing an engineer to interpret it.',
          fr: 'Un rapport écrit à chaque point de contrôle convenu, photos datées à l’appui, indiquant ce qui a été vérifié, ce qui est conforme et ce qui ne l’est pas — dans une langue que vous pouvez transmettre à votre constructeur sans avoir besoin d’un ingénieur pour la traduire.',
        },
      },
    ],
    icon: 'supervision',
    relatedProjects: [],
  },
  {
    slug: 'renovation-repair',
    name: {
      en: 'Renovation & repair',
      fr: 'Rénovation & réparation',
    },
    summary: {
      en: 'Structural repair, extensions and renovation on existing commercial and residential buildings.',
      fr: 'Réparation structurelle, extensions et rénovation de bâtiments commerciaux et résidentiels existants.',
    },
    includes: {
      en: [
        'Structural survey of the existing building before anything is priced',
        'Diagnosis of cracking — settlement, thermal or structural',
        'Underpinning, crack stitching and column or beam strengthening',
        'Extensions tied properly into the existing structure',
        'Roof replacement and damp remediation',
        'Re-finishing to match or replace what is there',
      ],
      fr: [
        'Diagnostic structurel du bâtiment existant avant tout chiffrage',
        'Analyse des fissures — tassement, retrait thermique ou structure',
        'Reprises en sous-œuvre, agrafage de fissures, renforcement de poteaux ou poutres',
        'Extensions correctement solidarisées à la structure existante',
        'Réfection de toiture et traitement des remontées d’humidité',
        'Reprise des finitions, à l’identique ou en remplacement',
      ],
    },
    excludes: {
      en: [
        'Repair of defects that a survey has not yet identified',
        'Work on a building without the owner’s written authority',
        'Asbestos removal and other licensed hazardous works',
        'Rehousing occupants during the works',
        'Guarantees on parts of the existing structure left untouched',
      ],
      fr: [
        'La reprise de désordres qu’un diagnostic n’a pas encore identifiés',
        'Toute intervention sans autorisation écrite du propriétaire',
        'Le désamiantage et autres travaux dangereux soumis à agrément',
        'Le relogement des occupants pendant les travaux',
        'Toute garantie sur les parties de structure non reprises',
      ],
    },
    faqs: [
      {
        q: {
          en: 'There are cracks in my wall. Is the building dangerous?',
          fr: 'Il y a des fissures dans mon mur. Le bâtiment est-il dangereux ?',
        },
        a: {
          en: 'Most cracks are not, but the ones that matter look much the same as the ones that do not. Width, direction, whether they run through a lintel, and whether they are still moving all decide it. That is a survey, not a photograph sent over WhatsApp.',
          fr: 'La plupart ne le sont pas, mais celles qui comptent ressemblent beaucoup à celles qui ne comptent pas. Largeur, orientation, passage ou non par un linteau, évolution dans le temps : tout cela tranche. Cela demande un diagnostic, pas une photo envoyée sur WhatsApp.',
        },
      },
      {
        q: {
          en: 'Can you add a floor to my existing house?',
          fr: 'Pouvez-vous ajouter un étage à ma maison existante ?',
        },
        a: {
          en: 'Only if the existing foundations and columns were designed for it, or can be strengthened to take it. That is established by survey and calculation before any price is discussed — a great many buildings in Cameroon carry a storey they were never designed to carry.',
          fr: 'Uniquement si les fondations et poteaux existants ont été conçus pour cela, ou peuvent être renforcés en conséquence. Cela s’établit par diagnostic et calcul avant toute discussion de prix — beaucoup de bâtiments au Cameroun portent un niveau pour lequel ils n’ont jamais été conçus.',
        },
      },
    ],
    icon: 'renovation',
    relatedProjects: [],
  },
  {
    slug: 'geotechnical-studies',
    name: {
      en: 'Geotechnical studies & boreholes',
      fr: 'Études géotechniques & forages',
    },
    summary: {
      en: 'Soil testing and preliminary studies before construction, and borehole drilling.',
      fr: 'Essais de sol et études préliminaires avant construction, ainsi que forage.',
    },
    includes: {
      en: [
        'Trial pits and boreholes to establish the soil profile',
        'Bearing capacity testing and water table depth',
        'A written geotechnical report with foundation recommendations',
        'Foundation type and depth advised for the specific plot',
        'Water borehole drilling, casing and development',
        'Pump sizing and installation advice',
      ],
      fr: [
        'Puits de reconnaissance et sondages pour établir le profil du sol',
        'Essais de portance et relevé du niveau de la nappe',
        'Un rapport géotechnique écrit, avec recommandations de fondation',
        'Type et profondeur de fondation préconisés pour la parcelle',
        'Forage d’eau, tubage et développement',
        'Conseil sur le dimensionnement et l’installation de la pompe',
      ],
    },
    excludes: {
      en: [
        'Any guarantee that water will be found at a given depth',
        'Water quality treatment and potability certification',
        'Council or ministry drilling authorisations',
        'Construction of the foundation the report recommends',
        'Re-testing after the ground has been disturbed by others',
      ],
      fr: [
        'Toute garantie de trouver de l’eau à une profondeur donnée',
        'Le traitement de la qualité de l’eau et la certification de potabilité',
        'Les autorisations de forage en mairie ou au ministère',
        'La réalisation de la fondation recommandée par le rapport',
        'Une contre-expertise après remaniement du terrain par un tiers',
      ],
    },
    faqs: [
      {
        q: {
          en: 'Do I really need a soil test for a single-storey house?',
          fr: 'Une étude de sol est-elle vraiment nécessaire pour une maison de plain-pied ?',
        },
        a: {
          en: 'You need to know what you are building on. On a plot that has been filled, on a slope, near a watercourse, or anywhere the neighbours have cracking, the answer is unambiguous. A soil study is a small fraction of a foundation and a tiny fraction of a rebuild.',
          fr: 'Il faut savoir sur quoi vous construisez. Sur un terrain remblayé, en pente, à proximité d’un cours d’eau, ou partout où les voisins présentent des fissures, la réponse ne fait aucun doute. Une étude de sol représente une petite part d’une fondation, et une part infime d’une reconstruction.',
        },
      },
      {
        q: {
          en: 'What does the report actually tell my builder?',
          fr: 'Que dit concrètement le rapport à mon constructeur ?',
        },
        a: {
          en: 'What the ground is made of at depth, how much load it will take, where the water sits, and therefore what foundation to build and how deep. Without it, foundation depth is chosen by habit rather than by measurement.',
          fr: 'De quoi le sol est constitué en profondeur, quelle charge il accepte, où se situe la nappe, et donc quelle fondation réaliser et à quelle profondeur. Sans lui, la profondeur de fondation se choisit par habitude plutôt que par mesure.',
        },
      },
      {
        q: {
          en: 'Is a borehole for water the same thing as a soil investigation?',
          fr: 'Un forage d’eau, est-ce la même chose qu’une étude de sol ?',
        },
        a: {
          en: 'No. They use related equipment and are often done on the same visit, which is why they sit under one service here, but a water borehole is a supply installation and a soil investigation is an engineering study. They produce different deliverables.',
          fr: 'Non. Ils font appel à des matériels voisins et se réalisent souvent lors d’une même intervention, d’où leur regroupement ici, mais un forage d’eau est une installation d’alimentation et une étude de sol est une étude d’ingénierie. Les livrables diffèrent.',
        },
      },
    ],
    icon: 'geotechnical',
    relatedProjects: [],
  },
];

export const serviceBySlug = (slug: string) => services.find((item) => item.slug === slug);
