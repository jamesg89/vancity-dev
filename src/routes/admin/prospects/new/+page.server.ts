import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createProspect, listProspects } from '$lib/prospects/db';
import { nextAvailableSlug } from '$lib/prospects/slug';
import {
  formValues,
  parseProspectForm,
  type ProspectFormErrors,
  type ProspectFormValues
} from '$lib/prospects/validate';

// The base domain a prospect's site is served from.
const SITE_DOMAIN = 'vancity.dev';

// A second admin, or a retry of the same POST, can take the slug between our read and the
// insert. The primary key is the real arbiter, so a collision re-reads and tries the next slug.
const MAX_ATTEMPTS = 3;

const isCollision = (err: unknown) => /UNIQUE|constraint/i.test(String((err as Error)?.message ?? err));


// One shape for every failure, so the page can read `values` and `errors` without narrowing.
const invalid = (status: 400 | 409 | 500 | 503, values: ProspectFormValues, errors: ProspectFormErrors) =>
  fail(status, { values, errors });

export const actions = {
  default: async ({ request, platform }) => {
    const values = formValues(await request.formData());
    const parsed = parseProspectForm(values);
    if (!parsed.prospect || !parsed.slugBase) return invalid(400, values, parsed.errors);

    const db = platform?.env?.DB;
    if (!db) return invalid(503, values, { form: 'The database is not available. Nothing was saved.' });

    try {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        // listProspects, not getProspectBySlug: that one hides archived rows, which still own
        // their slug (it is the primary key) and would make every retry collide again.
        const taken = new Set((await listProspects(db)).map((p) => p.slug));
        const slug = nextAvailableSlug(parsed.slugBase, (s) => taken.has(s));
        try {
          const created = await createProspect(db, parsed.prospect, slug);
          return {
            success: true as const,
            companyName: created.companyName,
            url: `https://${created.slug}.${SITE_DOMAIN}`
          };
        } catch (err) {
          if (!isCollision(err)) throw err;
        }
      }
    } catch {
      return invalid(500, values, { form: 'Could not save the prospect. Try again.' });
    }
    return invalid(409, values, { form: 'That link was taken while saving. Try again.' });
  }
} satisfies Actions;
