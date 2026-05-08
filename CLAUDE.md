# Vancity Dev — Claude Context

## Project
SvelteKit 2 + Svelte 5 + TypeScript. Cloudflare Workers via `@sveltejs/adapter-cloudflare`.
Git branch is `master` (not main). CI/CD: Cloudflare Workers Builds auto-deploys on push.

## Commands
- `npm run dev` — local dev server at http://localhost:5173
- `npx playwright test tests/` — e2e tests (webServer starts automatically, no manual dev server needed)
- `npx tsc --noEmit` — TS type check (.svelte imports invisible here; use `npx svelte-check` for full check)
- `npx wrangler deploy` — manual deploy (CI handles it on push)
- `git push origin master` — triggers Cloudflare Workers Builds

## Architecture
- All global CSS tokens in `src/app.css` (--bg, --ink, --accent, --warm, --line, --serif, --sans, --mono)
- Brand hex values (for static assets that can't use CSS vars): --bg #f4f1ea (cream), --ink #1a2a26 (dark green), --accent #2d4f3f, --warm #c97a4a
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
- When converting a styled `<a>` to `<button>`, reset browser defaults: `border: none; cursor: pointer` — easy to miss if the class was shared

## Demo Routes — Known Gotchas
- `app.css` sets `cursor: none` globally (for marketing custom cursor) — demo layouts MUST set `cursor: auto` on `.demo-root` or the OS cursor disappears
- When a demo uses its own CSS var names (e.g. `--ivory`, `--gold`), map them from palette vars using `:global(.demo-root) { --ivory: var(--bg); --gold: var(--accent); }` in the page's `<style>`
- Large design reference HTML files are not covered by the `/design` gitignore entry — add them explicitly or move them into `/design/`

## Wrangler Config
- Asset binding uses `[assets]` + `binding = "ASSETS"` (not the old `[site]` format)
- Wildcard subdomain routing requires two `[[routes]]` entries: `*.vancity.dev` AND `*.vancity.dev/*`
- Wildcard CNAME (`* → @`, proxied) must be set manually in Cloudflare DNS dashboard
- `send_email` binding also needs manual activation: CF dashboard → Workers & Pages → Worker → Settings → Email

## Cloudflare Built-in Modules (`cloudflare:*`)
- NEVER statically import `cloudflare:email` (or any `cloudflare:*`) at the top of server files — Node.js throws `ERR_UNSUPPORTED_ESM_URL_SCHEME` during Vite SSR build
- Fix: dynamic import inside the function — `const { EmailMessage } = await import(/* @vite-ignore */ 'cloudflare:email')`
- Ambient type declarations for `cloudflare:*` must go in a separate `.d.ts` file with no `export {}` (not inside `app.d.ts`)
- `ssr.external` in vite.config does NOT fix this in Vite 8/rolldown — dynamic import is the only solution
- Local `npm run build` may hit `EBUSY` on Windows at the adapter cleanup step — Cloudflare CI (Linux) is unaffected
