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
