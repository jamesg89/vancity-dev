import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { listProspects, setArchived } from '$lib/prospects/db';

const SITE_DOMAIN = 'vancity.dev';

export const load: PageServerLoad = async ({ platform }) => {
  const db = platform?.env?.DB;
  if (!db) error(503, 'The database is not available.');
  const prospects = await listProspects(db);
  return {
    prospects: prospects.map((p) => ({
      slug: p.slug,
      companyName: p.companyName,
      city: p.city,
      archived: p.archived,
      // created_at is Date.now() milliseconds; formatted here so server and client agree.
      created: new Date(p.createdAt).toISOString().slice(0, 10),
      url: `https://${p.slug}.${SITE_DOMAIN}`
    }))
  };
};

export const actions = {
  archive: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(503, { message: 'The database is not available. Nothing changed.' });

    const data = await request.formData();
    const slug = data.get('slug');
    const archived = data.get('archived') === '1';
    if (typeof slug !== 'string' || !slug) return fail(400, { message: 'No prospect was named.' });

    // setArchived succeeds silently for an unknown slug, so confirm it exists first.
    const known = (await listProspects(db)).some((p) => p.slug === slug);
    if (!known) return fail(404, { message: `No prospect called ${slug}.` });

    try {
      await setArchived(db, slug, archived);
    } catch {
      return fail(500, { message: 'Could not update the prospect. Try again.' });
    }
    return { slug, archived };
  }
} satisfies Actions;
