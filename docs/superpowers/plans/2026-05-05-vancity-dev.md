# Vancity Dev Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a SvelteKit SSR site for Vancity Dev, implement the full design, push to GitHub, deploy on Cloudflare Workers with auto-rebuild, and connect the `vancity.dev` custom domain.

**Architecture:** Single `+page.svelte` for all page content (hero through contact), `+layout.svelte` wraps nav and footer around it. Each section is its own `src/lib/components/*.svelte` file. Global design tokens and resets live in `src/app.css`. Fonts loaded from Google Fonts in `app.html`.

**Tech Stack:** SvelteKit 2 + Svelte 5, TypeScript, `@sveltejs/adapter-cloudflare-workers`, Wrangler, Playwright (e2e), GitHub CLI (`gh`), Cloudflare Workers Builds

---

## File Map

| File | Responsibility |
|---|---|
| `src/app.html` | HTML shell — Google Fonts links |
| `src/app.css` | CSS custom properties, reset, typography base |
| `src/routes/+layout.svelte` | Nav + slot + footer |
| `src/routes/+page.svelte` | Imports and renders all section components |
| `src/lib/components/NavBar.svelte` | Logo, nav links, booking pill |
| `src/lib/components/HeroSection.svelte` | Eyebrow, H1, body, CTAs, geo tag |
| `src/lib/components/LandscapeIllustration.svelte` | Inline SVG landscape |
| `src/lib/components/MarqueeTicker.svelte` | Scrolling marquee strip |
| `src/lib/components/WorkSection.svelte` | 6 numbered projects |
| `src/lib/components/PricingSection.svelte` | Plan A + Plan B cards |
| `src/lib/components/AboutSection.svelte` | Bio + stat grid |
| `src/lib/components/ContactSection.svelte` | Email, phone, social, NOW block |
| `src/lib/components/SiteFooter.svelte` | Copyright, land acknowledgement |
| `svelte.config.js` | adapter-cloudflare-workers |
| `wrangler.toml` | Worker name, entry point, compatibility |
| `tests/homepage.test.ts` | Playwright e2e — all sections |

---

## Task 1: Scaffold SvelteKit project

**Files:**
- Create: entire project scaffold in current directory

- [ ] **Step 1: Run sv create**

In `C:\Users\User\Documents\2A SVELTEKIT WEB DEV\Vancity Dev`, run:

```bash
npx sv create .
```

When prompted, select:
- **Template**: Skeleton project
- **Type checking**: TypeScript
- **Add-ons**: Select ESLint, Prettier, Playwright

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```

Expected: `Local: http://localhost:5173` with no errors. Kill with Ctrl+C.

- [ ] **Step 4: Commit scaffold**

```bash
git add -A
git commit -m "chore: scaffold sveltekit skeleton"
```

---

## Task 2: Install and configure Cloudflare Workers adapter

**Files:**
- Modify: `svelte.config.js`
- Create: `wrangler.toml`

- [ ] **Step 1: Install adapter**

```bash
npm install -D @sveltejs/adapter-cloudflare-workers wrangler
```

- [ ] **Step 2: Update svelte.config.js**

Replace the entire file:

```js
import adapter from '@sveltejs/adapter-cloudflare-workers';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter()
	}
};

export default config;
```

- [ ] **Step 3: Create wrangler.toml**

Create at project root:

```toml
name = "vancity-dev"
main = ".svelte-kit/cloudflare-workers/index.js"
compatibility_date = "2026-05-05"
compatibility_flags = ["nodejs_compat"]

[site]
bucket = ".svelte-kit/cloudflare-workers"
```

- [ ] **Step 4: Verify build succeeds**

```bash
npm run build
```

Expected: Build completes, `.svelte-kit/cloudflare-workers/index.js` exists.

```bash
ls .svelte-kit/cloudflare-workers/
```

- [ ] **Step 5: Commit**

```bash
git add svelte.config.js wrangler.toml package.json package-lock.json
git commit -m "chore: configure adapter-cloudflare-workers"
```

---

## Task 3: Set up design tokens, fonts, and global CSS

**Files:**
- Modify: `src/app.html`
- Modify: `src/app.css` (create if absent)

- [ ] **Step 1: Write the Playwright test for page metadata**

Replace contents of `tests/homepage.test.ts`:

```ts
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
```

- [ ] **Step 2: Update src/app.html**

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="description" content="Bespoke websites, handcrafted and fast. One-person studio building custom websites for businesses across Vancouver and the Lower Mainland." />
		<title>Vancity Dev — Bespoke websites, made in Vancouver</title>
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
		<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Inter:ital,opsz,wght@0,14..32,300..600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

- [ ] **Step 3: Create src/app.css**

```css
:root {
	--bg: #f4f1ea;
	--paper: color-mix(in oklab, #f4f1ea 92%, #1a2a26 8%);
	--ink: #1a2a26;
	--ink-soft: #43534f;
	--accent: #2d4f3f;
	--accent2: #3a6a85;
	--warm: #c97a4a;
	--line: color-mix(in oklab, #1a2a26 14%, transparent);
	--serif: 'Fraunces', Georgia, serif;
	--sans: 'Inter', system-ui, sans-serif;
	--mono: 'JetBrains Mono', ui-monospace, monospace;
}

*,
*::before,
*::after {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

html {
	scroll-behavior: smooth;
}

body {
	background: var(--bg);
	color: var(--ink);
	font-family: var(--sans);
	line-height: 1.6;
	-webkit-font-smoothing: antialiased;
}

a {
	color: inherit;
	text-decoration: none;
}

img,
svg {
	display: block;
	max-width: 100%;
}
```

- [ ] **Step 4: Import app.css in +layout.svelte**

Replace `src/routes/+layout.svelte` contents:

```svelte
<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}
```

- [ ] **Step 5: Run tests**

```bash
npx playwright test tests/homepage.test.ts
```

Expected: 2 tests pass (title + CSS var).

- [ ] **Step 6: Commit**

```bash
git add src/app.html src/app.css src/routes/+layout.svelte tests/homepage.test.ts
git commit -m "feat: design tokens, fonts, global reset"
```

---

## Task 4: NavBar component

**Files:**
- Create: `src/lib/components/NavBar.svelte`
- Modify: `src/routes/+layout.svelte`
- Modify: `tests/homepage.test.ts`

