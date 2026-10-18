import type { D1Database } from '@cloudflare/workers-types';
import type { IndustryKey, NewProspect, Prospect } from './types';

// Shape of a row as D1 returns it. This is the only place snake_case column names appear
// outside the SQL itself.
export interface ProspectRow {
  slug: string;
  company_name: string;
  industry: string;
  city: string;
  region: string | null;
  phone: string | null;
  nearby_areas: string | null;
  created_at: number;
  archived: number;
}

const COLUMNS =
  'slug, company_name, industry, city, region, phone, nearby_areas, created_at, archived';

// nearby_areas is stored comma-separated. Trim each entry and drop blanks on the way in
// and out, so "A, B,,  " and ["A", "B"] are the same thing.
export function splitAreas(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((area) => area.trim())
    .filter((area) => area !== '');
}

export function joinAreas(areas: string[]): string | null {
  const cleaned = areas.map((area) => area.trim()).filter((area) => area !== '');
  return cleaned.length > 0 ? cleaned.join(',') : null;
}

export function rowToProspect(row: ProspectRow): Prospect {
  return {
    slug: row.slug,
    companyName: row.company_name,
    // The column is free TEXT; the app only knows the keys in IndustryKey.
    industry: row.industry as IndustryKey,
    city: row.city,
    region: row.region,
    phone: row.phone,
    nearbyAreas: splitAreas(row.nearby_areas),
    createdAt: row.created_at,
    archived: row.archived !== 0
  };
}

export async function getProspectBySlug(db: D1Database, slug: string): Promise<Prospect | null> {
  const row = await db
    .prepare(`SELECT ${COLUMNS} FROM prospects WHERE slug = ? AND archived = 0`)
    .bind(slug)
    .first<ProspectRow>();
  return row ? rowToProspect(row) : null;
}

export async function listProspects(db: D1Database): Promise<Prospect[]> {
  const { results } = await db
    .prepare(`SELECT ${COLUMNS} FROM prospects ORDER BY created_at DESC`)
    .all<ProspectRow>();
  return results.map(rowToProspect);
}

// Rejects on a slug collision (the primary key); callers pick the slug first with
// nextAvailableSlug, so a collision here means a race and should surface as an error.
export async function createProspect(
  db: D1Database,
  input: NewProspect,
  slug: string
): Promise<Prospect> {
  const createdAt = Date.now();
  const nearbyAreas = joinAreas(input.nearbyAreas);
  await db
    .prepare(
      `INSERT INTO prospects (${COLUMNS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`
    )
    .bind(
      slug,
      input.companyName,
      input.industry,
      input.city,
      input.region,
      input.phone,
      nearbyAreas,
      createdAt
    )
    .run();
  return {
    slug,
    companyName: input.companyName,
    industry: input.industry,
    city: input.city,
    region: input.region,
    phone: input.phone,
    nearbyAreas: splitAreas(nearbyAreas),
    createdAt,
    archived: false
  };
}

export async function setArchived(db: D1Database, slug: string, archived: boolean): Promise<void> {
  await db
    .prepare('UPDATE prospects SET archived = ? WHERE slug = ?')
    .bind(archived ? 1 : 0, slug)
    .run();
}
