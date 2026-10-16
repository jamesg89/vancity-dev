import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProspectBySlug } from '$lib/prospects/db';
import type { Prospect, ReadyProspect } from '$lib/prospects/types';
import { industries } from '$lib/templates';
import { derivePlumbingContent } from '$lib/templates/plumbing/derive';

// ReadyProspect only promises a string at the type level. '' and 'call us' satisfy it and
// would render "Call call us" in six places, so a phone with no digits is an incomplete row.
function isReady(prospect: Prospect): prospect is ReadyProspect {
  return prospect.phone !== null && /\d/.test(prospect.phone);
}

export const load: PageServerLoad = async ({ locals, platform }) => {
  const slug = locals.siteSlug;
  if (!slug) error(404, 'Not found');

  const db = platform?.env?.DB;
  if (!db) error(503, 'Site temporarily unavailable');

  // Only the D1 call is guarded: an error() thrown below must not be re-mapped to a 503.
  let prospect: Prospect | null;
  try {
    prospect = await getProspectBySlug(db, slug);
  } catch {
    error(503, 'Site temporarily unavailable');
  }

  if (!prospect || !isReady(prospect)) error(404, 'Not found');
  // The column is free TEXT, so a row can name an industry this build has no template for.
  if (!Object.hasOwn(industries, prospect.industry)) error(500, 'Unsupported industry');

  return { industry: prospect.industry, content: derivePlumbingContent(prospect) };
};
