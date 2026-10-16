import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// `vite preview` reaches the same local D1 state that `wrangler d1 execute --local` writes,
// so the rows below are what the /site load actually reads. Local only: never pass --remote.
function d1(sql: string) {
  // --file, not --command: a shell (needed for npx on Windows) would re-split the quotes.
  mkdirSync('test-results', { recursive: true });
  const file = 'test-results/prospect-seed.sql';
  writeFileSync(file, sql);
  execFileSync('npx', ['wrangler', 'd1', 'execute', 'vancity-prospects', '--local', '--file', file], {
    stdio: 'pipe',
    shell: process.platform === 'win32'
  });
}

const row = (
  slug: string,
  name: string,
  industry: string,
  phone: string | null,
  areas: string | null,
  archived = 0
) =>
  `INSERT OR REPLACE INTO prospects (slug, company_name, industry, city, region, phone, nearby_areas, created_at, archived) VALUES ('${slug}', '${name}', '${industry}', 'Austin', 'TX', ${phone === null ? 'NULL' : `'${phone}'`}, ${areas === null ? 'NULL' : `'${areas}'`}, 1760000000000, ${archived});`;

test.beforeAll(() => {
  execFileSync(
    'npx',
    ['wrangler', 'd1', 'migrations', 'apply', 'vancity-prospects', '--local'],
    { stdio: 'pipe', shell: process.platform === 'win32' }
  );
  d1(
    [
      row('turk-plumbing', 'Turk Plumbing', 'plumbing', '512-555-0142', 'Round Rock,Cedar Park,Pflugerville'),
      row('archived-co', 'Archived Plumbing', 'plumbing', '512-555-0100', null, 1),
      row('no-phone', 'No Phone Plumbing', 'plumbing', null, null),
      row('bad-phone', 'Bad Phone Plumbing', 'plumbing', 'call us', null),
      row('odd-trade', 'Odd Trade Co', 'basket-weaving', '512-555-0111', null)
    ].join(' ')
  );
});

test('prospect subdomain renders personalized content', async ({ page }) => {
  await page.goto('http://turk-plumbing.localhost:4173/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Fast, Honest Plumbing in Austin, TX'
  );
  await expect(page.locator('.brand-name')).toContainText('Turk');
  await expect(page.locator('.towns li')).toHaveCount(3);
  await expect(page.getByText('Round Rock').first()).toBeVisible();
});

test('prospect page leaks no Vancouver defaults', async ({ page }) => {
  await page.goto('http://turk-plumbing.localhost:4173/');
  const body = await page.locator('body').innerText();
  for (const s of ['Vancouver', 'Octopus', 'Burnaby', 'PL-204871', 'Vancity'])
    expect(body).not.toContain(s);
});

test('any path on a prospect subdomain renders the same site', async ({ page }) => {
  const res = await page.goto('http://turk-plumbing.localhost:4173/some/deep/link');
  expect(res?.status()).toBe(200);
  await expect(page.locator('.brand-name')).toContainText('Turk');
});

test('unknown slug 404s', async ({ page }) => {
  const res = await page.goto('http://nobody-here.localhost:4173/');
  expect(res?.status()).toBe(404);
});

test('archived prospect 404s', async ({ page }) => {
  const res = await page.goto('http://archived-co.localhost:4173/');
  expect(res?.status()).toBe(404);
});

test('prospect with no phone 404s', async ({ page }) => {
  const res = await page.goto('http://no-phone.localhost:4173/');
  expect(res?.status()).toBe(404);
});

test('prospect whose phone has no digits 404s', async ({ page }) => {
  const res = await page.goto('http://bad-phone.localhost:4173/');
  expect(res?.status()).toBe(404);
});

test('prospect with an unknown industry is a 500', async ({ page }) => {
  const res = await page.goto('http://odd-trade.localhost:4173/');
  expect(res?.status()).toBe(500);
});

test('existing demo subdomains still work', async ({ page }) => {
  await page.goto('http://waterstcafe.localhost:4173/');
  await expect(page.locator('.demo-banner')).toBeVisible();
  await page.goto('http://alexjo.localhost:4173/');
  await expect(page.locator('.demo-banner')).toBeVisible();
});

test('/p is unaffected', async ({ page }) => {
  await page.goto('http://localhost:4173/p');
  await expect(page.locator('.brand-name')).toContainText('Octopus');
});