- [ ] **Step 1: Add Playwright test for nav**

Append to `tests/homepage.test.ts`:

```ts
test('nav has logo and links', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('link', { name: /Vancity.*Dev/i })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Work' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Pricing' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
	await expect(page.getByText('Booking projects · Q3')).toBeVisible();
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npx playwright test tests/homepage.test.ts --grep "nav has logo"
```

Expected: FAIL — elements not found.

- [ ] **Step 3: Create src/lib/components/NavBar.svelte**

```svelte
<nav>
	<a href="/" class="logo">
		<span class="logo-vancity">Vancity</span><span class="logo-dev">Dev</span>
	</a>

	<ul class="nav-links">
		<li><a href="#work">Work</a></li>
		<li><a href="#pricing">Pricing</a></li>
		<li><a href="#about">About</a></li>
		<li><a href="#contact">Contact</a></li>
	</ul>

	<a href="#contact" class="booking-pill">Booking projects · Q3</a>
</nav>

<style>
	nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.1rem 2.5rem;
		background: var(--bg);
		border-bottom: 1px solid var(--line);
	}

	.logo {
		font-family: var(--serif);
		font-style: italic;
		font-weight: 500;
		font-size: 1.15rem;
		letter-spacing: -0.01em;
	}

	.logo-vancity {
		color: var(--ink);
	}

	.logo-dev {
		color: var(--accent);
	}

	.nav-links {
		display: flex;
		gap: 2rem;
		list-style: none;
	}

	.nav-links a {
		font-family: var(--sans);
		font-size: 0.875rem;
		color: var(--ink-soft);
		transition: color 0.15s;
	}

	.nav-links a:hover {
		color: var(--ink);
	}

	.booking-pill {
		font-family: var(--mono);
		font-size: 0.75rem;
		background: var(--ink);
		color: var(--bg);
		padding: 0.45rem 1rem;
		border-radius: 9999px;
		letter-spacing: 0.01em;
		transition: background 0.15s;
	}

	.booking-pill:hover {
		background: var(--accent);
	}

	@media (max-width: 640px) {
		.nav-links {
			display: none;
		}

		nav {
			padding: 1rem 1.25rem;
		}
	}
</style>
```

- [ ] **Step 4: Add NavBar to +layout.svelte**

```svelte
<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/components/NavBar.svelte';
	let { children } = $props();
</script>

<NavBar />
<main>
	{@render children()}
</main>
```

- [ ] **Step 5: Run test to confirm it passes**

```bash
npx playwright test tests/homepage.test.ts --grep "nav has logo"
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/NavBar.svelte src/routes/+layout.svelte tests/homepage.test.ts
git commit -m "feat: navbar with logo, links, booking pill"
```

---

## Task 5: HeroSection component

**Files:**
- Create: `src/lib/components/HeroSection.svelte`
- Modify: `src/routes/+page.svelte`
- Modify: `tests/homepage.test.ts`

- [ ] **Step 1: Add Playwright test**

Append to `tests/homepage.test.ts`:

```ts
test('hero has headline and CTAs', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('VANCOUVER, BC · EST. 2019')).toBeVisible();
	await expect(page.getByRole('heading', { level: 1 })).toContainText('Bespoke websites');
	await expect(page.getByRole('link', { name: /See pricing/i })).toBeVisible();
	await expect(page.getByRole('link', { name: /Recent work/i })).toBeVisible();
});
```

- [ ] **Step 2: Run to confirm fail**

```bash
npx playwright test tests/homepage.test.ts --grep "hero has headline"
```

Expected: FAIL.

- [ ] **Step 3: Create src/lib/components/HeroSection.svelte**

```svelte
<section class="hero">
	<p class="eyebrow">VANCOUVER, BC · EST. 2019</p>

	<h1>
		<span class="upright">Bespoke websites,</span>
		<span class="italic">handcrafted &amp; yours.</span>
	</h1>

	<p class="body-copy">
		I'm James — a one-person studio building custom, fast, honestly-priced websites for businesses
		across the Lower Mainland. No templates. No bloated builders. Just careful code, considered
		design.
	</p>

	<div class="ctas">
		<a href="#pricing" class="cta-primary">See pricing →</a>
		<a href="#work" class="cta-secondary">Recent work</a>
	</div>

	<p class="geo">49.2827° N &nbsp;&nbsp; 123.1207° W</p>
</section>

<style>
	.hero {
		padding: 10rem 2.5rem 4rem;
		max-width: 900px;
	}

	.eyebrow {
		font-family: var(--mono);
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		color: var(--ink-soft);
		margin-bottom: 1.5rem;
		text-transform: uppercase;
	}

	h1 {
		font-family: var(--serif);
		font-size: clamp(3.5rem, 8vw, 6.5rem);
		line-height: 1.05;
		letter-spacing: -0.03em;
		color: var(--ink);
		margin-bottom: 1.75rem;
		font-weight: 400;
	}

	.upright {
		display: block;
		font-style: normal;
	}

	.italic {
		display: block;
		font-style: italic;
	}

	.body-copy {
		font-size: 1.05rem;
		color: var(--ink-soft);
		max-width: 520px;
		line-height: 1.7;
		margin-bottom: 2.5rem;
	}

	.ctas {
		display: flex;
		align-items: center;
		gap: 1.75rem;
		margin-bottom: 3rem;
	}

	.cta-primary {
		background: var(--warm);
		color: #fff;
		font-family: var(--sans);
		font-size: 0.9rem;
		font-weight: 500;
		padding: 0.75rem 1.5rem;
		border-radius: 9999px;
		transition: background 0.15s;
	}

	.cta-primary:hover {
		background: color-mix(in oklab, var(--warm) 85%, black);
	}

	.cta-secondary {
		font-family: var(--sans);
		font-size: 0.9rem;
		color: var(--ink);
		border-bottom: 1px solid var(--line);
		padding-bottom: 1px;
		transition: color 0.15s;
	}

	.cta-secondary:hover {
		color: var(--accent);
	}

	.geo {
		font-family: var(--mono);
		font-size: 0.7rem;
		color: var(--ink-soft);
		letter-spacing: 0.05em;
		opacity: 0.6;
	}

	@media (max-width: 640px) {
		.hero {
			padding: 7rem 1.25rem 3rem;
		}
	}
</style>
```

