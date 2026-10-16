import { beforeEach, describe, expect, it, vi } from 'vitest';

const db = vi.hoisted(() => ({ listProspects: vi.fn(), createProspect: vi.fn() }));
vi.mock('$lib/prospects/db', () => db);

import { isRedirect } from '@sveltejs/kit';
import { actions } from './+page.server';

// A successful create throws a redirect. Resolve it to its location; anything else passes through.
async function run(fields: Record<string, string>): Promise<unknown> {
  try {
    return await submit(fields);
  } catch (err) {
    if (isRedirect(err)) return { status: err.status, location: err.location };
    throw err;
  }
}

function submit(fields: Record<string, string>) {
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) body.set(k, v);
  const request = new Request('http://localhost/admin/prospects/new', { method: 'POST', body });
  return actions.default({ request, platform: { env: { DB: {} } } } as never);
}

const form = {
  companyName: 'Turk Plumbing',
  industry: 'plumbing',
  city: 'Austin',
  region: 'TX',
  phone: '512-555-0142',
  nearbyAreas: ''
};

const row = (slug: string) => ({ slug });

beforeEach(() => {
  db.listProspects.mockReset();
  db.createProspect.mockReset();
});

describe('create action', () => {
  it('redirects 303 to the list with the new slug', async () => {
    db.listProspects.mockResolvedValue([]);
    db.createProspect.mockImplementation(async (_db, input, slug) => ({ ...input, slug }));
    expect(await run(form)).toEqual({ status: 303, location: '/admin/prospects?created=turk-plumbing' });
  });

  it('skips slugs held by archived rows', async () => {
    db.listProspects.mockResolvedValue([row('turk-plumbing')]);
    db.createProspect.mockImplementation(async (_db, input, slug) => ({ ...input, slug }));
    const result = await run(form);
    expect(result).toEqual({ status: 303, location: '/admin/prospects?created=turk-plumbing-2' });
  });

  it('retries with the next slug when the insert collides', async () => {
    db.listProspects
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([row('turk-plumbing')]);
    db.createProspect
      .mockRejectedValueOnce(new Error('D1_ERROR: UNIQUE constraint failed: prospects.slug'))
      .mockImplementation(async (_db, input, slug) => ({ ...input, slug }));
    const result = await run(form);
    expect(result).toEqual({ status: 303, location: '/admin/prospects?created=turk-plumbing-2' });
    expect(db.createProspect).toHaveBeenCalledTimes(2);
  });

  it('gives up with a 409 and the input intact if collisions never stop', async () => {
    db.listProspects.mockResolvedValue([]);
    db.createProspect.mockRejectedValue(new Error('UNIQUE constraint failed'));
    const result = (await run(form)) as { status: number; data: { values: typeof form } };
    expect(result.status).toBe(409);
    expect(result.data.values.companyName).toBe('Turk Plumbing');
    expect(db.createProspect).toHaveBeenCalledTimes(3);
  });

  it('does not retry an unrelated database error', async () => {
    db.listProspects.mockResolvedValue([]);
    db.createProspect.mockRejectedValue(new Error('network down'));
    const result = (await run(form)) as { status: number };
    expect(result.status).toBe(500);
    expect(db.createProspect).toHaveBeenCalledTimes(1);
  });

  it('returns the submitted values on validation failure without touching the database', async () => {
    const result = (await run({ ...form, phone: 'call us' })) as {
      status: number;
      data: { values: typeof form; errors: Record<string, string> };
    };
    expect(result.status).toBe(400);
    expect(result.data.values.city).toBe('Austin');
    expect(result.data.errors.phone).toBeDefined();
    expect(db.listProspects).not.toHaveBeenCalled();
  });
});
