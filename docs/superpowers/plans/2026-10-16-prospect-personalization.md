# Prospect Personalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let James create a prospect from a short authenticated form and share `<slug>.vancity.dev`, a stealthy personalized version of an industry template.

**Architecture:** `reroute` does a static hostname map (known demo slug → `/demo/<slug>`, anything else → `/site`) because it cannot reach `platform.env`. The `/site` server load queries D1, and a pure `derivePlumbingContent(prospect)` turns the row into the content object that drives a props-driven `PlumbingSite.svelte`, which `/p/` also renders with the Octopus defaults.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, TypeScript, Cloudflare Workers + D1, Cloudflare Access, Vitest (new), Playwright.

**Spec:** `docs/superpowers/specs/2026-10-16-prospect-personalization-design.md`

## Global Constraints

- Svelte 5 runes only: `$props()`, `$state()`, `$derived()`; `onclick` not `on:click`.
- `<svelte:head>` must sit at component top level, never inside `{#if}`.
- Never statically import `cloudflare:*` modules; use `await import(/* @vite-ignore */ '…')` inside the function.
- `app.css` sets `cursor: none` and `a { color: inherit }` globally. Any new page root needs `cursor: auto`, and base link rules inside a scoped `<style>` must use `:where()` so component rules win — see the comment at the top of the `/p/` style block.
- Git branch is `master`. Prettier/ESLint via `npm run lint`; 2-space indent in `src/routes/p` and `src/lib/templates`, tabs elsewhere — match the file you are editing.
- Derived copy must never invent verifiable facts about a real business: no licence numbers, no years-in-business, no full reviewer names.
- D1 binding name is `DB`; database name is `vancity-prospects`.

## Review Focus

1. **Slug must be a valid DNS label.** "Turk & Sons Plumbing, LLC." must yield a resolvable label — lowercase, no leading/trailing hyphen, no double hyphen, 63 chars max — or the subdomain silently fails to resolve. Test in Task 1.
2. **Phone goes into a `tel:` href.** An arbitrary string must be reduced to digits and a leading `+` before it reaches the href, so it cannot break out of the attribute. Test in Task 3.
3. **Blank `nearby_areas`.** The town list and footer areas column must collapse to the fallback line rather than rendering an empty `<ul>` or a stray Vancouver suburb. Test in Task 3.
4. **Single-word company name.** "Turk" must render the brand mark without an empty second line and without the word repeating. Test in Task 3.
5. **D1 unavailable.** The `/site` load must fail to a 503 rather than rendering a template shell with blank company name. Test in Task 5.

---

### Task 1: Prospect primitives and the unit-test runner

**Files:**
- Create: `src/lib/prospects/types.ts`
- Create: `src/lib/prospects/slug.ts`
- Create: `src/lib/prospects/slug.spec.ts`
- Modify: `vite.config.ts`
- Modify: `playwright.config.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: nothing.
- Produces:
  ```ts
  export type IndustryKey = 'plumbing';
  export interface Prospect {
    slug: string; companyName: string; industry: IndustryKey;
    city: string; region: string | null; phone: string | null;
    nearbyAreas: string[]; createdAt: number; archived: boolean;
  }
  export type NewProspect = Omit<Prospect, 'slug' | 'createdAt' | 'archived'>;

  export const RESERVED_SLUGS: ReadonlySet<string>;
  export function slugify(input: string): string;
  export function isReserved(slug: string): boolean;
  export function nextAvailableSlug(base: string, taken: (slug: string) => boolean): string;
  ```

`RESERVED_SLUGS` contains `www`, `api`, `admin`, `mail`, `demo`, `site`, plus every key of the `demos` registry in `src/lib/demos/index.ts` (import it, do not duplicate the list).

- [ ] **Step 1: Add Vitest without colliding with Playwright**

Playwright's `testMatch` is `**/*.{e2e,test}.{ts,js}` and is currently unscoped, so it would collect Vitest files under `src/`. Install `vitest`, add a `test` block to `vite.config.ts` with `include: ['src/**/*.spec.ts']`, set `testDir: './tests'` in `playwright.config.ts`, and add scripts: `"test:unit": "vitest run"`, `"test": "npm run test:unit && npm run test:e2e"`.