- [ ] **Step 4: Update src/routes/+page.svelte**

```svelte
<script lang="ts">
	import HeroSection from '$lib/components/HeroSection.svelte';
</script>

<HeroSection />
```

- [ ] **Step 5: Run test**

```bash
npx playwright test tests/homepage.test.ts --grep "hero has headline"
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/HeroSection.svelte src/routes/+page.svelte tests/homepage.test.ts
git commit -m "feat: hero section"
```

---

## Task 6: LandscapeIllustration component

**Files:**
- Create: `src/lib/components/LandscapeIllustration.svelte`
- Modify: `src/routes/+page.svelte`
- Modify: `tests/homepage.test.ts`

- [ ] **Step 1: Add Playwright test**

Append to `tests/homepage.test.ts`:

```ts
test('landscape illustration is rendered', async ({ page }) => {
	await page.goto('/');
	const svg = page.locator('.landscape-svg');
	await expect(svg).toBeVisible();
});
```

- [ ] **Step 2: Run to confirm fail**

```bash
npx playwright test tests/homepage.test.ts --grep "landscape illustration"
```

Expected: FAIL.

- [ ] **Step 3: Create src/lib/components/LandscapeIllustration.svelte**

```svelte
<div class="landscape-wrap">
	<svg
		class="landscape-svg"
		viewBox="0 0 1200 400"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<!-- Sky -->
		<rect width="1200" height="400" fill="#f4f1ea" />

		<!-- Sun -->
		<circle cx="600" cy="180" r="90" fill="#c97a4a" opacity="0.9" />

		<!-- Mountain ridge — blue layer -->
		<path
			d="M0 310 L0 260 L120 230 L260 250 L400 210 L560 240 L720 200 L880 235 L1040 205 L1200 240 L1200 400 L0 400 Z"
			fill="#3a6a85"
			opacity="0.55"
		/>

		<!-- Mountain ridge — forest layer -->
		<path
			d="M0 350 L0 290 L150 270 L320 290 L460 255 L620 285 L780 250 L940 280 L1100 255 L1200 275 L1200 400 L0 400 Z"
			fill="#2d4f3f"
		/>
	</svg>
</div>

<style>
	.landscape-wrap {
		width: 100%;
		overflow: hidden;
		line-height: 0;
	}

	.landscape-svg {
		width: 100%;
		height: auto;
		display: block;
	}
</style>
```

- [ ] **Step 4: Add to +page.svelte**

```svelte
<script lang="ts">
	import HeroSection from '$lib/components/HeroSection.svelte';
	import LandscapeIllustration from '$lib/components/LandscapeIllustration.svelte';
</script>

<HeroSection />
<LandscapeIllustration />
```

- [ ] **Step 5: Run test**

```bash
npx playwright test tests/homepage.test.ts --grep "landscape illustration"
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/LandscapeIllustration.svelte src/routes/+page.svelte tests/homepage.test.ts
git commit -m "feat: landscape SVG illustration"
```

---

## Task 7: MarqueeTicker component

**Files:**
- Create: `src/lib/components/MarqueeTicker.svelte`
- Modify: `src/routes/+page.svelte`
- Modify: `tests/homepage.test.ts`

- [ ] **Step 1: Add Playwright test**

Append to `tests/homepage.test.ts`:

```ts
test('marquee ticker is present', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('HAND-CODED SINCE 2019')).toBeVisible();
});
```

- [ ] **Step 2: Run to confirm fail**

```bash
npx playwright test tests/homepage.test.ts --grep "marquee ticker"
```

Expected: FAIL.

- [ ] **Step 3: Create src/lib/components/MarqueeTicker.svelte**

```svelte
<div class="ticker-wrap" aria-hidden="true">
	<div class="ticker-track">
		<span class="ticker-content">
			HAND-CODED SINCE 2019 &nbsp;·&nbsp; LIGHTHOUSE 95+ ON EVERY BUILD &nbsp;·&nbsp; LOCAL ·
			VANCOUVER, BC &nbsp;·&nbsp; NO PAGE BUILDERS. NO BLOAT. &nbsp;·&nbsp; THREE PROPOSALS. FIVE
			EDITS. &nbsp;·&nbsp; FIXED PRICING. NO SURPRISES. &nbsp;&nbsp;&nbsp;
		</span>
		<span class="ticker-content" aria-hidden="true">
			HAND-CODED SINCE 2019 &nbsp;·&nbsp; LIGHTHOUSE 95+ ON EVERY BUILD &nbsp;·&nbsp; LOCAL ·
			VANCOUVER, BC &nbsp;·&nbsp; NO PAGE BUILDERS. NO BLOAT. &nbsp;·&nbsp; THREE PROPOSALS. FIVE
			EDITS. &nbsp;·&nbsp; FIXED PRICING. NO SURPRISES. &nbsp;&nbsp;&nbsp;
		</span>
	</div>
</div>

<style>
	.ticker-wrap {
		width: 100%;
		overflow: hidden;
		border-top: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
		padding: 0.6rem 0;
		background: var(--paper);
	}

	.ticker-track {
		display: flex;
		width: max-content;
		animation: scroll 28s linear infinite;
	}

	.ticker-content {
		font-family: var(--mono);
		font-size: 0.65rem;
		letter-spacing: 0.1em;
		color: var(--ink-soft);
		white-space: nowrap;
		padding-right: 2rem;
	}

	@keyframes scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ticker-track {
			animation: none;
		}
	}
</style>
```

- [ ] **Step 4: Add to +page.svelte**

```svelte
<script lang="ts">
	import HeroSection from '$lib/components/HeroSection.svelte';
	import LandscapeIllustration from '$lib/components/LandscapeIllustration.svelte';
	import MarqueeTicker from '$lib/components/MarqueeTicker.svelte';
</script>

<HeroSection />
<LandscapeIllustration />
<MarqueeTicker />
```

- [ ] **Step 5: Run test**

```bash
npx playwright test tests/homepage.test.ts --grep "marquee ticker"
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/MarqueeTicker.svelte src/routes/+page.svelte tests/homepage.test.ts
git commit -m "feat: marquee ticker strip"
```

