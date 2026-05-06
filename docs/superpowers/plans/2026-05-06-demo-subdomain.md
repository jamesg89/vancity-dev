# Demo Subdomain System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a demo-subdomain system where each client gets a branded preview site at `[client].vancity.dev`, with a URL-based colour-scheme variant switcher (`?v=a/b/c`) and a fixed "Preview · by Vancity Dev" banner — starting with a Water St. Café demo.

**Architecture:** SvelteKit's `reroute` hook maps `waterstcafe.vancity.dev/` → `/demo/waterstcafe` at the router level; a server `handle` hook stores the slug in `locals.demo`. The demo layout at `src/routes/demo/+layout` injects palette CSS custom properties onto a full-bleed wrapper div, overriding the global tokens for the entire demo page. The active colour variant is resolved server-side from `?v=[key]` so the first paint is correct with no flash. DemoBanner sits fixed at the top and lets visitors switch variants via `goto('?v=b', { replaceState: true, noScroll: true })`.

**Tech Stack:** SvelteKit 2 + Svelte 5, TypeScript, Playwright (e2e), Cloudflare Workers (wildcard route in wrangler.toml)

---

## File Map

| File | Responsibility |
|---|---|
| `src/app.d.ts` | Add `demo?: string` to `App.Locals` |
| `src/lib/demos/types.ts` | `DemoPalette`, `DemoVariant`, `DemoConfig` interfaces |
| `src/lib/demos/waterstcafe.ts` | Water St. Café config: slug, name, tagline, 3 palette variants |
| `src/lib/demos/index.ts` | Demo registry: `Record<string, DemoConfig>` |
| `src/hooks.ts` | `reroute` hook: maps `*.vancity.dev` → `/demo/[slug]` |
| `src/hooks.server.ts` | `handle` hook: sets `locals.demo` from hostname |
| `src/lib/components/DemoBanner.svelte` | Fixed top banner: client name, A/B/C variant switcher, Vancity Dev CTA |
| `src/routes/demo/+layout.server.ts` | Resolves demo config + active variant from locals + URL params; returns cssVars string |
| `src/routes/demo/+layout.svelte` | Wraps demo pages: injects palette CSS vars on `.demo-root`, renders DemoBanner |
| `src/routes/demo/waterstcafe/+page.svelte` | Full Water St. Café demo page: nav, hero, about, menu, visit, footer |
| `wrangler.toml` | Add `[[routes]]` wildcard for `*.vancity.dev/*` |
| `tests/demo.test.ts` | Playwright e2e: banner, variant switcher, CSS var change, content |

---

## Task 1: Types, demo registry, and app.d.ts

**Files:**
- Create: `src/lib/demos/types.ts`
- Create: `src/lib/demos/index.ts`
- Modify: `src/app.d.ts`
- Create: `tests/demo.test.ts`

- [ ] **Step 1: Write failing Playwright tests**

Create `tests/demo.test.ts`:

```ts
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
```

- [ ] **Step 2: Run to confirm all fail**

```bash
npx playwright test tests/demo.test.ts
```

Expected: All 8 tests fail (page 404s or elements not found).

- [ ] **Step 3: Create `src/lib/demos/types.ts`**

```ts
export interface DemoPalette {
  '--bg': string;
  '--paper': string;
  '--ink': string;
  '--ink-soft': string;
  '--accent': string;
  '--accent2': string;
  '--warm': string;
  '--line': string;
}

export interface DemoVariant {
  key: string;
  label: string;
  palette: DemoPalette;
}

export interface DemoConfig {
  slug: string;
  clientName: string;
  tagline: string;
  variants: DemoVariant[];
}
```

- [ ] **Step 4: Create `src/lib/demos/index.ts`**

```ts
import type { DemoConfig } from './types';

export const demos: Record<string, DemoConfig> = {};
```

- [ ] **Step 5: Update `src/app.d.ts`**

```ts
// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
  namespace App {
    interface Locals {
      demo?: string;
    }
  }
}

export {};
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/demos/types.ts src/lib/demos/index.ts src/app.d.ts tests/demo.test.ts
git commit -m "feat: demo system types, registry skeleton, locals type"
```

---

## Task 2: Water St. Café demo config

**Files:**
- Create: `src/lib/demos/waterstcafe.ts`
- Modify: `src/lib/demos/index.ts`

- [ ] **Step 1: Create `src/lib/demos/waterstcafe.ts`**

