import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

// The admin area is guarded in hooks.server.ts: the host must be allowlisted (localhost is) and
// a Cf-Access-Jwt-Assertion header must be present. The header is sent on every request.
test.use({
  baseURL: 'http://localhost:4173',
  extraHTTPHeaders: { 'Cf-Access-Jwt-Assertion': 'presence-only-not-verified' }
});

// Rows are created through the real form, so they land in local D1 and stay there. They are
// named so they can never collide with the rows tests/prospect-site.test.ts seeds (that file
// owns `turk-plumbing`, and Playwright runs files in parallel), and are removed before and
// after. Local only: never pass --remote.
//
// Every test here shares the one `admin-e2e-plumbing` slug family, so they run serially: a
// parallel worker's cleanup would delete another test's rows.
test.describe.configure({ mode: 'serial' });

const PREFIX = 'admin-e2e';

function d1(sql: string) {
  // --file, not --command: a shell (needed for npx on Windows) would re-split the quotes.
  mkdirSync('test-results', { recursive: true });
  const file = 'test-results/admin-prospects.sql';
  writeFileSync(file, sql);
  execFileSync('npx', ['wrangler', 'd1', 'execute', 'vancity-prospects', '--local', '--file', file], {
    stdio: 'pipe',
    shell: process.platform === 'win32'
  });
}

const cleanup = () => d1(`DELETE FROM prospects WHERE slug LIKE '${PREFIX}%' OR slug = 'admin-2';`);

test.beforeAll(() => {
  execFileSync('npx', ['wrangler', 'd1', 'migrations', 'apply', 'vancity-prospects', '--local'], {
    stdio: 'pipe',
    shell: process.platform === 'win32'
  });
});
test.beforeEach(cleanup);
test.afterAll(cleanup);

const NAME = 'Admin E2E Plumbing';
const URL1 = 'https://admin-e2e-plumbing.vancity.dev';

async function fillAndCreate(page: Page, name: string, extra: { phone?: string } = {}) {
  await page.goto('/admin/prospects/new');
  await page.getByLabel('Company name').fill(name);
  await page.getByLabel('City').fill('Austin');
  await page.getByLabel('State or province').fill('TX');
  await page.getByLabel('Phone').fill(extra.phone ?? '512-555-0142');
  await page.getByLabel('Nearby areas').fill('Round Rock, Pflugerville');
  await page.getByRole('button', { name: 'Create prospect' }).click();
}

test('creating a prospect redirects to the list and shows the shareable url', async ({ page }) => {
  await fillAndCreate(page, NAME);
  await expect(page).toHaveURL(/\/admin\/prospects\?created=admin-e2e-plumbing$/);
  await expect(page.getByTestId('created-url')).toHaveText(URL1);
  // The new row is on the same page, highlighted, with its own link and copy button.
  const row = page.getByRole('row', { name: new RegExp(NAME) });
  await expect(row).toHaveClass(/highlight/);
  await expect(row.getByTestId('share-url')).toHaveText(URL1);
});

test('reloading after a successful create does not create another prospect', async ({ page }) => {
  await fillAndCreate(page, NAME);
  await expect(page.getByTestId('created-url')).toHaveText(URL1);
  await page.reload();
  await expect(page.getByTestId('created-url')).toHaveText(URL1);
  await page.reload();
  await expect(page.getByRole('row', { name: new RegExp(NAME) })).toHaveCount(1);
  await expect(page.getByText('admin-e2e-plumbing-2.vancity.dev')).toHaveCount(0);
});

