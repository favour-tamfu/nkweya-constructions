export type Locale = 'en' | 'fr';
export type Localized<T> = Record<Locale, T>;

export type CitySlug = 'buea' | 'limbe' | 'douala' | 'yaounde' | 'bamenda';

export type IconName =
  | 'commercial'
  | 'residential'
  | 'supervision'
  | 'renovation'
  | 'geotechnical';

export interface MediaRef {
  /** Key into the generated image manifest. */
  src: string;
  alt: Localized<string>;
  caption?: Localized<string>;
  /** 'render' forces the design-visualisation label. */
  kind: 'photo' | 'render';
}

/** A completed building. */
export interface Project {
  slug: string;
  /** Proper nouns are not translated. */
  title: string;
  type: 'commercial' | 'residential' | 'renovation' | 'geotechnical';
  sector?: 'banking' | 'retail' | 'office' | 'institutional';
  city: CitySlug;
  region: Localized<string>;
  summary: Localized<string>;
  scope: Localized<string[]>;
  images: MediaRef[];
  featured: boolean;
}

/** An architectural visualisation. Always shown with its label. */
export interface Design {
  slug: string;
  title: Localized<string>;
  buildingType: Localized<string>;
  storeys?: number;
  images: MediaRef[];
  note: Localized<string>;
}

export interface Service {
  slug: string;
  name: Localized<string>;
  summary: Localized<string>;
  includes: Localized<string[]>;
  /** Never empty: scope boundaries are stated up front, not on request. */
  excludes: Localized<string[]>;
  faqs: { q: Localized<string>; a: Localized<string> }[];
  icon: IconName;
  relatedProjects: string[];
}

export interface City {
  slug: CitySlug;
  name: string;
  region: Localized<string>;
  /** Douala and Yaoundé are francophone. */
  primaryLanguage: Locale;
  intro: Localized<string>;
  /** What genuinely differs about building here. */
  conditions: Localized<string[]>;
  projects: string[];
}

export interface ProcessStage {
  number: number;
  name: Localized<string>;
  what: Localized<string>;
  clientSupplies: Localized<string[]>;
}

export interface Company {
  tradingName: string;
  principal: {
    name: string;
    role: Localized<string>;
    qualifications: Localized<string[]>;
  };
  phones: string[];
  whatsappPrimary: string;
  emails: string[];
  citiesServed: CitySlug[];
}