---

## Task 8: WorkSection component

**Files:**
- Create: `src/lib/components/WorkSection.svelte`
- Modify: `src/routes/+page.svelte`
- Modify: `tests/homepage.test.ts`

- [ ] **Step 1: Add Playwright test**

Append to `tests/homepage.test.ts`:

```ts
test('work section shows 6 projects', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Selected projects.' })).toBeVisible();
	await expect(page.getByText('Coastline Coffee Roasters')).toBeVisible();
	await expect(page.getByText('Howe Sound Outfitters')).toBeVisible();
});
```

- [ ] **Step 2: Run to confirm fail**

```bash
npx playwright test tests/homepage.test.ts --grep "work section"
```

Expected: FAIL.

- [ ] **Step 3: Create src/lib/components/WorkSection.svelte**

```svelte
<section id="work" class="work-section">
	<p class="section-label">— 01 / Work</p>
	<h2>Selected projects.</h2>
	<p class="section-intro">
		A small slice of recent work — independent shops, local makers, and a few ambitious teams. Every
		site below was hand-built, start to finish.
	</p>

	<ol class="project-list">
		{#each projects as project, i}
			<li class="project-row">
				<span class="project-num">0{i + 1}</span>
				<span class="project-name">{project.name}</span>
				<span class="project-tags">{project.tags}</span>
				<span class="project-year">{project.year}</span>
			</li>
		{/each}
	</ol>
</section>

<script lang="ts">
	const projects = [
		{ name: 'Coastline Coffee Roasters', tags: 'E-COMMERCE · HEADLESS', year: '2025' },
		{ name: 'Mount Seymour Trail Co.', tags: 'BRANDING · MARKETING SITE', year: '2025' },
		{ name: 'Granville Island Studio', tags: 'PORTFOLIO · CMS', year: '2024' },
		{ name: 'False Creek Architecture', tags: 'CUSTOM BUILD · API', year: '2024' },
		{ name: 'Kitsilano Wellness Co-op', tags: 'BOOKING · STRIPE', year: '2024' },
		{ name: 'Howe Sound Outfitters', tags: 'E-COMMERCE · CUSTOM CMS', year: '2023' }
	];
</script>

<style>
	.work-section {
		padding: 6rem 2.5rem;
		max-width: 960px;
		margin: 0 auto;
	}

	.section-label {
		font-family: var(--mono);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		color: var(--ink-soft);
		margin-bottom: 1rem;
	}

	h2 {
		font-family: var(--serif);
		font-size: clamp(2.2rem, 4vw, 3.5rem);
		font-weight: 400;
		letter-spacing: -0.02em;
		margin-bottom: 1.25rem;
	}

	.section-intro {
		font-size: 1rem;
		color: var(--ink-soft);
		max-width: 520px;
		line-height: 1.7;
		margin-bottom: 3rem;
	}

	.project-list {
		list-style: none;
		border-top: 1px solid var(--line);
	}

	.project-row {
		display: grid;
		grid-template-columns: 2rem 1fr auto auto;
		align-items: baseline;
		gap: 1.5rem;
		padding: 1.25rem 0;
		border-bottom: 1px solid var(--line);
		transition: background 0.15s;
	}

	.project-row:hover {
		background: var(--paper);
	}

	.project-num {
		font-family: var(--mono);
		font-size: 0.68rem;
		color: var(--ink-soft);
	}

	.project-name {
		font-family: var(--serif);
		font-size: 1.35rem;
		font-weight: 400;
		letter-spacing: -0.01em;
	}

	.project-tags {
		font-family: var(--mono);
		font-size: 0.62rem;
		letter-spacing: 0.08em;
		color: var(--ink-soft);
	}

	.project-year {
		font-family: var(--mono);
		font-size: 0.68rem;
		color: var(--ink-soft);
		opacity: 0.6;
	}

	@media (max-width: 640px) {
		.work-section {
			padding: 4rem 1.25rem;
		}

		.project-row {
			grid-template-columns: 2rem 1fr;
			grid-template-rows: auto auto;
			gap: 0.25rem 1rem;
		}

		.project-tags,
		.project-year {
			grid-column: 2;
		}
	}
</style>
```

- [ ] **Step 4: Add to +page.svelte**

```svelte
<script lang="ts">
	import HeroSection from '$lib/components/HeroSection.svelte';
	import LandscapeIllustration from '$lib/components/LandscapeIllustration.svelte';
	import MarqueeTicker from '$lib/components/MarqueeTicker.svelte';
	import WorkSection from '$lib/components/WorkSection.svelte';
</script>

<HeroSection />
<LandscapeIllustration />
<MarqueeTicker />
<WorkSection />
```

- [ ] **Step 5: Run test**

```bash
npx playwright test tests/homepage.test.ts --grep "work section"
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/WorkSection.svelte src/routes/+page.svelte tests/homepage.test.ts
git commit -m "feat: work section with 6 projects"
```

---

## Task 9: PricingSection component

**Files:**
- Create: `src/lib/components/PricingSection.svelte`
- Modify: `src/routes/+page.svelte`
- Modify: `tests/homepage.test.ts`

- [ ] **Step 1: Add Playwright test**

Append to `tests/homepage.test.ts`:

```ts
test('pricing section shows both plans', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Honest, fixed pricing.' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Standard Custom' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Pro Custom' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Start a project' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Book a free consult' })).toBeVisible();
});
```

- [ ] **Step 2: Run to confirm fail**

```bash
npx playwright test tests/homepage.test.ts --grep "pricing section"
```

Expected: FAIL.

- [ ] **Step 3: Create src/lib/components/PricingSection.svelte**

