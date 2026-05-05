# Vancity Dev — SvelteKit + Cloudflare Workers Design Spec

## Overview

A personal web development studio site for James Goodwin (Vancity Dev), built as a SvelteKit SSR application deployed on Cloudflare Workers with automated CI/CD via Cloudflare Workers Builds.

---

## 1. Project Setup

- **Framework**: SvelteKit (latest) with TypeScript
- **Adapter**: `@sveltejs/adapter-cloudflare-workers` (SSR on Workers)
- **Package manager**: npm
- **Repo**: GitHub — `vancity-dev` (user account: jamesgoodwinrealty@gmail.com)
- **Scaffold**: `sv create` with TypeScript, no extra libraries initially

---

## 2. Deployment

- **Platform**: Cloudflare Workers (SSR, not static)
- **CI/CD**: Cloudflare Workers Builds — connected directly to GitHub `main` branch
- **Build pipeline**: `npm install && npm run build` → deploy output
- **Initial deploy**: Manual via `wrangler deploy` to create and link the Worker
- **Subsequent deploys**: Automatic on every push to `main`
- **Live URL**: `vancity.dev` (custom domain, already on Cloudflare)
- **Custom domain**: Route `vancity.dev/*` → Worker via Cloudflare dashboard (Workers & Pages → Custom Domains tab). No DNS changes needed — domain already managed by Cloudflare.

**`wrangler.toml` config:**
```toml
name = "vancity-dev"
main = ".svelte-kit/cloudflare-workers/index.js"
compatibility_date = "2026-05-05"
```

---

## 3. Design System

### Color tokens
| CSS var | Value | Role |
|---|---|---|
| `--bg` | `#f4f1ea` | Warm cream page background |
| `--ink` | `#1a2a26` | Primary text |
| `--ink-soft` | `#43534f` | Secondary/muted text |
| `--accent` | `#2d4f3f` | Deep forest green (Pro card, accents) |
| `--accent2` | `#3a6a85` | Steel blue/ocean |
| `--warm` | `#c97a4a` | Terracotta (CTAs, sun, logo highlight) |
| `--line` | `color-mix(in oklab, #1a2a26 14%, transparent)` | Dividers |
| `--paper` | `color-mix(in oklab, #f4f1ea 92%, #1a2a26 8%)` | Slightly darker bg variant |

### Typography
| CSS var | Value | Usage |
|---|---|---|
| `--serif` | `'Fraunces', Georgia, serif` | Headlines (H1–H3), logo — italic variable font |
| `--sans` | `'Inter', system-ui, sans-serif` | Body, UI, nav links |
| `--mono` | `'JetBrains Mono', ui-monospace, monospace` | Eyebrow labels, section numbers |

All three loaded from Google Fonts (`display=swap`).

---

## 4. Page Sections

Single-page layout. All sections in `src/routes/+page.svelte`. Shared styles in `src/app.css`.

### 4.1 Nav
- Logo: "Vancity Dev" in Fraunces italic, two-tone (`Vancity` in `--ink`, `Dev` in `--accent`)
- Links: Work / Pricing / About / Contact (smooth scroll anchors)
- Right pill: "Booking projects · Q3" — dark (`--ink` bg, cream text), rounded full

### 4.2 Hero
- Eyebrow: `VANCOUVER, BC · EST. 2019` in `--mono`, small caps
- H1: "Bespoke websites," (upright Fraunces) + "*handcrafted* & yours." (italic Fraunces) — large editorial, ~6–7rem
- Body: "I'm James — a one-person studio building custom, fast, honestly-priced websites for businesses across the Lower Mainland. No templates. No bloated builders. Just careful code, considered design."
- CTAs: "See pricing →" (filled `--warm` pill) + "Recent work" (text link with underline)
- Geo tag: `49.2827° N   123.1207° W` in `--mono`, muted

### 4.3 Landscape Illustration
- Inline SVG, exact colours from the design thumbnail
- Warm cream sky (`#f4f1ea`), large terracotta circle sun (`#c97a4a`)
- Two mountain ridge layers: blue-green (`#3a6a85` @ 55% opacity) + deep forest (`#2d4f3f`)
- Full-width, aspect ratio ~3:1

### 4.4 Marquee Ticker
- Scrolling strip between hero image and work section
- Items: `HAND-CODED SINCE 2019 · LIGHTHOUSE 95+ ON EVERY BUILD · LOCAL · VANCOUVER, BC · NO PAGE BUILDERS. NO BLOAT. · THREE PROPOSALS. FIVE EDITS. · FIXED PRICING. NO SURPRISES.`
- CSS `@keyframes` animation, `--mono` font, uppercase, small, muted (`--ink-soft`)
- Two copies side-by-side for seamless loop

