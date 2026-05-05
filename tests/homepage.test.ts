import { expect, test } from '@playwright/test';

test('page has correct title', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle('Vancity Dev — Bespoke websites, made in Vancouver');
});

test('body uses cream background', async ({ page }) => {
	await page.goto('/');
	const bg = await page.evaluate(() =>
		getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
	);
	expect(bg).toBe('#f4f1ea');
});