```ts
import type { DemoConfig } from './types';

export const waterstcafe: DemoConfig = {
  slug: 'waterstcafe',
  clientName: 'Water St. Café',
  tagline: 'Artisan coffee · Gastown, Vancouver',
  variants: [
    {
      key: 'a',
      label: 'Option A — Warm Espresso',
      palette: {
        '--bg': '#f5f0e8',
        '--paper': '#ede8e0',
        '--ink': '#1f1512',
        '--ink-soft': '#5a4035',
        '--accent': '#6b4c35',
        '--accent2': '#4a7562',
        '--warm': '#c8936a',
        '--line': 'rgba(31,21,18,0.14)',
      },
    },
    {
      key: 'b',
      label: 'Option B — Pacific Blue',
      palette: {
        '--bg': '#e8edf2',
        '--paper': '#dde3e9',
        '--ink': '#0d1e28',
        '--ink-soft': '#3a5060',
        '--accent': '#1d4d6e',
        '--accent2': '#4a8070',
        '--warm': '#d4604a',
        '--line': 'rgba(13,30,40,0.14)',
      },
    },
    {
      key: 'c',
      label: 'Option C — Stone & Rust',
      palette: {
        '--bg': '#f0ede8',
        '--paper': '#e8e4de',
        '--ink': '#1c1c1a',
        '--ink-soft': '#5a5855',
        '--accent': '#3d3d38',
        '--accent2': '#6b6b66',
        '--warm': '#a35d3a',
        '--line': 'rgba(28,28,26,0.14)',
      },
    },
  ],
};
```

- [ ] **Step 2: Register in `src/lib/demos/index.ts`**

```ts
import type { DemoConfig } from './types';
import { waterstcafe } from './waterstcafe';

export const demos: Record<string, DemoConfig> = {
  waterstcafe,
};
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/demos/waterstcafe.ts src/lib/demos/index.ts
git commit -m "feat: Water St. Café demo config with 3 palette variants"
```

---

## Task 3: SvelteKit hooks

**Files:**
- Create: `src/hooks.ts`
- Create: `src/hooks.server.ts`

- [ ] **Step 1: Create `src/hooks.ts`**

```ts
import type { Reroute } from '@sveltejs/kit';

export const reroute: Reroute = ({ url }) => {
  const match = url.hostname.match(/^(.+)\.vancity\.dev$/);
  if (match && match[1] !== 'www') {
    return `/demo/${match[1]}${url.pathname === '/' ? '' : url.pathname}`;
  }
};
```

- [ ] **Step 2: Create `src/hooks.server.ts`**

```ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const match = event.url.hostname.match(/^(.+)\.vancity\.dev$/);
  if (match && match[1] !== 'www') {
    event.locals.demo = match[1];
  }
  return resolve(event);
};
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/hooks.ts src/hooks.server.ts
git commit -m "feat: reroute + handle hooks for subdomain → /demo/[slug]"
```

---

## Task 4: Demo layout (server load + layout component)

**Files:**
- Create: `src/routes/demo/+layout.server.ts`
- Create: `src/routes/demo/+layout.svelte`

- [ ] **Step 1: Create `src/routes/demo/+layout.server.ts`**

Note on slug resolution: `reroute` changes routing but NOT `event.url`. So when accessed via subdomain, `event.url.pathname` = `/` and `locals.demo` = `waterstcafe`. When accessed directly at `/demo/waterstcafe` in dev, `locals.demo` is undefined and the slug comes from the URL path.

```ts
import type { LayoutServerLoad } from './$types';
import { demos } from '$lib/demos/index';

export const load: LayoutServerLoad = ({ url, locals }) => {
  const slug = locals.demo ?? url.pathname.split('/').filter(Boolean)[1];
  const demo = slug ? demos[slug] : null;

  if (!demo) {
    return { demo: null, variant: null, cssVars: '' };
  }

  const variantKey = url.searchParams.get('v') ?? 'a';
  const variant = demo.variants.find((v) => v.key === variantKey) ?? demo.variants[0];
  const cssVars = Object.entries(variant.palette)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');

  return { demo, variant, cssVars };
};
```

- [ ] **Step 2: Create `src/routes/demo/+layout.svelte`**

```svelte
<script lang="ts">
  import type { LayoutData } from './$types';
  import DemoBanner from '$lib/components/DemoBanner.svelte';

  let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();
</script>

{#if data.demo && data.variant}
  <div class="demo-root" style={data.cssVars}>
    <DemoBanner demo={data.demo} variant={data.variant} />
    {@render children()}
  </div>
{:else}
  {@render children()}
{/if}

<style>
  .demo-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--ink);
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/routes/demo/+layout.server.ts src/routes/demo/+layout.svelte
git commit -m "feat: demo layout — palette injection + DemoBanner wrapper"
```

---

## Task 5: DemoBanner component