- [ ] **Step 2: Write the failing tests**

```ts
// src/lib/prospects/slug.spec.ts
describe('slugify', () => {
  it('lowercases and hyphenates', () => expect(slugify('Turk Plumbing')).toBe('turk-plumbing'));
  it('strips punctuation', () => expect(slugify('Turk & Sons Plumbing, LLC.')).toBe('turk-sons-plumbing-llc'));
  it('collapses repeated separators', () => expect(slugify('A  --  B')).toBe('a-b'));
  it('trims leading and trailing hyphens', () => expect(slugify('  -Turk-  ')).toBe('turk'));
  it('strips non-ascii', () => expect(slugify('Café Plomberie')).toBe('cafe-plomberie'));
  it('caps at 63 characters with no trailing hyphen', () => {
    const s = slugify('x'.repeat(40) + ' ' + 'y'.repeat(40));
    expect(s.length).toBeLessThanOrEqual(63);
    expect(s.endsWith('-')).toBe(false);
  });
  it('returns empty string when nothing survives', () => expect(slugify('!!!')).toBe(''));
});

describe('isReserved', () => {
  it('rejects infrastructure names', () => expect(isReserved('www')).toBe(true));
  it('rejects existing demo slugs', () => expect(isReserved('waterstcafe')).toBe(true));
  it('allows a normal slug', () => expect(isReserved('turk-plumbing')).toBe(false));
});

describe('nextAvailableSlug', () => {
  it('returns the base when free', () =>
    expect(nextAvailableSlug('turk-plumbing', () => false)).toBe('turk-plumbing'));
  it('suffixes past collisions', () =>
    expect(nextAvailableSlug('turk-plumbing', s => s === 'turk-plumbing' || s === 'turk-plumbing-2'))
      .toBe('turk-plumbing-3'));
  it('treats reserved names as taken', () =>
    expect(nextAvailableSlug('demo', () => false)).toBe('demo-2'));
  it('keeps the suffixed slug within 63 characters', () => {
    const base = 'a'.repeat(63);
    expect(nextAvailableSlug(base, s => s === base).length).toBeLessThanOrEqual(63);
  });
});
```

- [ ] **Step 3: Run to verify they fail**

Run: `npm run test:unit`
Expected: FAIL — module `src/lib/prospects/slug` not found.

- [ ] **Step 4: Implement `src/lib/prospects/types.ts` and `src/lib/prospects/slug.ts`**

`slugify` normalises to NFD and strips combining marks so accented letters fold to ASCII before non-alphanumerics become hyphens. When truncating to 63, trim any hyphen the cut leaves behind; `nextAvailableSlug` shortens the base as needed so base + suffix still fits.

- [ ] **Step 5: Run to verify they pass**

Run: `npm run test:unit`
Expected: PASS. Then `npx playwright test tests/` still collects only the two existing files.

- [ ] **Step 6: Commit**

```bash
git add src/lib/prospects vite.config.ts playwright.config.ts package.json package-lock.json
git commit -m "feat: add prospect types, slug generation and vitest"
```

---

### Task 2: Extract the plumbing template into a props-driven component

A pure refactor. `/p/` must render the same content and styling afterwards; only the Svelte scope hash changes.

**Files:**
- Create: `src/lib/templates/plumbing/types.ts`
- Create: `src/lib/templates/plumbing/defaults.ts`
- Create: `src/lib/templates/plumbing/PlumbingSite.svelte`
- Create: `src/lib/templates/index.ts`
- Modify: `src/routes/p/+page.svelte`
- Test: `tests/plumbing-template.test.ts`

