import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { LayoutServerLoad } from './$types';

// Cloudflare Access is the real control (Zero Trust policy on vancity.dev/admin/*).
// This is defence in depth: refuse any request that never passed through Access.
// Presence only; the JWT signature is deliberately not verified here.
export const load: LayoutServerLoad = ({ request }) => {
  if (!dev && !request.headers.get('cf-access-jwt-assertion')) {
    error(403, 'Forbidden');
  }
};