```svelte
<section id="pricing" class="pricing-section">
	<p class="section-label">— 02 / Pricing</p>
	<h2>Honest, fixed pricing.</h2>
	<p class="section-intro">
		Two ways to work together. Standard covers most marketing sites and small shops. Pro is for when
		you need custom logic, integrations, or a real backend.
	</p>

	<div class="plans">
		<!-- Plan A -->
		<div class="plan plan-a">
			<p class="plan-label">PLAN A · MOST PROJECTS</p>
			<h3>Standard Custom</h3>
			<div class="price">
				<span class="price-amount">$1,200</span>
				<span class="price-cadence">one-time</span>
			</div>

			<ul class="features">
				{#each planAFeatures as f}
					<li>✓ {f}</li>
				{/each}
			</ul>

			<div class="hosting">
				<p class="hosting-label">ONGOING HOSTING · PICK ONE</p>
				<div class="hosting-options">
					<div><strong>$25 / mo</strong><span>Simple hosting — manage yourself</span></div>
					<div><strong>$150 / mo</strong><span>Complete management — email, forms, support, security</span></div>
				</div>
			</div>

			<a href="#contact" class="plan-cta plan-cta-light">Start a project →</a>
		</div>

		<!-- Plan B -->
		<div class="plan plan-b">
			<div class="plan-b-header">
				<p class="plan-label">PLAN B · ADVANCED BUILDS</p>
				<span class="badge">MOST POPULAR</span>
			</div>
			<h3>Pro Custom</h3>
			<div class="price">
				<span class="price-amount">$3,000</span>
				<span class="price-modifier">++</span>
				<span class="price-cadence">from — scope dependent</span>
			</div>

			<ul class="features">
				{#each planBFeatures as f}
					<li>✓ {f}</li>
				{/each}
			</ul>

			<div class="hosting">
				<p class="hosting-label">ONGOING HOSTING · PICK ONE</p>
				<div class="hosting-options">
					<div><strong>$25 / mo</strong><span>Simple hosting — manage yourself</span></div>
					<div><strong>$150 / mo</strong><span>Complete management — email, forms, support, security</span></div>
				</div>
			</div>

			<a href="#contact" class="plan-cta plan-cta-dark">Book a free consult →</a>
		</div>
	</div>

	<p class="fine-print">// All prices in CAD. GST extra. 50% deposit, 50% on launch.</p>
	<a href="#contact" class="soft-cta">Not sure which? — tell me about your project →</a>
</section>

<script lang="ts">
	const planAFeatures = [
		'Fully custom, cutting-edge tech website',
		'Bespoke design process, three written proposals',
		'Five rounds of design edits, no surprises',
		'Hand-coded — no bloated page builders',
		'Performance budget: sub-1.5s LCP, 95+ Lighthouse',
		'Accessibility (WCAG AA) baked in',
		'Mobile-first responsive, every breakpoint',
		'On-page SEO + sitemap + structured data'
	];

	const planBFeatures = [
		'Everything in Standard Custom',
		'Custom API + database integrations',
		'Headless CMS or admin dashboard',
		'Booking, payments, member areas',
		'Third-party platform connections',
		'Free 30-min scoping consultation'
	];
</script>

<style>
	.pricing-section {
		padding: 6rem 2.5rem;
		background: var(--paper);
	}

	.section-label {
		font-family: var(--mono);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		color: var(--ink-soft);
		margin-bottom: 1rem;
		max-width: 960px;
		margin-left: auto;
		margin-right: auto;
	}

	h2 {
		font-family: var(--serif);
		font-size: clamp(2.2rem, 4vw, 3.5rem);
		font-weight: 400;
		letter-spacing: -0.02em;
		margin-bottom: 1.25rem;
		max-width: 960px;
		margin-left: auto;
		margin-right: auto;
	}

	.section-intro {
		font-size: 1rem;
		color: var(--ink-soft);
		max-width: 520px;
		line-height: 1.7;
		margin-bottom: 3rem;
		margin-left: auto;
		margin-right: auto;
	}

	.plans {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		max-width: 960px;
		margin: 0 auto 2rem;
	}

	.plan {
		border-radius: 12px;
		padding: 2.5rem;
	}

	.plan-a {
		background: var(--bg);
		border: 1px solid var(--line);
	}

	.plan-b {
		background: var(--accent);
		color: #fff;
	}

	.plan-label {
		font-family: var(--mono);
		font-size: 0.62rem;
		letter-spacing: 0.1em;
		opacity: 0.6;
		margin-bottom: 0.75rem;
	}

	.plan-b-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.plan-b-header .plan-label {
		margin-bottom: 0;
	}

	.badge {
		font-family: var(--mono);
		font-size: 0.6rem;
		letter-spacing: 0.08em;
		background: var(--warm);
		color: #fff;
		padding: 0.25rem 0.6rem;
		border-radius: 9999px;
	}

	h3 {
		font-family: var(--serif);
		font-size: 2rem;
		font-weight: 400;
		letter-spacing: -0.02em;
		margin-bottom: 1rem;
	}

	.plan-b h3 {
		font-style: italic;
	}

	.price {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		margin-bottom: 1.75rem;
	}

	.price-amount {
		font-family: var(--serif);
		font-size: 2.5rem;
		font-weight: 300;
		letter-spacing: -0.03em;
	}

	.price-modifier {
		font-family: var(--mono);
		font-size: 0.9rem;
		color: var(--warm);
	}

	.price-cadence {
		font-family: var(--mono);
		font-size: 0.68rem;
		opacity: 0.55;
	}

	.features {
		list-style: none;
		margin-bottom: 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.features li {
		font-size: 0.875rem;
		line-height: 1.4;
		opacity: 0.85;
	}

	.plan-a .features li {
		color: var(--ink-soft);
	}

	.hosting {
		margin-bottom: 2rem;
		border-top: 1px solid var(--line);
		padding-top: 1.25rem;
	}

	.plan-b .hosting {
		border-top-color: rgba(255, 255, 255, 0.15);
	}

	.hosting-label {
		font-family: var(--mono);
		font-size: 0.6rem;
		letter-spacing: 0.08em;
		opacity: 0.5;
		margin-bottom: 0.75rem;
	}

	.hosting-options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.hosting-options div {
		display: flex;
		gap: 0.75rem;
		align-items: baseline;
	}

	.hosting-options strong {
		font-family: var(--mono);
		font-size: 0.75rem;
		white-space: nowrap;
	}

	.hosting-options span {
		font-size: 0.78rem;
		opacity: 0.6;
	}

	.plan-cta {
		display: inline-flex;
		align-items: center;
		font-family: var(--sans);
		font-size: 0.875rem;
		font-weight: 500;
		padding: 0.75rem 1.5rem;
		border-radius: 9999px;
		transition: background 0.15s;
	}

	.plan-cta-light {
		background: var(--ink);
		color: var(--bg);
	}

	.plan-cta-light:hover {
		background: var(--accent);
	}

	.plan-cta-dark {
		background: rgba(255, 255, 255, 0.15);
		color: #fff;
		border: 1px solid rgba(255, 255, 255, 0.25);
	}

	.plan-cta-dark:hover {
		background: rgba(255, 255, 255, 0.25);
	}

	.fine-print {
		font-family: var(--mono);
		font-size: 0.65rem;
		color: var(--ink-soft);
		opacity: 0.5;
		text-align: center;
		max-width: 960px;
		margin: 0 auto 1rem;
	}

	.soft-cta {
		display: block;
		text-align: center;
		font-size: 0.875rem;
		color: var(--ink-soft);
		border-bottom: 1px solid var(--line);
		width: max-content;
		margin: 0 auto;
		padding-bottom: 1px;
	}

	.soft-cta:hover {
		color: var(--ink);
	}

	@media (max-width: 768px) {
		.plans {
			grid-template-columns: 1fr;
		}

		.pricing-section {
			padding: 4rem 1.25rem;
		}
	}
</style>
```