**Files:**
- Create: `src/lib/components/DemoBanner.svelte`

- [ ] **Step 1: Create `src/lib/components/DemoBanner.svelte`**

```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import type { DemoConfig, DemoVariant } from '$lib/demos/types';

  let { demo, variant }: { demo: DemoConfig; variant: DemoVariant } = $props();

  function switchVariant(key: string) {
    goto(`?v=${key}`, { replaceState: true, noScroll: true });
  }
</script>

<div class="demo-banner">
  <div class="demo-banner-inner">
    <span class="demo-label">
      <span class="preview-dot"></span>
      Preview · <strong>{demo.clientName}</strong>
    </span>

    <div class="variant-switcher">
      {#each demo.variants as v}
        <button
          class="variant-btn"
          data-active={v.key === variant.key ? 'true' : 'false'}
          onclick={() => switchVariant(v.key)}
          title={v.label}
        >
          {v.key.toUpperCase()}
        </button>
      {/each}
    </div>

    <a href="https://vancity.dev/#contact" class="demo-cta" target="_blank" rel="noopener">
      by Vancity Dev →
    </a>
  </div>
</div>

<style>
  .demo-banner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 44px;
    z-index: 200;
    background: #1a2a26;
    border-bottom: 0.5px solid rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
  }

  .demo-banner-inner {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .demo-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: 0.06em;
    color: rgba(255, 255, 255, 0.65);
    white-space: nowrap;
  }

  .demo-label strong {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }

  .preview-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #69c97a;
    box-shadow: 0 0 0 3px rgba(105, 201, 122, 0.3);
    animation: pulse 2.4s ease-in-out infinite;
    flex: 0 0 auto;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .variant-switcher {
    display: flex;
    gap: 4px;
  }

  .variant-btn {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: transparent;
    color: rgba(255, 255, 255, 0.5);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    display: grid;
    place-items: center;
  }

  .variant-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.85);
  }

  .variant-btn[data-active='true'] {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.4);
  }

  .demo-cta {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: 0.04em;
    color: rgba(255, 255, 255, 0.45);
    white-space: nowrap;
    transition: color 0.15s;
  }

  .demo-cta:hover {
    color: rgba(255, 255, 255, 0.85);
  }

  @media (max-width: 520px) {
    .demo-cta { display: none; }
  }
</style>
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/DemoBanner.svelte
git commit -m "feat: DemoBanner — live dot, A/B/C variant switcher, Vancity Dev CTA"
```

---

## Task 6: Water St. Café demo page

**Files:**
- Create: `src/routes/demo/waterstcafe/+page.svelte`

- [ ] **Step 1: Create `src/routes/demo/waterstcafe/+page.svelte`**

