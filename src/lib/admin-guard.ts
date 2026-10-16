// Defence in depth, deliberately partial. This checks only that the host is allowlisted and
// that a Cf-Access-Jwt-Assertion header is present; it does NOT authenticate anyone.
// Cloudflare Access (Zero Trust policy on vancity.dev/admin and /admin/*) is the real control.
// Hardening, once the Access application exists and its AUD tag is known: verify the JWT
// signature, aud, iss and expiry against https://<team>.cloudflareaccess.com/cdn-cgi/access/certs.
//
// It runs from `handle` (hooks.server.ts), not a +layout.server.ts load, because a layout load
// does not run before form actions or +server.ts endpoints. Here it covers all of them.

// Where Access fronts the Worker. The apex only: www is deliberately absent, so it fails closed
// unless the Access application is widened and www is added here on purpose. Not robots.txt's
// PUBLIC_HOSTS: that one is crawl policy, this one is where the header can be trusted.
// localhost is here even outside dev because the Playwright suite runs a production build
// (dev === false) on localhost; a deployed Worker is never reached with that hostname.
const ADMIN_HOSTS = new Set(['vancity.dev', 'localhost']);

export function isAdminPath(pathname: string): boolean {
  // This runs before routing, so it must see the path the way the router will: SvelteKit
  // decodes once (decode_pathname: decodeURI on each piece split at %25), and /%61dmin
  // serves /admin. Decode once, no more: /%2561dmin is /%61dmin, which is no route.
  let path: string;
  try {
    path = pathname.split('%25').map(decodeURI).join('%25');
  } catch {
    // Malformed escape. SvelteKit answers 400 itself; failing closed here loses nothing.
    return true;
  }
  return path === '/admin' || path.startsWith('/admin/');
}

export function adminAccessAllowed(url: URL, headers: Headers, dev: boolean): boolean {
  if (dev) return true;
  // Host first and unconditional: a header is forgeable anywhere Access is not in front of the
  // Worker (workers.dev, a raw IP, a preview hostname), so it must never buy admission there.
  if (!ADMIN_HOSTS.has(url.hostname)) return false;
  return Boolean(headers.get('cf-access-jwt-assertion'));
}
