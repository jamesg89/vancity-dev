import { expect, test } from '@playwright/test';

// Playwright runs against `npm run build && npm run preview`, so `dev` is false here.
// /admin is the guarded layout's own index page; /admin/** inherits the same guard.
const ADMIN = 'http://localhost:4173/admin';

test('admin is unreachable without the Access header in a production build', async ({ request }) => {
  expect((await request.get(ADMIN)).status()).toBe(403);
});

test('admin is reachable when the request carries the Access header', async ({ request }) => {
  const res = await request.get(ADMIN, {
    headers: { 'Cf-Access-Jwt-Assertion': 'presence-only-not-verified' }
  });
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain('Admin');
});

// [::1] is a hostname the guard does not allow (like workers.dev or a preview host).
// The header is forged, as anyone reaching the Worker outside Access could do.
test('a forged Access header does not admit a request on a non-allowlisted host', async ({ request }) => {
  const res = await request.get('http://[::1]:4173/admin', {
    headers: { 'Cf-Access-Jwt-Assertion': 'forged' }
  });
  expect(res.status()).toBe(403);
});

// There is no form action yet. Without a guard in `handle`, a POST falls through to SvelteKit's
// method handling (405), so a 403 proves the guard ran before routing. This is what keeps
// future actions and +server.ts endpoints under /admin behind the same check.
test('a POST to /admin without the Access header is 403, not 405', async ({ request }) => {
  expect((await request.post(ADMIN)).status()).toBe(403);
});

// The guard runs before routing, and SvelteKit decodes the path when routing, so an encoded
// spelling of /admin must be caught too. Node's URL keeps %61 as written, so this really goes
// out as /%61dmin (the RED run below proves it: against a raw-pathname guard it returns 200).
for (const path of ['/%61dmin', '/adm%69n', '/%61dmin/x']) {
  test(`percent-encoded ${path} is guarded like /admin`, async ({ request }) => {
    expect((await request.get(`http://localhost:4173${path}`)).status()).toBe(403);
    expect((await request.post(`http://localhost:4173${path}`)).status()).toBe(403);
  });
}