```svelte
<script lang="ts">
  const menuItems = [
    { name: 'Single Origin Pour-Over', desc: 'Ethiopian Yirgacheffe · bright, floral', price: '$7' },
    { name: 'Reserve Espresso', desc: 'Double shot · rotating single origin', price: '$6' },
    { name: 'Honey Oat Latte', desc: 'House oat milk · local wildflower honey', price: '$8' },
    { name: 'Cold Brew', desc: 'Salted caramel · 18hr steep', price: '$9' },
    { name: 'Cortado', desc: 'Equal parts espresso and steamed milk', price: '$6' },
    { name: 'Matcha Latte', desc: 'Ceremonial grade · oat or almond', price: '$7' },
  ];
</script>

<div class="demo-page">

  <nav class="demo-nav">
    <span class="demo-nav-brand">Water St. Café</span>
    <ul class="demo-nav-links">
      <li><a href="#menu">Menu</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#visit">Visit</a></li>
    </ul>
    <a href="#visit" class="demo-nav-cta">Book a Table</a>
  </nav>

  <section class="demo-hero">
    <p class="demo-eyebrow">Est. 2017 · Gastown, Vancouver</p>
    <h1>Water St.<br /><em>Café</em></h1>
    <p class="demo-sub">
      Artisan coffee, slow mornings.<br />
      Roasted on-site. Poured with care.
    </p>
    <div class="demo-ctas">
      <a href="#menu" class="btn">View Menu →</a>
      <a href="#visit" class="btn ghost">Book a Table</a>
    </div>
  </section>

  <section id="about" class="demo-about">
    <div class="demo-about-inner">
      <div class="demo-about-photo" aria-hidden="true">
        <div class="photo-placeholder">[ photo · 4:5 ]</div>
      </div>
      <div class="demo-about-text">
        <p class="demo-sec-num">— 01</p>
        <h2>Roasted<br /><em>on-site.</em></h2>
        <p>
          We source directly from small farms across Ethiopia, Colombia, and Guatemala.
          Every cup is prepared to order — no shortcuts, no automation, no rush.
        </p>
        <p>
          310 Water Street has been our home since 2017. Come in, slow down, and stay a while.
        </p>
      </div>
    </div>
  </section>

  <section id="menu" class="demo-menu">
    <div class="container">
      <div class="demo-sec-head">
        <p class="demo-sec-num">— 02</p>
        <h2>Signature <em>drinks</em>.</h2>
      </div>
      <div class="menu-list">
        {#each menuItems as item, i}
          <div class="menu-row">
            <span class="menu-num">{String(i + 1).padStart(2, '0')}</span>
            <span class="menu-name">{item.name}</span>
            <span class="menu-desc">{item.desc}</span>
            <span class="menu-price">{item.price}</span>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section id="visit" class="demo-visit">
    <div class="container">
      <div class="demo-sec-head">
        <p class="demo-sec-num">— 03</p>
        <h2>Find <em>us</em>.</h2>
      </div>
      <div class="visit-grid">
        <div class="visit-col">
          <p class="visit-label">Address</p>
          <p>310 Water Street</p>
          <p>Gastown, Vancouver</p>
          <p>BC V6B 1B6</p>
        </div>
        <div class="visit-col">
          <p class="visit-label">Hours</p>
          <p>Mon – Fri &nbsp;&nbsp; 7am – 6pm</p>
          <p>Saturday &nbsp;&nbsp;&nbsp; 8am – 5pm</p>
          <p>Sunday &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 9am – 4pm</p>
        </div>
        <div class="visit-col">
          <p class="visit-label">Contact</p>
          <p>hello@waterstreetcafe.ca</p>
          <p>+1 (604) 555-0177</p>
        </div>
      </div>
    </div>
  </section>

  <footer class="demo-footer">
    <span>© 2026 Water St. Café</span>
    <span>310 Water St · Gastown, Vancouver</span>
  </footer>

</div>

<style>
  .demo-page {
    font-family: var(--sans);
    color: var(--ink);
    background: var(--bg);
  }

  /* Nav */
  .demo-nav {
    position: sticky;
    top: 44px;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 36px;
    background: var(--bg);
    border-bottom: 0.5px solid var(--line);
  }

  .demo-nav-brand {
    font-family: var(--serif);
    font-style: italic;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: -0.01em;
  }

  .demo-nav-links {
    display: flex;
    gap: 28px;
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 13.5px;
    color: var(--ink-soft);
  }

  .demo-nav-links a { color: inherit; transition: color 0.15s; }
  .demo-nav-links a:hover { color: var(--ink); }

  .demo-nav-cta {
    font-size: 13px;
    font-weight: 500;
    padding: 8px 18px;
    border-radius: 999px;
    background: var(--accent);
    color: var(--bg);
    transition: background 0.15s;
  }

  .demo-nav-cta:hover { background: var(--ink); }

  /* Hero */
  .demo-hero {
    padding: 120px 36px 100px;
    max-width: 760px;
  }

  .demo-eyebrow {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-soft);
    margin-bottom: 28px;
  }

  .demo-hero h1 {
    font-family: var(--serif);
    font-weight: 300;
    font-size: clamp(64px, 10vw, 140px);
    letter-spacing: -0.04em;
    line-height: 0.92;
    margin: 0 0 36px;
  }

  .demo-hero h1 em {
    font-style: italic;
    color: var(--accent);
  }

  .demo-sub {
    font-size: 17px;
    line-height: 1.6;
    color: var(--ink-soft);
    margin-bottom: 48px;
    max-width: 420px;
  }

  .demo-ctas {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
  }

  /* About */
  .demo-about {
    background: var(--paper);
    padding: 100px 36px;
  }

  .demo-about-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .demo-about-photo {
    aspect-ratio: 4/5;
    background: var(--line);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .photo-placeholder {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-soft);
    opacity: 0.4;
  }

  .demo-sec-num {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--ink-soft);
    margin-bottom: 20px;
  }

  .demo-about-text h2 {
    font-family: var(--serif);
    font-weight: 300;
    font-size: clamp(40px, 5vw, 72px);
    letter-spacing: -0.03em;
    line-height: 1;
    margin: 0 0 28px;
  }

  .demo-about-text h2 em {
    font-style: italic;
    color: var(--accent);
  }

  .demo-about-text p {
    font-size: 15.5px;
    line-height: 1.7;
    color: var(--ink-soft);
    margin-bottom: 16px;
    max-width: 440px;
  }

  /* Menu */
  .demo-menu { padding: 100px 36px; }

  .demo-sec-head { margin-bottom: 48px; }

  .demo-sec-head h2 {
    font-family: var(--serif);
    font-weight: 300;
    font-size: clamp(36px, 4vw, 64px);
    letter-spacing: -0.025em;
    line-height: 1;
    margin: 0;
  }

  .demo-sec-head h2 em {
    font-style: italic;
    color: var(--accent);
  }

  .menu-list { border-top: 0.5px solid var(--line); }

  .menu-row {
    display: grid;
    grid-template-columns: 36px 1fr 1fr 60px;
    gap: 20px;
    align-items: baseline;
    padding: 22px 0;
    border-bottom: 0.5px solid var(--line);
    transition: background 0.15s, padding 0.15s;
  }

  .menu-row:hover {
    background: var(--paper);
    padding-left: 12px;
    padding-right: 12px;
  }

  .menu-num {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-soft);
    opacity: 0.5;
  }

  .menu-name {
    font-family: var(--serif);
    font-size: clamp(18px, 2vw, 26px);
    font-weight: 400;
    letter-spacing: -0.01em;
  }

  .menu-desc {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--ink-soft);
  }

  .menu-price {
    font-family: var(--mono);
    font-size: 13px;
    text-align: right;
    color: var(--warm);
  }

  /* Visit */
  .demo-visit {
    background: var(--paper);
    padding: 100px 36px;
  }

  .visit-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
  }

  .visit-label {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-soft);
    opacity: 0.5;
    margin-bottom: 14px;
  }

  .visit-col p {
    font-size: 15px;
    line-height: 1.8;
    color: var(--ink-soft);
  }

  /* Footer */
  .demo-footer {
    background: var(--ink);
    color: var(--bg);
    padding: 28px 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--mono);
    font-size: 11px;
    opacity: 0.9;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .demo-about-inner { grid-template-columns: 1fr; gap: 40px; }
    .menu-row { grid-template-columns: 28px 1fr 50px; }
    .menu-desc { display: none; }
    .visit-grid { grid-template-columns: 1fr; }
    .demo-nav-links { display: none; }
    .demo-hero { padding: 80px 22px 60px; }
    .demo-footer { flex-direction: column; gap: 8px; align-items: flex-start; }
  }
</style>
```