test('"Austin, TX" in nearby areas warns, still submits, and the page lists no such towns', async ({
  page
}) => {
  await page.goto('/admin/prospects/new');
  await page.getByLabel('Company name').fill(NAME);
  await page.getByLabel('City').fill('Austin');
  await page.getByLabel('State or province').fill('TX');
  await page.getByLabel('Phone').fill('512-555-0142');
  await expect(page.getByRole('status')).toHaveCount(0);
  await page.getByLabel('Nearby areas').fill('Austin, TX');
  await expect(page.getByRole('status')).toHaveCount(2);
  await expect(page.getByRole('status').first()).toContainText('city itself');
  await expect(page.getByRole('status').last()).toContainText('state or province code');

  await page.getByRole('button', { name: 'Create prospect' }).click();
  await expect(page.getByTestId('created-url')).toHaveText(URL1);

  await page.goto('http://admin-e2e-plumbing.localhost:4173/');
  await expect(page.locator('.towns li')).toHaveCount(0);
  await expect(page.getByText('Serving Austin').first()).toBeVisible();
});

test('a created= value that is not a listed prospect shows nothing', async ({ page }) => {
  await page.goto('/admin/prospects?created=<b>nope</b>');
  await expect(page.getByTestId('created-url')).toHaveCount(0);
});

test('the created prospect is a live, personalized site', async ({ page }) => {
  await fillAndCreate(page, NAME);
  await expect(page.getByTestId('created-url')).toBeVisible();
  await page.goto('http://admin-e2e-plumbing.localhost:4173/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Fast, Honest Plumbing in Austin, TX');
  await expect(page.locator('.towns li')).toHaveCount(2);
});

test('a duplicate company name gets a suffixed slug', async ({ page }) => {
  await fillAndCreate(page, NAME);
  await expect(page.getByTestId('created-url')).toHaveText(URL1);
  await fillAndCreate(page, NAME);
  await expect(page.getByTestId('created-url')).toHaveText('https://admin-e2e-plumbing-2.vancity.dev');
  await fillAndCreate(page, NAME);
  await expect(page.getByTestId('created-url')).toHaveText('https://admin-e2e-plumbing-3.vancity.dev');
});

test('an archived prospect still holds its slug, so a new one with the same name is suffixed', async ({
  page
}) => {
  await fillAndCreate(page, NAME);
  await page.goto('/admin/prospects');
  const row = page.getByRole('row', { name: new RegExp(NAME) });
  await row.getByRole('button', { name: 'Archive', exact: true }).click();
  // Wait for the enhanced POST to land. Without this the next navigation can abort it, and an
  // unarchived row also yields -2, so the test would prove nothing about archived rows.
  await expect(row.getByRole('button', { name: 'Unarchive' })).toBeVisible();
  await fillAndCreate(page, NAME);
  await expect(page.getByTestId('created-url')).toHaveText('https://admin-e2e-plumbing-2.vancity.dev');
});

test('company name is required and the rest of the input survives', async ({ page }) => {
  await page.goto('/admin/prospects/new');
  await page.getByLabel('City').fill('Austin');
  await page.getByLabel('Nearby areas').fill('Round Rock, Pflugerville');
  await page.getByRole('button', { name: 'Create prospect' }).click();
  await expect(page.getByText('Enter a company name.')).toBeVisible();
  await expect(page.getByLabel('City')).toHaveValue('Austin');
  await expect(page.getByLabel('Nearby areas')).toHaveValue('Round Rock, Pflugerville');
});

test('every field keeps its value when validation fails', async ({ page }) => {
  await page.goto('/admin/prospects/new');
  await page.getByLabel('Company name').fill('Keep Me Plumbing');
  await page.getByLabel('City').fill('Austin');
  await page.getByLabel('State or province').fill('TX');
  await page.getByLabel('Phone').fill('call us');
  await page.getByLabel('Nearby areas').fill('Round Rock');
  await page.getByRole('button', { name: 'Create prospect' }).click();
  await expect(page.getByText(/Enter a phone number/)).toBeVisible();
  await expect(page.getByLabel('Company name')).toHaveValue('Keep Me Plumbing');
  await expect(page.getByLabel('City')).toHaveValue('Austin');
  await expect(page.getByLabel('State or province')).toHaveValue('TX');
  await expect(page.getByLabel('Phone')).toHaveValue('call us');
  await expect(page.getByLabel('Nearby areas')).toHaveValue('Round Rock');
  await expect(page.getByLabel('Industry')).toHaveValue('plumbing');
});