- [ ] **Step 4: Add to +page.svelte**

```svelte
<script lang="ts">
	import HeroSection from '$lib/components/HeroSection.svelte';
	import LandscapeIllustration from '$lib/components/LandscapeIllustration.svelte';
	import MarqueeTicker from '$lib/components/MarqueeTicker.svelte';
	import WorkSection from '$lib/components/WorkSection.svelte';
	import PricingSection from '$lib/components/PricingSection.svelte';
</script>

<HeroSection />
<LandscapeIllustration />
<MarqueeTicker />
<WorkSection />
<PricingSection />
```

- [ ] **Step 5: Run test**

```bash
npx playwright test tests/homepage.test.ts --grep "pricing section"
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/PricingSection.svelte src/routes/+page.svelte tests/homepage.test.ts
git commit -m "feat: pricing section with plan A and plan B"
```

---

## Task 10: AboutSection component

**Files:**
- Create: `src/lib/components/AboutSection.svelte`
- Modify: `src/routes/+page.svelte`
- Modify: `tests/homepage.test.ts`

- [ ] **Step 1: Add Playwright test**

Append to `tests/homepage.test.ts`:

```ts
test('about section shows bio and stats', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'A studio of one.' })).toBeVisible();
	await expect(page.getByText('James Goodwin')).toBeVisible();
	await expect(page.getByText('East Vancouver, BC')).toBeVisible();
});
```

- [ ] **Step 2: Run to confirm fail**

```bash
npx playwright test tests/homepage.test.ts --grep "about section"
```

Expected: FAIL.

- [ ] **Step 3: Create src/lib/components/AboutSection.svelte**

```svelte
<section id="about" class="about-section">
	<div class="about-inner">
		<div class="about-text">
			<p class="section-label">— 03 / About</p>
			<h2>A studio of one.</h2>

			<p>
				I'm James Goodwin — a Vancouver-based web developer who builds custom websites for small
				businesses, makers, and independent teams across BC.
			</p>
			<p>
				I work directly with you. No agency layers, no offshore handoffs, no project managers
				translating between us. The person designing your site is the person writing the code, fixing
				the bugs, and picking up the phone three years from now.
			</p>
			<p>
				I've been hand-coding the web since 2014. I think a good website should feel like the place
				it represents — quiet, specific, and built to last longer than a trend.
			</p>

			<dl class="stats">
				{#each stats as stat}
					<div class="stat">
						<dt>{stat.label}</dt>
						<dd>{stat.value}</dd>
					</div>
				{/each}
			</dl>
		</div>

		<div class="portrait-placeholder" aria-hidden="true">
			<span>[ portrait · 4:5 ]</span>
		</div>
	</div>
</section>

<script lang="ts">
	const stats = [
		{ label: 'BASED', value: 'East Vancouver, BC' },
		{ label: 'WORKING SINCE', value: "2014 · independent '19" },
		{ label: 'STACK', value: 'Astro · Next · Stripe · Sanity' },
		{ label: 'CAPACITY', value: '2–3 projects per quarter' }
	];
</script>

<style>
	.about-section {
		padding: 6rem 2.5rem;
		max-width: 960px;
		margin: 0 auto;
	}

	.about-inner {
		display: grid;
		grid-template-columns: 1fr 340px;
		gap: 5rem;
		align-items: start;
	}

	.section-label {
		font-family: var(--mono);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		color: var(--ink-soft);
		margin-bottom: 1rem;
	}

	h2 {
		font-family: var(--serif);
		font-size: clamp(2.2rem, 4vw, 3.5rem);
		font-weight: 400;
		letter-spacing: -0.02em;
		margin-bottom: 2rem;
	}

	.about-text p {
		font-size: 1rem;
		color: var(--ink-soft);
		line-height: 1.75;
		margin-bottom: 1.25rem;
		max-width: 520px;
	}

	.stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		margin-top: 2.5rem;
		padding-top: 2rem;
		border-top: 1px solid var(--line);
	}

	.stat dt {
		font-family: var(--mono);
		font-size: 0.62rem;
		letter-spacing: 0.1em;
		color: var(--ink-soft);
		opacity: 0.6;
		margin-bottom: 0.35rem;
	}

	.stat dd {
		font-family: var(--serif);
		font-size: 1rem;
		font-weight: 400;
	}

	.portrait-placeholder {
		aspect-ratio: 4/5;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.portrait-placeholder span {
		font-family: var(--mono);
		font-size: 0.65rem;
		color: var(--ink-soft);
		opacity: 0.4;
	}

	@media (max-width: 768px) {
		.about-inner {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}

		.portrait-placeholder {
			max-width: 280px;
			order: -1;
		}

		.about-section {
			padding: 4rem 1.25rem;
		}
	}
</style>
```

- [ ] **Step 4: Add to +page.svelte**

```svelte
<script lang="ts">
	import HeroSection from '$lib/components/HeroSection.svelte';
	import LandscapeIllustration from '$lib/components/LandscapeIllustration.svelte';
	import MarqueeTicker from '$lib/components/MarqueeTicker.svelte';
	import WorkSection from '$lib/components/WorkSection.svelte';
	import PricingSection from '$lib/components/PricingSection.svelte';
	import AboutSection from '$lib/components/AboutSection.svelte';
</script>

<HeroSection />
<LandscapeIllustration />
<MarqueeTicker />
<WorkSection />
<PricingSection />
<AboutSection />
```