**Interfaces:**
- Consumes: `IndustryKey` (Task 1).
- Produces:
  ```ts
  export interface PlumbingContent {
    title: string; metaDescription: string;
    companyName: string; brandLead: string; brandTail: string | null;
    city: string; cityRegion: string; metroLabel: string;
    heroHeadline: string; availabilityPill: string;
    phoneDisplay: string; phoneHref: string; email: string;
    licenceLine: string; licenceShort: string | null; foundedLine: string;
    serviceAreaHeading: string; serviceAreaIntro: string;
    towns: string[];            // empty => town list hidden
    reviewTowns: string[];      // 3 entries, parallel to the static reviews
    serviceHrefs: Record<string, string>; // service title -> href; absent => '#book'
    address: string[] | null;   // null => address block hidden
    copyrightLine: string; footerLicenceLine: string;
  }
  export const octopusDefaults: PlumbingContent;
  // PlumbingSite.svelte props: { content: PlumbingContent }

  // src/lib/templates/index.ts
  export const industries: Record<IndustryKey, { label: string }>;
  ```

Everything not in `PlumbingContent` — prices, guarantees, FAQ copy, steps, diffs, trust items, stats, review quotes, service titles and descriptions — stays as literals inside `PlumbingSite.svelte`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/plumbing-template.test.ts
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
});

test('/p has no failing-contrast anchors', async ({ page }) => {
  await page.goto('/p');
  expect(await page.evaluate(contrastSweep)).toEqual([]);
});
```

`contrastSweep` is a new helper in `tests/helpers/contrast.ts`: a browser-context
function that walks every `<a>` and `<button>` inside `.op-root`, resolves each one's
colour against its nearest opaque ancestor background, and returns the elements whose
WCAG contrast ratio is below 4.5. It exists because a specificity bug silently
repainted every anchor-button brand blue once already; this test is what catches a
recurrence through the refactor.

- [ ] **Step 2: Run to establish the baseline**

This is a characterization test: it describes what `/p` already does, so it must pass
*before* the refactor.

Run: `npx playwright test tests/plumbing-template.test.ts`
Expected: PASS against the un-refactored page. If anything fails here, the assertion
is wrong about today's behaviour — fix the test, not the page.

- [ ] **Step 3: Move the markup into `PlumbingSite.svelte`**

Move the entire template and `<style>` block from `src/routes/p/+page.svelte` verbatim. Replace only the personalized literals with `content.*` fields. The brand mark renders `content.brandTail` only when non-null; the towns list and footer areas column render only when `content.towns.length > 0`; each service's `href` is `content.serviceHrefs[title] ?? '#book'`.

- [ ] **Step 4: Fill `defaults.ts` with today's exact values**

`octopusDefaults.serviceHrefs` maps `'24/7 Emergency'` to the phone href and `'Drain Cleaning'` to `/p/drain-cleaning`; every other service is absent so it falls through to `'#book'`.

- [ ] **Step 5: Reduce `/p/+page.svelte` to the showcase wrapper**

It imports `PlumbingSite` and `octopusDefaults` and renders `<PlumbingSite content={octopusDefaults} />`.

- [ ] **Step 6: Verify nothing changed**

Run: `npx svelte-check --threshold warning` → 0 errors, 0 warnings.
Run: `npx playwright test tests/plumbing-template.test.ts` → PASS, same as the baseline.

- [ ] **Step 7: Commit**

```bash
git add src/lib/templates src/routes/p tests/plumbing-template.test.ts
git commit -m "refactor: extract PlumbingSite into a props-driven template component"
```

---

### Task 3: Derive personalized content from a prospect

**Files:**
- Create: `src/lib/templates/plumbing/derive.ts`
- Create: `src/lib/templates/plumbing/derive.spec.ts`

**Interfaces:**
- Consumes: `Prospect` (Task 1), `PlumbingContent` and `octopusDefaults` (Task 2).
- Produces:
  ```ts
  export function derivePlumbingContent(prospect: Prospect): PlumbingContent;
  export function toTelHref(phone: string | null): string;   // exported for testing
  ```

Rules: `brandLead`/`brandTail` split on the final word, `brandTail` is `null` for a single-word name. `cityRegion` is `"<city>, <region>"`, or just the city when `region` is null. `metroLabel` is `"Greater <city>"`. `licenceLine` and `footerLicenceLine` are `"Licensed & Insured"` with no number; `licenceShort` is `null`. `address` is `null`. `reviewTowns` cycles `nearbyAreas`, falling back to `[city, city, city]` when empty. `serviceHrefs` maps `'24/7 Emergency'` to the phone href and nothing else, so the Drain Cleaning card falls through to `'#book'`.

- [ ] **Step 1: Write the failing tests**

```ts
const turk: Prospect = {
  slug: 'turk-plumbing', companyName: 'Turk Plumbing', industry: 'plumbing',
  city: 'Austin', region: 'TX', phone: '(512) 555-0147',
  nearbyAreas: ['Round Rock', 'Pflugerville', 'Cedar Park'],
  createdAt: 0, archived: false
};

