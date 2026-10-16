export type IndustryKey = 'plumbing';

export interface Prospect {
  slug: string;
  companyName: string;
  industry: IndustryKey;
  city: string;
  region: string | null;
  phone: string | null;
  nearbyAreas: string[];
  createdAt: number;
  archived: boolean;
}

export type NewProspect = Omit<Prospect, 'slug' | 'createdAt' | 'archived'>;