- [ ] **Step 5: Run test**

```bash
npx playwright test tests/homepage.test.ts --grep "about section"
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/AboutSection.svelte src/routes/+page.svelte tests/homepage.test.ts
git commit -m "feat: about section with bio and stats"
```

---

## Task 11: ContactSection and SiteFooter components

**Files:**
- Create: `src/lib/components/ContactSection.svelte`
- Create: `src/lib/components/SiteFooter.svelte`
- Modify: `src/routes/+layout.svelte`
- Modify: `src/routes/+page.svelte`
- Modify: `tests/homepage.test.ts`

- [ ] **Step 1: Add Playwright test**

Append to `tests/homepage.test.ts`:

```ts
test('contact section and footer render', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: "Let's build" })).toBeVisible();
	await expect(page.getByText('hello@vancitydev.ca')).toBeVisible();
	await expect(page.getByText('Booking projects starting Q3 2026')).toBeVisible();
	await expect(page.getByText('© 2026 Vancity Dev')).toBeVisible();
});
```

- [ ] **Step 2: Run to confirm fail**

```bash
npx playwright test tests/homepage.test.ts --grep "contact section"
```

Expected: FAIL.

- [ ] **Step 3: Create src/lib/components/ContactSection.svelte**

```svelte
<section id="contact" class="contact-section">
	<div class="contact-inner">
		<div class="contact-main">
			<p class="section-label">START A PROJECT</p>
			<h2>Let's build<br />something good.</h2>

			<div class="contact-details">
				<a href="mailto:hello@vancitydev.ca" class="contact-link">hello@vancitydev.ca</a>
				<a href="tel:+16045550199" class="contact-link">+1 (604) 555-0199</a>
			</div>

			<p class="contact-note">
				Most replies within one business day. I'll usually suggest a 30-min video call to scope the
				work.
			</p>
		</div>

		<div class="contact-meta">
			<div class="meta-block">
				<p class="meta-label">STUDIO</p>
				<p>East Vancouver</p>
				<p>British Columbia</p>
				<p class="geo">49.2827° N, 123.1207° W</p>
			</div>

			<div class="meta-block">
				<p class="meta-label">ELSEWHERE</p>
				<ul class="social-links">
					<li><a href="https://www.are.na" target="_blank" rel="noopener">Are.na</a></li>
					<li><a href="https://github.com" target="_blank" rel="noopener">GitHub</a></li>
					<li><a href="https://read.cv" target="_blank" rel="noopener">Read.cv</a></li>
					<li><a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a></li>
				</ul>
			</div>

			<div class="meta-block now-block">
				<p class="meta-label">NOW</p>
				<p>Booking projects starting Q3 2026.</p>
				<p>One Pro slot remaining this quarter.</p>
			</div>
		</div>
	</div>
</section>

<style>
	.contact-section {
		padding: 6rem 2.5rem;
		background: var(--ink);
		color: var(--bg);
	}

	.contact-inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 5rem;
		max-width: 960px;
		margin: 0 auto;
		align-items: start;
	}

	.section-label {
		font-family: var(--mono);
		font-size: 0.62rem;
		letter-spacing: 0.12em;
		opacity: 0.45;
		margin-bottom: 1rem;
	}

	h2 {
		font-family: var(--serif);
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 400;
		letter-spacing: -0.02em;
		line-height: 1.1;
		margin-bottom: 2rem;
	}

	.contact-details {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.contact-link {
		font-family: var(--sans);
		font-size: 1.05rem;
		color: var(--bg);
		border-bottom: 1px solid rgba(244, 241, 234, 0.2);
		width: max-content;
		padding-bottom: 2px;
		transition: border-color 0.15s;
	}

	.contact-link:hover {
		border-color: var(--warm);
		color: var(--warm);
	}

	.contact-note {
		font-size: 0.875rem;
		opacity: 0.5;
		line-height: 1.6;
		max-width: 360px;
	}

	.contact-meta {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		padding-top: 0.5rem;
	}

	.meta-label {
		font-family: var(--mono);
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		opacity: 0.4;
		margin-bottom: 0.6rem;
	}

	.meta-block p {
		font-size: 0.9rem;
		opacity: 0.7;
		line-height: 1.6;
	}

	.geo {
		font-family: var(--mono) !important;
		font-size: 0.65rem !important;
		opacity: 0.35 !important;
		margin-top: 0.25rem;
	}

	.social-links {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.social-links a {
		font-size: 0.9rem;
		opacity: 0.7;
		transition: opacity 0.15s;
	}

	.social-links a:hover {
		opacity: 1;
	}

	.now-block p {
		opacity: 0.7;
	}

	@media (max-width: 768px) {
		.contact-inner {
			grid-template-columns: 1fr;
			gap: 3rem;
		}

		.contact-section {
			padding: 4rem 1.25rem;
		}
	}
</style>
```

- [ ] **Step 4: Create src/lib/components/SiteFooter.svelte**

```svelte
<footer>
	<div class="footer-inner">
		<p class="copyright">© 2026 Vancity Dev · J. Goodwin</p>
		<p class="acknowledgement">
			Built by hand on the unceded territories of the xʷməθkʷəy̓əm, Sḵwx̱wú7mesh, and səlilwətaɬ
			Nations.
		</p>
		<p class="version">v.04 / May 2026</p>
	</div>
</footer>

<style>
	footer {
		background: var(--accent);
		padding: 2rem 2.5rem;
	}

	.footer-inner {
		max-width: 960px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.copyright {
		font-family: var(--mono);
		font-size: 0.68rem;
		color: rgba(244, 241, 234, 0.6);
		letter-spacing: 0.04em;
	}

	.acknowledgement {
		font-size: 0.7rem;
		color: rgba(244, 241, 234, 0.4);
		max-width: 480px;
		line-height: 1.5;
		text-align: center;
	}

	.version {
		font-family: var(--mono);
		font-size: 0.62rem;
		color: rgba(244, 241, 234, 0.3);
		letter-spacing: 0.06em;
	}

	@media (max-width: 640px) {
		.footer-inner {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.acknowledgement {
			text-align: left;
		}

		footer {
			padding: 2rem 1.25rem;
		}
	}
</style>
```

