// @vitest-environment node
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import type { D1Database } from '@cloudflare/workers-types';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  createProspect,
  getProspectBySlug,
  joinAreas,
  listProspects,
  rowToProspect,
  setArchived,
  splitAreas,
  type ProspectRow
} from './db';
import type { NewProspect } from './types';

// A just-enough D1 over node:sqlite, so the real migration and the real SQL run. It also
// records every statement so tests can assert values are bound, never interpolated.
function fakeD1() {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync('migrations/0001_create_prospects.sql', 'utf8'));
  const statements: { sql: string; params: unknown[] }[] = [];
  const db = {
    prepare(sql: string) {
      let params: unknown[] = [];
      const stmt = {
        bind(...values: unknown[]) {
          params = values;
          return stmt;
        },
        async first() {
          statements.push({ sql, params });
          return (sqlite.prepare(sql).get(...(params as never[])) as never) ?? null;
        },
        async all() {
          statements.push({ sql, params });
          return { results: sqlite.prepare(sql).all(...(params as never[])) as never[] };
        },
        async run() {
          statements.push({ sql, params });
          sqlite.prepare(sql).run(...(params as never[]));
          return { success: true };
        }
      };
      return stmt;
    }
  };
  return { db: db as unknown as D1Database, sqlite, statements };
}

const input: NewProspect = {
  companyName: 'Turk Plumbing',
  industry: 'plumbing',
  city: 'Austin',
  region: 'Texas',
  phone: '(512) 555-0100',
  nearbyAreas: ['Round Rock', 'Cedar Park']
};

describe('splitAreas / joinAreas', () => {
  it('splits, trims and drops empty entries', () =>
    expect(splitAreas(' Round Rock ,, Cedar Park,  ,')).toEqual(['Round Rock', 'Cedar Park']));
  it('treats null and blank as no areas', () => {
    expect(splitAreas(null)).toEqual([]);
    expect(splitAreas('')).toEqual([]);
    expect(splitAreas(' , ')).toEqual([]);
  });
  it('joins with commas and stores nothing for an empty list', () => {
    expect(joinAreas([' A ', '', 'B'])).toBe('A,B');
    expect(joinAreas([])).toBeNull();
    expect(joinAreas(['  '])).toBeNull();
  });
});

describe('rowToProspect', () => {
  const row: ProspectRow = {
    slug: 'turk-plumbing',
    company_name: 'Turk Plumbing',
    industry: 'plumbing',
    city: 'Austin',
    region: 'Texas',
    phone: '(512) 555-0100',
    nearby_areas: 'Round Rock, Cedar Park',
    created_at: 1234,
    archived: 0
  };
  it('maps every column to its camelCase field', () =>
    expect(rowToProspect(row)).toEqual({
      slug: 'turk-plumbing',
      companyName: 'Turk Plumbing',
      industry: 'plumbing',
      city: 'Austin',
      region: 'Texas',
      phone: '(512) 555-0100',
      nearbyAreas: ['Round Rock', 'Cedar Park'],
      createdAt: 1234,
      archived: false
    }));
  it('keeps nulls and converts archived to a boolean', () => {
    const p = rowToProspect({ ...row, region: null, phone: null, nearby_areas: null, archived: 1 });
    expect(p).toMatchObject({ region: null, phone: null, nearbyAreas: [], archived: true });
  });
});

describe('data access against the real schema', () => {
  let ctx: ReturnType<typeof fakeD1>;
  beforeEach(() => {
    ctx = fakeD1();
  });

  it('createProspect returns the stored prospect and getProspectBySlug round-trips it', async () => {
    const created = await createProspect(ctx.db, input, 'turk-plumbing');
    expect(created).toMatchObject({ ...input, slug: 'turk-plumbing', archived: false });
    expect(created.createdAt).toBeGreaterThan(0);
    expect(await getProspectBySlug(ctx.db, 'turk-plumbing')).toEqual(created);
  });

  it('writes the snake_case columns and a comma-joined nearby_areas', async () => {
    await createProspect(ctx.db, { ...input, nearbyAreas: [' Round Rock ', '', 'Cedar Park'] }, 'a');
    const row = ctx.sqlite.prepare('SELECT * FROM prospects WHERE slug = ?').get('a') as unknown as ProspectRow;
    expect(row).toMatchObject({
      company_name: 'Turk Plumbing',
      nearby_areas: 'Round Rock,Cedar Park',
      archived: 0
    });
  });

  it('stores null nearby_areas for an empty list and null region/phone', async () => {
    const p = await createProspect(
      ctx.db,
      { ...input, region: null, phone: null, nearbyAreas: [] },
      'b'
    );
    expect(p).toMatchObject({ region: null, phone: null, nearbyAreas: [] });
    const row = ctx.sqlite.prepare('SELECT * FROM prospects WHERE slug = ?').get('b') as unknown as ProspectRow;
    expect(row.nearby_areas).toBeNull();
  });

  it('getProspectBySlug returns null for a missing slug', async () => {
    expect(await getProspectBySlug(ctx.db, 'nope')).toBeNull();
  });

  it('getProspectBySlug returns null once archived, and again after unarchiving', async () => {
    await createProspect(ctx.db, input, 'turk-plumbing');
    await setArchived(ctx.db, 'turk-plumbing', true);
    expect(await getProspectBySlug(ctx.db, 'turk-plumbing')).toBeNull();
    await setArchived(ctx.db, 'turk-plumbing', false);
    expect(await getProspectBySlug(ctx.db, 'turk-plumbing')).not.toBeNull();
  });

  it('listProspects includes archived rows, newest first', async () => {
    await createProspect(ctx.db, input, 'old');
    await createProspect(ctx.db, input, 'new');
    ctx.sqlite.prepare('UPDATE prospects SET created_at = ? WHERE slug = ?').run(1, 'old');
    ctx.sqlite.prepare('UPDATE prospects SET created_at = ? WHERE slug = ?').run(2, 'new');
    await setArchived(ctx.db, 'old', true);
    const list = await listProspects(ctx.db);
    expect(list.map((p) => [p.slug, p.archived])).toEqual([
      ['new', false],
      ['old', true]
    ]);
  });

  it('a duplicate slug rejects rather than overwriting', async () => {
    await createProspect(ctx.db, input, 'dup');
    await expect(createProspect(ctx.db, { ...input, city: 'Dallas' }, 'dup')).rejects.toThrow();
    expect((await getProspectBySlug(ctx.db, 'dup'))?.city).toBe('Austin');
  });

  it('binds hostile values instead of interpolating them', async () => {
    const evil = "x'; DROP TABLE prospects; --";
    await createProspect(ctx.db, { ...input, companyName: evil }, evil);
    expect((await getProspectBySlug(ctx.db, evil))?.companyName).toBe(evil);
    await setArchived(ctx.db, evil, true);
    expect(await getProspectBySlug(ctx.db, evil)).toBeNull();
    expect(await listProspects(ctx.db)).toHaveLength(1);
    for (const { sql } of ctx.statements) {
      expect(sql).not.toContain('DROP');
      expect(sql).not.toContain(evil);
    }
  });
});
