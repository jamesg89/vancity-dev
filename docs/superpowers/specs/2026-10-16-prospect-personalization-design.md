# Prospect Personalization — Design

**Date:** 2026-10-16
**Status:** Awaiting review

## Purpose

Turn the industry template pages into a sales tool. James fills a short form with a
prospect's company name, industry and city, and gets back a shareable link such as
`turk-plumbing.vancity.dev`. The prospect opens it and sees what reads as their own
finished website — their name, their city, their service area — with no indication
that it is a template or a demo.

The intended reader of a prospect page is a small-business owner who has never heard
of Vancity Dev. Success is that they skim the page and think "this is my business",
not "this is a mockup". The page has to survive that skim: a Vancouver suburb list on
an Austin plumber's site breaks the illusion instantly.

### Success criteria

- Creating a prospect takes under a minute from an authenticated form.
- The resulting URL is short, pretty and shareable: `<slug>.vancity.dev`.
- The prospect page carries no Vancity branding and is excluded from search engines.
- Improving a template improves every prospect link already sent.
- The existing `/p/` showcase and the `waterstcafe` / `alexjo` demos keep working
  exactly as they do today.

## Decisions

These were settled before this document was written:

| Decision | Choice | Why |
|---|---|---|
| Prospect URL | `<slug>.vancity.dev` | Reuses the wildcard routing and DNS already configured; reads like the prospect's own site |
| Admin auth | Cloudflare Access | No auth code in the repo, nothing to leak; free tier covers it |
| Stealth | No banner, `noindex` | The page must read as the prospect's real site |
| Personalization depth | Name, city, phone + derived locals | Convincing on a skim while keeping the form short |
| Local details | Optional "nearby areas" field | Always accurate, no city database to maintain |
| Content location | Derived in code (approach A) | Template fixes reach links already sent; rows stay tiny |

## Architecture

```
turk-plumbing.vancity.dev
        │
        ▼
hooks.ts  reroute()          static map only — no platform access here
        │                    known demo slug → /demo/<slug>
        │                    anything else   → /site
        ▼
hooks.server.ts  handle()    sets locals.siteSlug from the hostname
        │
        ▼
/site/+page.server.ts        SELECT … FROM prospects WHERE slug = ?
        │                    404 if missing
        ▼
deriveContent(prospect)      prospect row → full SiteContent object
        │
        ▼
/site/+page.svelte           switch on industry → <PlumbingSite {content} />
```

### Why the lookup is not in `reroute`

`reroute` runs on the client during client-side navigation and has no
`platform.env`, so it cannot query D1. It therefore does a purely static map, and the
database lookup happens in the `/site` route's server `load`, which does have
`platform.env.DB`. This mirrors the existing split noted in `CLAUDE.md`: `reroute`
handles routing only, `handle` recovers the slug because `event.url` keeps the
original hostname.

## Data model

One D1 database, binding `DB`, one table.

```sql
CREATE TABLE prospects (
  slug          TEXT PRIMARY KEY,
  company_name  TEXT NOT NULL,
  industry      TEXT NOT NULL,
  city          TEXT NOT NULL,
  region        TEXT,
  phone         TEXT,
  nearby_areas  TEXT,
  created_at    INTEGER NOT NULL,
  archived      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_prospects_created ON prospects (created_at DESC);
```

- `slug` — the subdomain label. Primary key, so collisions are caught by the database.
- `region` — "Texas", "BC". Used for headings like "Plumbers across Central Texas"
  and the licence-line locale.
- `nearby_areas` — comma-separated, nullable. Drives the service-area list and the
  town shown under each review. Blank falls back to generic copy.
- `archived` — soft delete, so a link already sent can be switched off without the
  row disappearing from the admin list.

Migrations live in `migrations/` and are applied with
`wrangler d1 migrations apply vancity-prospects`.

## Routing changes

**`src/hooks.ts`** — extend the existing reroute:

```ts
const match = url.hostname.match(/^(.+)\.vancity\.dev$/);
if (match && match[1] !== 'www') {
  const slug = match[1];
  if (slug in demos) return `/demo/${slug}${url.pathname === '/' ? '' : url.pathname}`;
  return '/site';
}
```

Importing the `demos` registry here is safe — it is plain TypeScript with no platform
dependency. Prospect sites are single-page, so every path on a prospect subdomain
resolves to `/site`; deep links are out of scope.

**`src/hooks.server.ts`** — set `locals.siteSlug` for non-demo subdomains alongside
the existing `locals.demo`.

**`src/app.d.ts`** — add `siteSlug?: string` to `Locals` and
`DB: D1Database` to `Platform['env']`.

**`wrangler.toml`** — add the D1 binding. The existing wildcard `[[routes]]` entries
already cover prospect subdomains, so routing needs no new configuration.

## Template refactor

`/p/+page.svelte` currently holds both the markup and the Octopus Plumbing content.
Split it:

- `src/lib/templates/plumbing/types.ts` — the `PlumbingContent` interface.
- `src/lib/templates/plumbing/PlumbingSite.svelte` — all the markup and styles from
  today's page, taking `{ content }: { content: PlumbingContent }` as props.
- `src/lib/templates/plumbing/defaults.ts` — the Octopus Plumbing content, exactly as
  it reads today.
- `src/lib/templates/plumbing/derive.ts` — `derivePlumbingContent(prospect)`.
- `src/routes/p/+page.svelte` — renders `<PlumbingSite content={octopusDefaults} />`.

This is a pure refactor: `/p/` must render identical content and styling afterwards.
The Svelte scope hash changes when markup moves to a new component file, so the
check is on rendered text and computed styles, not on raw HTML equality.