### 4.5 Work Section (`id="work"`)
- Section label: `— 01 / Work`
- H2: "Selected projects."
- Intro: "A small slice of recent work — independent shops, local makers, and a few ambitious teams. Every site below was hand-built, start to finish."
- Six projects, numbered 01–06, with name + category badge + year:
  1. Coastline Coffee Roasters — E-COMMERCE · HEADLESS — 2025
  2. Mount Seymour Trail Co. — BRANDING · MARKETING SITE — 2025
  3. Granville Island Studio — PORTFOLIO · CMS — 2024
  4. False Creek Architecture — CUSTOM BUILD · API — 2024
  5. Kitsilano Wellness Co-op — BOOKING · STRIPE — 2024
  6. Howe Sound Outfitters — E-COMMERCE · CUSTOM CMS — 2023

### 4.6 Pricing Section (`id="pricing"`)
- Section label: `— 02 / Pricing`
- H2: "Honest, fixed pricing."
- Intro: "Two ways to work together. Standard covers most marketing sites and small shops. Pro is for when you need custom logic, integrations, or a real backend."

**Plan A — Standard Custom** (light card, `--bg`):
- Label: `PLAN A · MOST PROJECTS`
- Price: $1,200 one-time
- Features (8 checkmark items)
- Hosting add-ons: $25/mo (self-manage) or $150/mo (full management)
- CTA: "Start a project →"

**Plan B — Pro Custom** (dark card, `--accent` bg, cream text):
- Label: `PLAN B · ADVANCED BUILDS` + `MOST POPULAR` badge
- Price: $3,000++ from — scope dependent
- Features (6 checkmark items, all from Standard plus extras)
- Same hosting add-ons
- CTA: "Book a free consult →"

- Fine print: `// All prices in CAD. GST extra. 50% deposit, 50% on launch.`
- Soft CTA: "Not sure which? — tell me about your project"

### 4.7 About Section (`id="about"`)
- Section label: `— 03 / About`
- H2: "A studio of one."
- Bio paragraphs (James Goodwin, Vancouver-based, hand-coding since 2014)
- Four stat blocks in a grid:
  - BASED: East Vancouver, BC
  - WORKING SINCE: 2014 · independent '19
  - STACK: Astro · Next · Stripe · Sanity
  - CAPACITY: 2–3 projects per quarter
- Portrait placeholder (grey box with label `[ portrait · 4:5 ]`)

### 4.8 Contact Section (`id="contact"`)
- H2: "Let's build something good."
- Sub-label: `START A PROJECT`
- Email: hello@vancitydev.ca
- Phone: +1 (604) 555-0199
- Note: "Most replies within one business day. I'll usually suggest a 30-min video call to scope the work."
- Studio block: East Vancouver / British Columbia / 49.2827° N, 123.1207° W
- Elsewhere links: Are.na / GitHub / Read.cv / LinkedIn
- NOW block: "Booking projects starting Q3 2026. One Pro slot remaining this quarter."

### 4.9 Footer
- `© 2026 Vancity Dev · J. Goodwin`
- Land acknowledgement: "Built by hand on the unceded territories of the xʷməθkʷəy̓əm, Sḵwx̱wú7mesh, and səlilwətaɬ Nations."
- Version: `v.04 / May 2026`
- Dark background (`--ink` or `--accent`)

---

## 5. File Structure

```
vancity-dev/
├── src/
│   ├── app.css              # Global tokens, resets, font imports
│   ├── app.html             # HTML shell
│   └── routes/
│       ├── +layout.svelte   # Nav + footer wrapper
│       └── +page.svelte     # All page sections
├── static/                  # Favicon, any static assets
├── wrangler.toml            # Cloudflare Workers config
├── svelte.config.js         # adapter-cloudflare-workers
├── vite.config.ts
└── package.json
```

---

## 6. Implementation Order

1. Scaffold SvelteKit project with `sv create`
2. Install and configure `@sveltejs/adapter-cloudflare-workers`
3. Set up `wrangler.toml`
4. Build `app.css` (design tokens, font imports, resets)
5. Build `+layout.svelte` (nav + footer)
6. Build `+page.svelte` section by section (hero → landscape → ticker → work → pricing → about → contact)
7. `git init`, create GitHub repo `vancity-dev`, push
8. `wrangler deploy` — initial manual deploy
9. Connect GitHub repo to Cloudflare Workers Builds in dashboard
10. Verify auto-deploy on a test push