- [ ] **Step 5: Add ContactSection to +page.svelte and SiteFooter to +layout.svelte**

`src/routes/+page.svelte`:

```svelte
<script lang="ts">
	import HeroSection from '$lib/components/HeroSection.svelte';
	import LandscapeIllustration from '$lib/components/LandscapeIllustration.svelte';
	import MarqueeTicker from '$lib/components/MarqueeTicker.svelte';
	import WorkSection from '$lib/components/WorkSection.svelte';
	import PricingSection from '$lib/components/PricingSection.svelte';
	import AboutSection from '$lib/components/AboutSection.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
</script>

<HeroSection />
<LandscapeIllustration />
<MarqueeTicker />
<WorkSection />
<PricingSection />
<AboutSection />
<ContactSection />
```

`src/routes/+layout.svelte`:

```svelte
<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/components/NavBar.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	let { children } = $props();
</script>

<NavBar />
<main>
	{@render children()}
</main>
<SiteFooter />
```

- [ ] **Step 6: Run test**

```bash
npx playwright test tests/homepage.test.ts --grep "contact section"
```

Expected: PASS.

- [ ] **Step 7: Run full test suite**

```bash
npx playwright test tests/homepage.test.ts
```

Expected: All tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/lib/components/ContactSection.svelte src/lib/components/SiteFooter.svelte src/routes/+page.svelte src/routes/+layout.svelte tests/homepage.test.ts
git commit -m "feat: contact section and footer — page complete"
```

---

## Task 12: Create GitHub repo and push

**Files:** none

- [ ] **Step 1: Authenticate GitHub CLI (if not already)**

```bash
gh auth status
```

If not authenticated: `gh auth login` and follow prompts (browser-based).

- [ ] **Step 2: Create GitHub repo**

```bash
gh repo create vancity-dev --public --source=. --remote=origin --push
```

Expected output: `✓ Created repository <username>/vancity-dev on GitHub` and `✓ Pushed commits to github.com/<username>/vancity-dev`

- [ ] **Step 3: Verify**

```bash
gh repo view vancity-dev --web
```

Expected: browser opens to the repo. Confirm all commits are visible.

---

## Task 13: Initial Wrangler deploy

**Files:** none

- [ ] **Step 1: Authenticate Wrangler (if not already)**

```bash
npx wrangler whoami
```

If not authenticated: `npx wrangler login` — opens browser for Cloudflare OAuth.

- [ ] **Step 2: Build the project**

```bash
npm run build
```

Expected: succeeds with no errors.

- [ ] **Step 3: Deploy to Cloudflare Workers**

```bash
npx wrangler deploy
```

Expected output includes:
```
Uploaded vancity-dev (X sec)
Deployed vancity-dev triggers (X sec)
  https://vancity-dev.<your-subdomain>.workers.dev
```

Note the workers.dev URL.

- [ ] **Step 4: Visit the URL and confirm the site loads**

Open `https://vancity-dev.<your-subdomain>.workers.dev` in a browser. Confirm: page loads, nav visible, hero renders, fonts load.

---

## Task 14: Connect Cloudflare Workers Builds (CI/CD)

**Files:** none — configured in Cloudflare dashboard

- [ ] **Step 1: Open Cloudflare dashboard**

Go to `dash.cloudflare.com` → **Workers & Pages** → select **vancity-dev** worker.

- [ ] **Step 2: Open the Builds tab**

Click **Settings** → **Builds** (or the **Builds** tab if visible at top).

- [ ] **Step 3: Connect GitHub**

Click **Connect** → **GitHub** → authorise Cloudflare to access your GitHub account → select the `vancity-dev` repository.

- [ ] **Step 4: Configure build settings**

Set exactly:
- **Branch**: `main`
- **Build command**: `npm run build`
- **Deploy command**: `npx wrangler deploy`
- **Root directory**: `/` (leave blank)

Save.

- [ ] **Step 5: Trigger a test build**

Push a trivial change:

```bash
# In the project directory:
git commit --allow-empty -m "ci: trigger workers builds test"
git push origin main
```

- [ ] **Step 6: Confirm build succeeds in dashboard**

In **Workers & Pages → vancity-dev → Builds**, watch the build log. Expected: build completes, status shows **Success**, new deployment is live.

---

## Task 15: Connect custom domain vancity.dev

**Files:** none — configured in Cloudflare dashboard

- [ ] **Step 1: Open Custom Domains tab**

In Cloudflare dashboard → **Workers & Pages** → **vancity-dev** → **Settings** → **Domains & Routes**.

- [ ] **Step 2: Add custom domain**

Click **Add** → **Custom Domain** → enter `vancity.dev` → click **Add Custom Domain**.

- [ ] **Step 3: Also add www subdomain (optional but recommended)**

Repeat: Add `www.vancity.dev` → **Add Custom Domain**.

Cloudflare will automatically create the necessary DNS records since the domain is already managed by Cloudflare. No manual DNS changes needed.

- [ ] **Step 4: Wait for activation**

The dashboard will show the domain as **Active** within a few seconds to a couple of minutes (no TTL wait needed — it's all internal to Cloudflare).

- [ ] **Step 5: Verify live at custom domain**

Open `https://vancity.dev` in a browser. Confirm: TLS is valid (padlock), page loads correctly, all sections render, fonts load.

- [ ] **Step 6: Final smoke test push**

Make a small visible change (e.g., update the booking pill text) to verify the full pipeline:

In `src/lib/components/NavBar.svelte`, change:
```svelte
<a href="#contact" class="booking-pill">Booking projects · Q3</a>
```
to:
```svelte
<a href="#contact" class="booking-pill">Booking projects · Q3 2026</a>
```

Then:
```bash
git add src/lib/components/NavBar.svelte
git commit -m "test: verify end-to-end CI/CD pipeline"
git push origin main
```

Watch the build in the Cloudflare dashboard. After it completes, visit `https://vancity.dev` and confirm the updated text appears.

Revert if desired:
```bash
git revert HEAD --no-edit
git push origin main
```
