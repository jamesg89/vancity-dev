import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { LayoutServerLoad } from './$types';

// Where Access fronts the Worker. Deliberately its own list, not robots.txt's PUBLIC_HOSTS:
// that one is about what search engines may crawl, this one is about where the guard's
// header can be trusted, and the two would drift apart for different reasons.
// localhost is here even outside dev because the Playwright suite runs a production build
// (dev === false) on localhost; a deployed Worker is never reached with that hostname.
// Prospect subdomains never get here: reroute sends them to /site.
const ADMIN_HOSTS = new Set(['vancity.dev', 'www.vancity.dev', 'localhost', 'www.localhost']);

// Defence in depth, deliberately partial. This checks only that the host is allowlisted and
// that a Cf-Access-Jwt-Assertion header is present; it does NOT authenticate anyone.
// Cloudflare Access (Zero Trust policy on vancity.dev/admin/*) is the real control.
// Hardening, once the Access application exists and its AUD tag is known: verify the JWT
// signature, aud, iss and expiry against https://<team>.cloudflareaccess.com/cdn-cgi/access/certs.
export const load: LayoutServerLoad = ({ request, url }) => {
  if (dev) return;

  // Host first, and unconditional: a header is forgeable anywhere Access is not in front of
  // the Worker (workers.dev, a raw IP, a preview hostname), so it must never buy admission there.
  if (!ADMIN_HOSTS.has(url.hostname)) error(403, 'Forbidden');

  if (!request.headers.get('cf-access-jwt-assertion')) error(403, 'Forbidden');
};
