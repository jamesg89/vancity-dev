import { expect, test } from '@playwright/test';

test('demo banner is visible at /demo/waterstcafe', async ({ page }) => {
  await page.goto('/demo/waterstcafe');
  await expect(page.locator('.demo-banner')).toBeVisible();
});

test('demo banner shows client name', async ({ page }) => {
  await page.goto('/demo/waterstcafe');
  await expect(page.locator('.demo-banner')).toContainText('Water St. Café');
});

test('demo banner has 3 variant buttons', async ({ page }) => {
  await page.goto('/demo/waterstcafe');
  await expect(page.locator('.variant-btn')).toHaveCount(3);
});

test('variant A is active by default', async ({ page }) => {
  await page.goto('/demo/waterstcafe');
  await expect(page.locator('.variant-btn[data-active="true"]')).toContainText('A');
});

test('clicking variant B updates URL to ?v=b', async ({ page }) => {
  await page.goto('/demo/waterstcafe');
  await page.locator('.variant-btn').nth(1).click();
  await expect(page).toHaveURL(/\?v=b/);
});

test('loading with ?v=b shows B as active', async ({ page }) => {
  await page.goto('/demo/waterstcafe?v=b');
  await expect(page.locator('.variant-btn[data-active="true"]')).toContainText('B');
});

test('demo page shows Water St. Café content', async ({ page }) => {
  await page.goto('/demo/waterstcafe');
  await expect(page.getByRole('heading', { name: /Water St/i })).toBeVisible();
});

test('variant B has different --bg than variant A', async ({ page }) => {
  await page.goto('/demo/waterstcafe');
  const bgA = await page.evaluate(() =>
    getComputedStyle(document.querySelector<HTMLElement>('.demo-root')!).getPropertyValue('--bg').trim()
  );
  await page.goto('/demo/waterstcafe?v=b');
  const bgB = await page.evaluate(() =>
    getComputedStyle(document.querySelector<HTMLElement>('.demo-root')!).getPropertyValue('--bg').trim()
  );
  expect(bgA).not.toBe(bgB);
});