it('substitutes company, city and phone', () => {
  const c = derivePlumbingContent(turk);
  expect(c.companyName).toBe('Turk Plumbing');
  expect(c.brandLead).toBe('Turk');
  expect(c.brandTail).toBe('Plumbing');
  expect(c.heroHeadline).toBe('Fast, Honest Plumbing in Austin, TX');
  expect(c.title).toContain('Turk Plumbing');
  expect(c.availabilityPill).toContain('Austin');
  expect(c.phoneDisplay).toBe('(512) 555-0147');
});

it('leaves no Vancouver defaults behind', () => {
  const c = derivePlumbingContent(turk);
  const blob = JSON.stringify(c);
  for (const s of ['Vancouver', 'Burnaby', 'Richmond', 'Octopus', '604', 'PL-204871', 'BC'])
    expect(blob).not.toContain(s);
});

it('handles a single-word company name', () => {
  const c = derivePlumbingContent({ ...turk, companyName: 'Turk' });
  expect(c.brandLead).toBe('Turk');
  expect(c.brandTail).toBeNull();
});

it('falls back when nearbyAreas is empty', () => {
  const c = derivePlumbingContent({ ...turk, nearbyAreas: [] });
  expect(c.towns).toEqual([]);
  expect(c.serviceAreaIntro).toContain('greater Austin');
  expect(c.reviewTowns).toEqual(['Austin', 'Austin', 'Austin']);
});

it('cycles nearby areas across the three reviews', () => {
  expect(derivePlumbingContent({ ...turk, nearbyAreas: ['A', 'B'] }).reviewTowns)
    .toEqual(['A', 'B', 'A']);
});

it('omits the region when absent', () => {
  expect(derivePlumbingContent({ ...turk, region: null }).heroHeadline)
    .toBe('Fast, Honest Plumbing in Austin');
});

it('makes no licence claim', () => {
  const c = derivePlumbingContent(turk);
  expect(c.licenceLine).toBe('Licensed & Insured');
  expect(c.licenceShort).toBeNull();
  expect(c.address).toBeNull();
});

