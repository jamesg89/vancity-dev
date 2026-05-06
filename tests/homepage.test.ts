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

test('nav has logo and links', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('link', { name: /Vancity.*Dev/i })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Work', exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Pricing', exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: 'About', exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
	await expect(page.getByText('Booking projects · Q3')).toBeVisible();
});

test('hero has headline and CTAs', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('VANCOUVER, BC · EST. 2019')).toBeVisible();
	await expect(page.getByRole('heading', { level: 1 })).toContainText('Bespoke websites');
	await expect(page.getByRole('link', { name: /See pricing/i })).toBeVisible();
	await expect(page.getByRole('link', { name: /Recent work/i })).toBeVisible();
});

test('landscape illustration is rendered', async ({ page }) => {
	await page.goto('/');
	const svg = page.locator('.landscape-svg');
	await expect(svg).toBeVisible();
});

test('marquee ticker is present', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('HAND-CODED SINCE 2019')).toBeVisible();
});

test('work section shows 6 projects', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Selected projects.' })).toBeVisible();
	await expect(page.getByText('Coastline Coffee Roasters')).toBeVisible();
	await expect(page.getByText('Howe Sound Outfitters')).toBeVisible();
});

test('pricing section shows both plans', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Honest, fixed pricing.' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Standard Custom' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Pro Custom' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Start a project' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Book a free consult' })).toBeVisible();
});

test('about section shows bio and stats', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'A studio of one.' })).toBeVisible();
	await expect(page.getByText('James Goodwin')).toBeVisible();
	await expect(page.getByText('East Vancouver, BC')).toBeVisible();
});

test('contact section and footer render', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: "Let's build" })).toBeVisible();
	await expect(page.getByText('hello@vancitydev.ca')).toBeVisible();
	await expect(page.getByText('Booking projects starting Q3 2026')).toBeVisible();
	await expect(page.getByText('© 2026 Vancity Dev')).toBeVisible();
});