Industry-to-template mapping lives in `src/lib/templates/index.ts`:

```ts
export const industries = {
  plumbing: { label: 'Plumbing', template: PlumbingSite, derive: derivePlumbingContent }
};
```

Adding an industry later means adding a template directory and one entry here.

## Content derivation

`derivePlumbingContent(prospect)` starts from the Octopus defaults and substitutes:

- **Company name** — brand mark, nav, footer, page title, meta description, booking
  section, copyright line. The mark splits on the last word, so "Turk Plumbing"
  renders as "Turk" over "PLUMBING"; a single-word name renders alone.
- **City and region** — H1 ("Fast, Honest Plumbing in Austin, TX"), the availability
  pill, the service-area heading, "Family-owned … serving Greater Austin".
- **Phone** — every `tel:` href and every rendered number. Falls back to a neutral
  placeholder when blank.
- **Nearby areas** — the service-area town list, the footer "Areas we serve" column,
  and the town under each review byline, cycled across the three reviews. When blank,
  the town list section collapses to a single line ("across the greater Austin area")
  and review bylines show only the city.
- **Licence line** — becomes "Licensed & Insured" without a number, since a made-up
  licence number on a real business's page is a liability rather than a flourish.

- **Internal links** — a prospect site is a single page, so any template link that
  points at a sibling route (today, the Drain Cleaning service card pointing at
  `/p/drain-cleaning`) is rewritten to `#book`. The `/p/` showcase keeps the real
  link. This lives in the content object as a per-link href so the template itself
  stays unaware of which context it is rendering in.

Everything else — prices, guarantees, FAQ copy, star ratings — stays as written. Two
constraints on the derivation:

1. It is a pure function of the row, so it is unit-testable without a database.
2. It never invents verifiable facts about a real business. Review quotes stay
   first-name-and-initial, and no claim is made about licensing or years in business
   that is specific enough to be checked.

## Admin flow

Route group `src/routes/admin/`:

- `/admin/prospects` — table of existing prospects: company, city, created date, the
  live URL with a copy button, and an archive toggle.
- `/admin/prospects/new` — the form: company name, industry (select), city, region,
  phone, nearby areas (textarea, optional).

On submit, a SvelteKit form action:

1. Validates the fields.
2. Generates the slug: lowercase, non-alphanumerics to hyphens, collapse repeats,
   trim. "Turk Plumbing" → `turk-plumbing`.
3. Rejects reserved slugs: `www`, `api`, `admin`, `mail`, `demo`, `site`, plus every
   key in the `demos` registry.
4. Inserts. A primary-key conflict appends `-2`, `-3` … and retries.
5. Redirects to a success view showing the full URL and a copy button.

### Authentication

Cloudflare Access protects `vancity.dev/admin/*`. The policy is created by hand in
the Cloudflare dashboard, in the same category as the wildcard CNAME and the
`send_email` binding that `CLAUDE.md` already records as manual steps. This design
adds a matching note there.

Belt and braces in the app: a `+layout.server.ts` under `/admin` rejects any request
without the `Cf-Access-Jwt-Assertion` header when not running in dev. In dev the
check is skipped, since Access only sits in front of the deployed Worker. The header
check is a guard against the route being reachable if the Access policy is
misconfigured or removed — not a replacement for it.

## Stealth

- `/site` renders `<meta name="robots" content="noindex, nofollow">`.
- `static/robots.txt` currently allows all crawling and is served on every host,
  including prospect subdomains. Replace it with a route at `src/routes/robots.txt/`
  that returns the permissive body for the apex and `www`, and `Disallow: /` for any
  other hostname.
- No `DemoBanner`, no Vancity link, no "preview" language anywhere in `/site`.
- Prospect pages are never linked from the marketing site, so the only way to reach
  one is the link James sends.

Note that this is obscurity, not secrecy: anyone who guesses a slug can view that
prospect's page. The pages contain no confidential information, so that is
acceptable; it is worth knowing rather than assuming otherwise.

## Error handling

| Case | Behaviour |
|---|---|
| Slug not in D1 | 404 |
| Slug archived | 404 |
| D1 unreachable | 503 with a plain message; no stack trace or template shell |
| Unknown industry in a row | 500, logged — indicates a template was removed while rows still reference it |
| Admin form validation failure | Re-render with field errors, preserving input |
| Slug collision | Automatic `-2` suffix, surfaced in the success view so James sees the real URL |

## Testing

**Unit** (new — the project has no unit runner yet, so this adds Vitest):

- `slugify` — spacing, punctuation, case, unicode, collision suffixes, reserved words.
- `derivePlumbingContent` — name/city/phone substitution; the blank-`nearby_areas`
  fallback; the single-word company name case; that no default Vancouver string
  survives in the output for an Austin prospect.

**E2E** (Playwright, extending `tests/`):

- `/p/` still renders the Octopus content after the refactor.
- A seeded prospect renders personalized content, asserted against a local D1 seeded
  with `wrangler d1 execute --local`.
- The prospect page contains no "Vancity" string and carries the noindex meta.
- `/admin/prospects/new` is unreachable in a production-mode build without the Access
  header.

Local subdomain testing uses `*.localhost`, which Chrome resolves without hosts-file
changes, so the hostname patterns in both hooks need to accept `.localhost` in dev
alongside `.vancity.dev`.

## Out of scope

- Migrating `waterstcafe` and `alexjo` out of the hardcoded registry.
- Per-prospect copy overrides (approach C). The `overrides` column is a one-column
  migration if it is ever wanted.
- Industries beyond plumbing. The mapping is structured for them; none are built.
- Analytics on prospect-link opens.
- Custom palettes per prospect.
