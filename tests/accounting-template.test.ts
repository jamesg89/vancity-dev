import { expect, test } from '@playwright/test';
import { contrastSweep } from './helpers/contrast';

test('/p/accounting renders the Fraser Ridge showcase', async ({ page }) => {
  await page.goto('/p/accounting');
  await expect(page).toHaveTitle(
    'CPA & Accountant in Vancouver, BC | Tax & Bookkeeping | Fraser Ridge CPA'
  );
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Clear books, lower taxes, and an accountant who actually calls back.'
  );
  await expect(page.locator('.brand-name').first()).toContainText('Fraser Ridge');
  await expect(page.locator('.service')).toHaveCount(6);
  await expect(page.locator('.price')).toHaveCount(3);
  await expect(page.locator('.faqs details')).toHaveCount(6);
  await expect(page.locator('.towns li')).toHaveCount(7);
  await expect(page.locator('.deadline-list li')).toHaveCount(7);
  await expect(page.getByText('CPA — British Columbia').first()).toBeVisible();
  await expect(page.getByText('Sarah Whitcomb', { exact: false }).first()).toBeVisible();
  await expect(page.locator('.rating-score')).toHaveText('4.9');
});

// A Canadian firm must never be shown IRS forms and dates.
test('/p/accounting uses CRA wording throughout', async ({ page }) => {
  await page.goto('/p/accounting');
  const body = await page.locator('body').innerText();
  expect(body).toContain('RRSP contribution deadline');
  expect(body).toContain('T1 personal return');
  expect(body).toContain('CRA Representation');
  expect(body).not.toContain('IRS');
  expect(body).not.toContain('1099');
  expect(body).not.toContain('Social Security');
});

// The showcase has real-looking proof, so it must not be marked up as a sample.
test('/p/accounting carries no sample markers', async ({ page }) => {
  await page.goto('/p/accounting');
  await expect(page.locator('.sample')).toHaveCount(0);
  await expect(page.getByText('Starting at').first()).toBeVisible();
});

test('the pricing toggle switches every price', async ({ page }) => {
  await page.goto('/p/accounting');
  const amounts = page.locator('.price-amount');
  await expect(amounts.first()).toContainText('$450');
  await expect(amounts.first()).toContainText('/month');

  // The radios are visually hidden behind their labels, which is what a visitor clicks.
  await page.locator('label[for="cpa-bill-annual"]').click();
  await expect(amounts.first()).toContainText('$4,500');
  await expect(amounts.first()).toContainText('/year');
  await expect(amounts.nth(2)).toContainText('$24,000');

  await page.locator('label[for="cpa-bill-monthly"]').click();
  await expect(amounts.first()).toContainText('$450');
});

test('the consultation form validates before it thanks you', async ({ page }) => {
  await page.goto('/p/accounting');
  await page.getByRole('button', { name: 'Request a consultation' }).click();
  await expect(page.locator('.field-err').first()).toBeVisible();
  await expect(page.locator('.form-status.is-error')).toBeVisible();

  await page.getByRole('textbox', { name: 'Your name' }).fill('Dana Reyes');
  await page.getByRole('textbox', { name: 'Email' }).fill('dana@example.com');
  await page.getByRole('combobox', { name: 'I’m a…' }).selectOption('Business owner');
  await page
    .getByRole('textbox', { name: 'How can we help?' })
    .fill('Two years behind on the books.');
  await page.getByRole('button', { name: 'Request a consultation' }).click();

  await expect(page.locator('.thanks-head')).toContainText('Thanks, Dana');
  await expect(page.locator('.thanks-body')).toContainText('dana@example.com');
});

test('a typed phone number still has to be dialable', async ({ page }) => {
  await page.goto('/p/accounting');
  await page.getByRole('textbox', { name: 'Your name' }).fill('Dana Reyes');
  await page.getByRole('textbox', { name: 'Email' }).fill('dana@example.com');
  await page.getByRole('textbox', { name: /^Phone/ }).fill('555');
  await page.getByRole('combobox', { name: 'I’m a…' }).selectOption('Business owner');
  await page.getByRole('textbox', { name: 'How can we help?' }).fill('Hello.');
  await page.getByRole('button', { name: 'Request a consultation' }).click();
  await expect(page.getByText(/Enter a number with area code/)).toBeVisible();
  await expect(page.locator('.thanks-head')).toHaveCount(0);
});

test('/p/accounting has no failing-contrast anchors', async ({ page }) => {
  await page.goto('/p/accounting');
  expect(await page.evaluate(contrastSweep)).toEqual([]);
});

// .mobile-bar and the hamburger are display:none above 899px, so the desktop sweep skips
// them. This is the viewport where they actually exist.
test('/p/accounting works and passes contrast at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/p/accounting');
  await expect(page.locator('.mobile-bar-book')).toBeVisible();

  const burger = page.getByRole('button', { name: 'Menu' });
  await expect(burger).toHaveAttribute('aria-expanded', 'false');
  await burger.click();
  await expect(burger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#cpa-menu')).toBeVisible();

  expect(await page.evaluate(contrastSweep)).toEqual([]);
});

test('no horizontal scroll at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/p/accounting');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('/p is unaffected by the second template', async ({ page }) => {
  await page.goto('/p');
  await expect(page.locator('.brand-name')).toContainText('Octopus');
});