test('a phone number with no real digits is rejected, not stored', async ({ page }) => {
  await fillAndCreate(page, NAME, { phone: 'call us' });
  await expect(page.getByText(/Enter a phone number/)).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/prospects\/new$/);
  await page.goto('/admin/prospects');
  await expect(page.getByText(NAME)).toHaveCount(0);
});

test('a name that slugifies to nothing is rejected', async ({ page }) => {
  await page.goto('/admin/prospects/new');
  await page.getByLabel('Company name').fill('!!!');
  await page.getByLabel('City').fill('Austin');
  await page.getByRole('button', { name: 'Create prospect' }).click();
  await expect(page.getByText(/Use at least one letter or number/)).toBeVisible();
  await expect(page.getByLabel('City')).toHaveValue('Austin');
});

test('a reserved name never becomes a reserved slug', async ({ page }) => {
  await page.goto('/admin/prospects/new');
  await page.getByLabel('Company name').fill('Admin');
  await page.getByLabel('City').fill('Austin');
  await page.getByLabel('Phone').fill('512-555-0142');
  await page.getByRole('button', { name: 'Create prospect' }).click();
  await expect(page.getByTestId('created-url')).toHaveText('https://admin-2.vancity.dev');
});

test('the list shows and archives a prospect', async ({ page }) => {
  await fillAndCreate(page, NAME);
  await page.goto('/admin/prospects');
  const row = page.getByRole('row', { name: new RegExp(NAME) });
  await expect(row).toBeVisible();
  await expect(row).toContainText('Austin');
  await expect(row.getByTestId('share-url')).toHaveText(URL1);

  const live = await page.goto('http://admin-e2e-plumbing.localhost:4173/');
  expect(live?.status()).toBe(200);

  await page.goto('/admin/prospects');
  await row.getByRole('button', { name: 'Archive', exact: true }).click();
  await expect(row.getByRole('button', { name: 'Unarchive' })).toBeVisible();

  const gone = await page.goto('http://admin-e2e-plumbing.localhost:4173/');
  expect(gone?.status()).toBe(404);

  await page.goto('/admin/prospects');
  await row.getByRole('button', { name: 'Unarchive' }).click();
  await expect(row.getByRole('button', { name: 'Archive', exact: true })).toBeVisible();
  const back = await page.goto('http://admin-e2e-plumbing.localhost:4173/');
  expect(back?.status()).toBe(200);
});

test('the copy button puts the url on the clipboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await fillAndCreate(page, NAME);
  const banner = page.getByRole('region', { name: 'Prospect created' });
  await banner.getByRole('button', { name: 'Copy link' }).click();
  await expect(banner.getByText('Copied')).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(URL1);
});

test('without a clipboard API the copy button shows the link to copy by hand', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
  });
  await fillAndCreate(page, NAME);
  const banner = page.getByRole('region', { name: 'Prospect created' });
  await banner.getByRole('button', { name: 'Copy link' }).click();
  await expect(banner.getByText(/Copying is not available here/)).toBeVisible();
  await expect(banner.getByLabel('Link to copy')).toHaveValue(URL1);
});

test('the admin index links to the prospect list', async ({ page }) => {
  await page.goto('/admin');
  await page.getByRole('link', { name: 'Prospects' }).click();
  await expect(page).toHaveURL(/\/admin\/prospects$/);
});

test('the prospect pages are not reachable without the Access header', async () => {
  // Plain fetch: Playwright's request fixtures would inherit the header set by test.use above.
  const status = async (path: string, method = 'GET') =>
    (await fetch(`http://localhost:4173${path}`, { method })).status;
  expect(await status('/admin/prospects')).toBe(403);
  expect(await status('/admin/prospects/new')).toBe(403);
  expect(await status('/admin/prospects/new', 'POST')).toBe(403);
  expect(await status('/admin/prospects?/archive', 'POST')).toBe(403);
});
