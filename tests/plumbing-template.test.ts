import { expect, test } from '@playwright/test';
import { contrastSweep } from './helpers/contrast';

test('/p renders the Octopus showcase unchanged', async ({ page }) => {
  await page.goto('/p');
  await expect(page).toHaveTitle('Plumber in Vancouver, BC | 24/7 Emergency Plumbing | Octopus Plumbing');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Fast, Honest Plumbing in Vancouver, BC');
  await expect(page.locator('.brand-name')).toContainText('Octopus');
  await expect(page.locator('.towns li')).toHaveCount(8);
  await expect(page.locator('.service-card')).toHaveCount(8);
  await expect(page.locator('.faqs details')).toHaveCount(6);
  await expect(page.getByText('Lic. #PL-204871').first()).toBeVisible();
  await expect(page.locator('a[href="/p/drain-cleaning"]').first()).toBeAttached();
  await expect(page.getByText('612+').first()).toBeVisible();
  await expect(page.getByText('17+').first()).toBeVisible();
});

test('/p has no failing-contrast anchors', async ({ page }) => {
  await page.goto('/p');
  expect(await page.evaluate(contrastSweep)).toEqual([]);
});