- [ ] **Step 2: Run Playwright tests**

```bash
npx playwright test tests/demo.test.ts
```

Expected: All 8 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/routes/demo/waterstcafe/+page.svelte
git commit -m "feat: Water St. Café demo page — nav, hero, about, menu, visit, footer"
```

---

## Task 7: Wrangler wildcard route + DNS

**Files:**
- Modify: `wrangler.toml`

> ⚠️ The DNS wildcard CNAME must be added manually in the Cloudflare dashboard — this cannot be done via Wrangler.

- [ ] **Step 1: Add wildcard route to `wrangler.toml`**

Append to `wrangler.toml` (after the `[assets]` block):

```toml
[[routes]]
pattern = "*.vancity.dev/*"
zone_name = "vancity.dev"
```

Full file after edit:

```toml
name = "vancity-dev"
main = ".svelte-kit/build/cloudflare/_worker.js"
compatibility_date = "2026-05-05"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".svelte-kit/build/cloudflare"
binding = "ASSETS"

[[routes]]
pattern = "*.vancity.dev/*"
zone_name = "vancity.dev"
```

- [ ] **Step 2: Commit and push**

```bash
git add wrangler.toml
git commit -m "chore: add Cloudflare Workers wildcard route for *.vancity.dev"
git push origin master
```

Wait for Workers Builds CI/CD to deploy (check Cloudflare dashboard → Workers & Pages → vancity-dev → Builds).

- [ ] **Step 3: Add DNS wildcard CNAME in Cloudflare dashboard**

1. Go to `dash.cloudflare.com` → select `vancity.dev` zone → **DNS**
2. **Add Record:**
   - Type: `CNAME`
   - Name: `*`
   - Target: `@` (or `vancity.dev`)
   - Proxy status: Proxied (orange cloud ✓)
3. Click **Save**

This routes all `*.vancity.dev` requests through Cloudflare's edge where the Worker intercepts them. Universal SSL covers `*.vancity.dev` automatically.

- [ ] **Step 4: Verify in browser**

Visit `https://waterstcafe.vancity.dev`. Expected:
- DemoBanner shows "Preview · Water St. Café" with A/B/C buttons
- Variant A palette (warm cream) loads with no flash
- Clicking `B` → URL becomes `https://waterstcafe.vancity.dev/?v=b`, palette switches to Pacific Blue
- Reloading at `?v=b` keeps Pacific Blue (server-rendered, no flash)
