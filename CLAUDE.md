# Vancity Dev — Claude Context

## Project
SvelteKit 2 + Svelte 5 + TypeScript. Cloudflare Workers via `@sveltejs/adapter-cloudflare-workers`.
Git branch is `master` (not main). CI/CD: Cloudflare Workers Builds auto-deploys on push.

## Commands
- `npm run dev` — local dev server at http://localhost:5173
- `npx playwright test tests/` — e2e tests (webServer starts automatically, no manual dev server needed)
- `npx tsc --noEmit` — TS type check (.svelte imports invisible here; use `npx svelte-check` for full check)
- `npx wrangler deploy` — manual deploy (CI handles it on push)
- `git push origin master` — triggers Cloudflare Workers Builds

## Architecture
- All global CSS tokens in `src/app.css` (--bg, --ink, --accent, --warm, --line, --serif, --sans, --mono)
- Global classes: `.btn`, `.btn.ghost`, `.container`, `.reveal` (scroll animation), `.sec-head`
- Root layout (`src/routes/+layout.svelte`) is minimal — only loads `app.css`
- Marketing pages live in `src/routes/(marketing)/` route group (has NavBar, cursor, scroll-reveal)
- Demo pages live in `src/routes/demo/[client]/` — no NavBar, no cursor

## Demo Subdomain System
- `src/hooks.ts` — `reroute`: `*.vancity.dev` → `/demo/[slug]` (routing only, does NOT change event.url)
- `src/hooks.server.ts` — `handle`: sets `locals.demo = slug` from hostname (needed because event.url stays as original)
- `src/lib/demos/index.ts` — registry; add new demo configs here
- Each demo page: `src/routes/demo/[slug]/+page.svelte` — uses CSS vars from parent layout palette
- Palette injection: inline `style` on `.demo-root` div (not :root — keeps demo scoped)

## Svelte 5 Gotchas
- `<svelte:head>` cannot be inside `{#if}` blocks — put it at component top level with internal guards
- Use `onclick` not `on:click` for event handlers
- `$props()` for typed component props; `$state()` for reactive vars; `$derived()` for computed

## Demo Routes — Known Gotchas
- `app.css` sets `cursor: none` globally (for marketing custom cursor) — demo layouts MUST set `cursor: auto` on `.demo-root` or the OS cursor disappears
- When a demo uses its own CSS var names (e.g. `--ivory`, `--gold`), map them from palette vars using `:global(.demo-root) { --ivory: var(--bg); --gold: var(--accent); }` in the page's `<style>`
- Large design reference HTML files are not covered by the `/design` gitignore entry — add them explicitly or move them into `/design/`

## Wrangler Config
- Asset binding uses `[assets]` + `binding = "ASSETS"` (not the old `[site]` format)
- Wildcard subdomain routing requires two `[[routes]]` entries: `*.vancity.dev` AND `*.vancity.dev/*`
- Wildcard CNAME (`* → @`, proxied) must be set manually in Cloudflare DNS dashboard
