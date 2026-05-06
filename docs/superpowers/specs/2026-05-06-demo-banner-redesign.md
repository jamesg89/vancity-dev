# DemoBanner Redesign — Spec

**Date:** 2026-05-06
**Status:** Approved

## Goal

Make the variant switcher self-explanatory (users currently don't know the A/B/C buttons switch design styles), and replace the muted "by Vancity Dev →" text link with a compelling CTA button that drives conversions.

## Design: Approach A — Labelled Tabs + Solid Green CTA

### Layout (left → center → right)

```
● Preview · Alex Jo, CPA    STYLE [A Editorial] [B Architectural] [C Portrait]    [Get your website →]
```

### Left — unchanged

`● Preview · ClientName` — pulsing green dot, monospace, unchanged from current.

### Center — Variant Switcher

- A muted `STYLE` prefix label before the buttons (monospace, ~10px, `rgba(255,255,255,0.3)`)
- Each button shows: letter (left) + short style name (right)
  - Letter: slightly larger or bolder, turns **green** (`#69c97a`) when active
  - Name: derived by stripping the `"Option X — "` prefix from `v.label`
    - e.g. `"Option A — Editorial"` → `"Editorial"`
  - Button width: wider than current 28px square to accommodate text (auto width, `padding: 0 10px`, `height: 28px`)
- Active state: green letter, white label, brighter background (`rgba(255,255,255,0.12)`), border `rgba(255,255,255,0.35)`
- Inactive state: muted letter, 50% opacity label, transparent background
- Gap between buttons: 4px (unchanged)

### Right — CTA Button

- Solid filled button: background `#69c97a`, text `#0d1f18`
- Label: **"Get your website →"**
- Size: `height: 28px`, `padding: 0 12px`, `border-radius: 6px`
- Font: monospace, 11px, `font-weight: 600`
- Links to `https://vancity.dev/#contact`, `target="_blank" rel="noopener noreferrer"`
- Hover: slight brightness increase (`filter: brightness(1.08)` or darken background)

### Mobile (≤520px)

- `STYLE` prefix label: hidden
- Button labels (style names): hidden — fall back to letter-only buttons (same as current)
- CTA button: **hidden** (same as current behaviour)

## Files to Change

- `src/lib/components/DemoBanner.svelte` — only file that needs editing

## Implementation Notes

- Short name extraction: `v.label.replace(/^Option [A-Z] — /, '')` or split on ` — ` and take index 1
- No changes to `DemoConfig` / `DemoVariant` types — `v.label` already has the data
- No changes to routing, layout, or demo registry