describe('toTelHref', () => {
  it('reduces to digits', () => expect(toTelHref('(512) 555-0147')).toBe('tel:5125550147'));
  it('keeps a leading plus', () => expect(toTelHref('+1 512 555 0147')).toBe('tel:+15125550147'));
  it('strips anything that could break the attribute', () =>
    expect(toTelHref('5125550147" onclick="x')).toBe('tel:5125550147'));
  it('returns an empty href for null', () => expect(toTelHref(null)).toBe(''));
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npm run test:unit`
Expected: FAIL — `derivePlumbingContent` not defined.

- [ ] **Step 3: Implement `derivePlumbingContent` and `toTelHref`**

- [ ] **Step 4: Run to verify they pass**

Run: `npm run test:unit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/templates/plumbing/derive.ts src/lib/templates/plumbing/derive.spec.ts
git commit -m "feat: derive plumbing content from a prospect row"
```

---

### Task 4: D1 schema, binding and data access

**Files:**
- Create: `migrations/0001_create_prospects.sql`
- Create: `src/lib/prospects/db.ts`
- Modify: `wrangler.toml`
- Modify: `src/app.d.ts`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: `Prospect`, `NewProspect` (Task 1).
- Produces:
  ```ts
  export function getProspectBySlug(db: D1Database, slug: string): Promise<Prospect | null>;
  export function listProspects(db: D1Database): Promise<Prospect[]>;
  export function createProspect(db: D1Database, input: NewProspect, slug: string): Promise<Prospect>;
  export function setArchived(db: D1Database, slug: string, archived: boolean): Promise<void>;
  ```

`getProspectBySlug` returns `null` for archived rows. All four map between the snake_case columns in the spec's schema and the camelCase `Prospect` shape, splitting and joining `nearby_areas` on commas with surrounding whitespace trimmed and empty entries dropped.

- [ ] **Step 1: Write the migration**

Exactly the `CREATE TABLE` and `CREATE INDEX` from the spec's Data model section.

- [ ] **Step 2: Add the binding and types**

`wrangler.toml` gets a `[[d1_databases]]` entry with `binding = "DB"` and `database_name = "vancity-prospects"`. `src/app.d.ts` gets `DB: D1Database` in `Platform['env']` and `siteSlug?: string` in `Locals`.

- [ ] **Step 3: Implement `src/lib/prospects/db.ts`**

Use prepared statements with bound parameters throughout; never interpolate the slug into SQL.

- [ ] **Step 4: Create the database and apply the migration locally**

```bash
npx wrangler d1 create vancity-prospects
npx wrangler d1 migrations apply vancity-prospects --local
```

Paste the returned `database_id` into `wrangler.toml`.

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit` → clean.
Run: `npx wrangler d1 execute vancity-prospects --local --command "SELECT name FROM sqlite_master WHERE type='table'"` → lists `prospects`.

- [ ] **Step 6: Record the manual steps in CLAUDE.md**

Add to the Wrangler Config section: the D1 binding, that `wrangler d1 create` must be run once per environment, and that remote migrations need `--remote`.

- [ ] **Step 7: Commit**

```bash
git add migrations src/lib/prospects/db.ts wrangler.toml src/app.d.ts CLAUDE.md
git commit -m "feat: add prospects D1 schema, binding and data access"
```

---

### Task 5: Route prospect subdomains to a rendered site

**Files:**
- Modify: `src/hooks.ts`
- Modify: `src/hooks.server.ts`
- Create: `src/routes/site/+page.server.ts`
- Create: `src/routes/site/+page.svelte`
- Test: `tests/prospect-site.test.ts`

**Interfaces:**
- Consumes: `getProspectBySlug` (Task 4), `derivePlumbingContent` (Task 3), `PlumbingSite` (Task 2).
- Produces: `locals.siteSlug`; the `/site` route.

Both hooks must match `.localhost` as well as `.vancity.dev` so subdomains are testable locally. `reroute` returns `/demo/<slug>` when the slug is a key of the `demos` registry and `/site` otherwise; every path on a prospect subdomain maps to `/site`.

- [ ] **Step 1: Write the failing tests**

Playwright reaches a subdomain locally via `turk-plumbing.localhost:4173`. Seed the row in a `beforeAll` with `wrangler d1 execute --local`.

```ts
test('prospect subdomain renders personalized content', async ({ page }) => {
  await page.goto('http://turk-plumbing.localhost:4173/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Fast, Honest Plumbing in Austin, TX');
  await expect(page.locator('.brand-name')).toContainText('Turk');
  await expect(page.locator('.towns li')).toHaveCount(3);
  await expect(page.getByText('Round Rock')).toBeVisible();
});

test('prospect page leaks no Vancouver defaults', async ({ page }) => {
  await page.goto('http://turk-plumbing.localhost:4173/');
  const body = await page.locator('body').innerText();
  for (const s of ['Vancouver', 'Octopus', 'Burnaby', 'PL-204871', 'Vancity'])
    expect(body).not.toContain(s);
});

test('unknown slug 404s', async ({ page }) => {
  const res = await page.goto('http://nobody-here.localhost:4173/');
  expect(res?.status()).toBe(404);
});

test('existing demo subdomains still work', async ({ page }) => {
  await page.goto('http://waterstcafe.localhost:4173/');
  await expect(page.locator('.demo-banner')).toBeVisible();
});

test('/p is unaffected', async ({ page }) => {
  await page.goto('http://localhost:4173/p');
  await expect(page.locator('.brand-name')).toContainText('Octopus');
});
```

Plus a unit test for the Review Focus D1 case, in `src/routes/site/load.spec.ts`: calling the exported `load` with a `platform` whose `DB.prepare` throws produces a 503, not a rendered page.

- [ ] **Step 2: Run to verify they fail**

Run: `npx playwright test tests/prospect-site.test.ts`
Expected: FAIL — prospect subdomain 404s because `/site` does not exist.

- [ ] **Step 3: Extend both hooks**

- [ ] **Step 4: Implement `/site/+page.server.ts`**

Read `locals.siteSlug`; `error(404)` when absent or the row is missing; `error(503)` when the D1 call throws; `error(500)` when `prospect.industry` has no entry in `industries`. Return `{ content, industry }`.

- [ ] **Step 5: Implement `/site/+page.svelte`**

Render `<PlumbingSite content={data.content} />` selected on `data.industry`.

- [ ] **Step 6: Run to verify they pass**

Run: `npm run test:unit && npx playwright test tests/`
Expected: PASS, with the four pre-existing `homepage.test.ts` failures unchanged.

- [ ] **Step 7: Commit**

```bash
git add src/hooks.ts src/hooks.server.ts src/routes/site tests/prospect-site.test.ts
git commit -m "feat: render prospect sites on vancity.dev subdomains"
```

---

### Task 6: Keep prospect pages out of search

**Files:**
- Create: `src/routes/robots.txt/+server.ts`
- Delete: `static/robots.txt`
- Modify: `src/routes/site/+page.svelte`
- Test: `tests/prospect-site.test.ts` (extend)

**Interfaces:**
- Consumes: the `/site` route (Task 5).
- Produces: a per-hostname `robots.txt`.

`static/robots.txt` is served on every hostname including prospect subdomains, which is why it has to become a route.

- [ ] **Step 1: Write the failing tests**

```ts
test('prospect page is noindex', async ({ page }) => {
  await page.goto('http://turk-plumbing.localhost:4173/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('robots.txt disallows prospect hosts but not the apex', async ({ request }) => {
  expect(await (await request.get('http://turk-plumbing.localhost:4173/robots.txt')).text())
    .toContain('Disallow: /');
  expect(await (await request.get('http://localhost:4173/robots.txt')).text())
    .not.toContain('Disallow: /');
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx playwright test tests/prospect-site.test.ts`
Expected: FAIL — no robots meta, and `robots.txt` returns the permissive static file on both hosts.

- [ ] **Step 3: Add the robots route and delete the static file**

Permissive body for the apex and `www`; `User-agent: *` / `Disallow: /` for every other hostname. Branch on `url.hostname`, which keeps the original host.

- [ ] **Step 4: Add the noindex meta**

In `/site/+page.svelte`, at component top level — not inside `{#if}`.

- [ ] **Step 5: Run to verify they pass**

Run: `npx playwright test tests/` → PASS.

- [ ] **Step 6: Commit**

```bash
git add src/routes/robots.txt src/routes/site static tests/prospect-site.test.ts
git commit -m "feat: exclude prospect subdomains from search engines"
```

---

### Task 7: Gate the admin routes

**Files:**
- Create: `src/routes/admin/+layout.server.ts`
- Create: `src/routes/admin/+layout.svelte`
- Test: `tests/admin-auth.test.ts`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: nothing.
- Produces: every `/admin/**` route runs behind the guard.

Cloudflare Access is the real control; this guard is defence in depth if the policy is misconfigured or removed. It rejects any request without a `Cf-Access-Jwt-Assertion` header unless `dev` is true, since Access only fronts the deployed Worker.

- [ ] **Step 1: Write the failing test**

```ts
test('admin is unreachable without the Access header in a production build', async ({ request }) => {
  expect((await request.get('http://localhost:4173/admin/prospects')).status()).toBe(403);
});
```

Playwright runs against `npm run build && npm run preview`, so `dev` is false there.

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/admin-auth.test.ts`
Expected: FAIL with 404 — the route does not exist yet.

- [ ] **Step 3: Implement the guard and a minimal admin shell**

`+layout.server.ts` throws `error(403)` when `!dev && !request.headers.get('cf-access-jwt-assertion')`. `+layout.svelte` is a plain wrapper with `cursor: auto` and the project's own tokens; it is internal tooling, so keep it plain.

- [ ] **Step 4: Run to verify it passes**

Run: `npx playwright test tests/admin-auth.test.ts` → PASS (403).

- [ ] **Step 5: Record the manual step in CLAUDE.md**

A Cloudflare Access application covering `vancity.dev/admin/*` must be created by hand in the Zero Trust dashboard, like the wildcard CNAME and the `send_email` binding.

- [ ] **Step 6: Commit**

```bash
git add src/routes/admin tests/admin-auth.test.ts CLAUDE.md
git commit -m "feat: gate admin routes behind Cloudflare Access"
```

---

### Task 8: Admin list and create form

**Files:**
- Create: `src/routes/admin/prospects/+page.server.ts`
- Create: `src/routes/admin/prospects/+page.svelte`
- Create: `src/routes/admin/prospects/new/+page.server.ts`
- Create: `src/routes/admin/prospects/new/+page.svelte`
- Test: `tests/admin-prospects.test.ts`

**Interfaces:**
- Consumes: `listProspects`, `createProspect`, `setArchived` (Task 4); `slugify`, `isReserved`, `nextAvailableSlug` (Task 1); `industries` (Task 2).
- Produces: nothing downstream.

The list page shows company, city, created date, the full `https://<slug>.vancity.dev` URL with a copy button, and an archive toggle. The create form takes company name, industry (select over `industries`), city, region, phone and nearby areas (textarea, optional), and on success shows the URL with a copy button.

- [ ] **Step 1: Write the failing tests**

Run these with the Access header set, via Playwright's `extraHTTPHeaders`.

```ts
test('creating a prospect yields a shareable url', async ({ page }) => {
  await page.goto('/admin/prospects/new');
  await page.getByLabel('Company name').fill('Turk Plumbing');
  await page.getByLabel('City').fill('Austin');
  await page.getByLabel('State or province').fill('TX');
  await page.getByLabel('Nearby areas').fill('Round Rock, Pflugerville');
  await page.getByRole('button', { name: 'Create prospect' }).click();
  await expect(page.getByTestId('share-url')).toHaveText('https://turk-plumbing.vancity.dev');
});

test('a duplicate company name gets a suffixed slug', async ({ page }) => {
  // create 'Turk Plumbing' twice
  await expect(page.getByTestId('share-url')).toHaveText('https://turk-plumbing-2.vancity.dev');
});

test('company name is required', async ({ page }) => {
  await page.goto('/admin/prospects/new');
  await page.getByRole('button', { name: 'Create prospect' }).click();
  await expect(page.getByText('Enter a company name.')).toBeVisible();
  await expect(page.getByLabel('City')).toHaveValue('');
});

test('a name that slugifies to nothing is rejected', async ({ page }) => {
  await page.getByLabel('Company name').fill('!!!');
  await page.getByRole('button', { name: 'Create prospect' }).click();
  await expect(page.getByText(/Use at least one letter or number/)).toBeVisible();
});

test('the list shows and archives a prospect', async ({ page }) => {
  await page.goto('/admin/prospects');
  await expect(page.getByText('Turk Plumbing')).toBeVisible();
  await page.getByRole('button', { name: 'Archive' }).first().click();
  expect((await page.request.get('http://turk-plumbing.localhost:4173/')).status()).toBe(404);
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx playwright test tests/admin-prospects.test.ts`
Expected: FAIL — routes do not exist.

- [ ] **Step 3: Implement the create action**

Validate, `slugify`, reject an empty slug with "Use at least one letter or number.", then `nextAvailableSlug` against a `taken` predicate backed by `getProspectBySlug` and `isReserved`, then `createProspect`. On validation failure return `fail(400, { values, errors })` so input survives.

- [ ] **Step 4: Implement the two pages**

Svelte 5 runes, `onclick`, `navigator.clipboard.writeText` for the copy button with a visible fallback when the API is unavailable.

- [ ] **Step 5: Run the whole suite**

Run: `npm run test:unit && npx playwright test tests/`
Expected: PASS, with only the four pre-existing `homepage.test.ts` failures.

Run: `npx svelte-check --threshold warning` → 0 errors, 0 warnings.

- [ ] **Step 6: Commit**

```bash
git add src/routes/admin tests/admin-prospects.test.ts
git commit -m "feat: add admin prospect list and create form"
```
