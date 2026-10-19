# Accounting / CPA Firm Website Template

A static, framework-free website template for small accounting practices: CPA firms,
bookkeeping firms and tax practices with 1–25 people, owner-led, serving one metro
area (and clients remotely).

Built to be rebranded quickly: every piece of business data is a `{{TOKEN}}`, and every
colour, font, radius and shadow is a CSS custom property in one place.

```
cpa-firm/
├── index.html         Home page (17 sections)
├── service.html       Reusable service page  — sample copy: Bookkeeping
├── industry.html      Reusable industry page — sample copy: Contractors & Trades
├── pricing.html       Packages, comparison table, à-la-carte, fee guarantee
├── css/styles.css     One stylesheet. Brand tokens are in :root at the top.
├── js/main.js         ~250 lines of vanilla JS. The site works without it.
├── img/               SVG photo placeholders — replace all of them
└── README.md
```

No build step, no framework, no jQuery, no icon fonts. Icons are an inline `<symbol>`
sprite in each page. The only external request is Google Fonts.

---

## 1. Quick start for a new client

1. Copy the whole folder.
2. Find and replace the tokens in section 2 across `*.html` (see the one-liner below).
3. Change ~5 custom properties in `css/styles.css` (section 3).
4. Replace the three SVGs in `img/` with real photos, and update their `alt` text,
   `width` and `height`.
5. Paste the real booking URL, portal URL, payment URL and form endpoint.
6. Search for `REPLACE:` and `UPDATE YEARLY` and work through every hit.
7. Update the deadline calendar for the current tax year (section 7).
8. Verify credentials and licence state with the client before publishing (section 10).

A rough find-and-replace pass, from inside the folder:

```bash
# macOS: use `sed -i ''` instead of `sed -i`
sed -i \
  -e 's/{{FIRM_NAME}}/Northbridge CPA Group/g' \
  -e 's/{{FIRM_SHORT}}/Northbridge/g' \
  -e 's/{{PHONE}}/(207) 555-0143/g' \
  -e 's/{{PHONE_TEL}}/+12075550143/g' \
  *.html
```

Do the replacement with a script or your editor's project-wide replace — tokens appear in
meta tags, JSON-LD, `alt` text and `aria-label`s, not just visible copy. When you're done,
`grep -r '{{' .` should return nothing.

---

## 2. Every placeholder token

### Firm & contact
| Token | Example | Notes |
| --- | --- | --- |
| `{{FIRM_NAME}}` | Northbridge CPA Group | Full legal/marketing name. Must match the JSON-LD and footer `<address>`. |
| `{{FIRM_SHORT}}` | Northbridge | Used in the logo and "the ___ way" headings. |
| `{{PHONE}}` | (207) 555-0143 | Display format. |
| `{{PHONE_TEL}}` | +12075550143 | E.164, for `tel:` links. No spaces or punctuation. |
| `{{EMAIL}}` | hello@northbridgecpa.com | General enquiries only — never for documents. |
| `{{DOMAIN}}` | northbridgecpa.com | No protocol, no trailing slash. Used in canonicals, OG and JSON-LD. |
| `{{STREET_ADDRESS}}` | 118 Water Street, Suite 3 | |
| `{{CITY}}` / `{{STATE}}` / `{{ZIP}}` | Rockport / ME / 04856 | |
| `{{LAT}}` / `{{LNG}}` | 44.1845 / -69.0742 | From Google Maps. 4 decimal places is plenty. |
| `{{SERVICE_AREA}}` | the Midcoast and Greater Portland | Reads inside a sentence. |
| `{{AREA_1}}`…`{{AREA_8}}` | Camden, Belfast, … | Towns/suburbs. Also the footer links and `areaServed`. |
| `{{HOURS}}` | Mon–Fri 9am–5pm | |
| `{{TAX_SEASON_HOURS}}` | Mon–Sat 8am–7pm (Jan–Apr) | Shown in the utility bar. |

### Proof & promises
| Token | Example | Notes |
| --- | --- | --- |
| `{{FOUNDED_YEAR}}` | 2011 | Also `foundingDate` and the copyright range. |
| `{{YEARS_IN_BUSINESS}}` | 14 | |
| `{{CLIENT_COUNT}}` | 240 | Rendered as "240+ clients". |
| `{{REVIEW_RATING}}` | 4.9 | Must be a real figure — it feeds `aggregateRating`. |
| `{{REVIEW_COUNT}}` | 87 | Same. Never inflate; it's a schema violation and a trust risk. |
| `{{RESPONSE_PROMISE}}` | one business day | Appears beside every CTA. Only promise what the firm will keep. |
| `{{TAX_YEAR}}` | 2026 | The tax year the deadline calendar covers. |

### Links
| Token | Example |
| --- | --- |
| `{{BOOKING_URL}}` | `https://calendly.com/northbridge-cpa/20min` |
| `{{PORTAL_URL}}` | `https://northbridge.clientportal.com` |
| `{{PAYMENT_URL}}` | `https://pay.northbridgecpa.com` |
| `{{FORM_ENDPOINT}}` | `https://formspree.io/f/xxxxxx` |
| `{{GOOGLE_REVIEWS_URL}}` | The Google Business Profile reviews link |
| `{{LINKEDIN_URL}}` | The owner's or firm's LinkedIn |

### People
| Token | Example | Notes |
| --- | --- | --- |
| `{{OWNER_NAME}}` | Sarah Whitcomb | |
| `{{OWNER_CREDENTIALS}}` | CPA, MST | Use the right letters for the country: **CPA** (US), **CA** / **CPA** (CA, AU, NZ), **ACA/ACCA** (UK). |
| `{{OWNER_LICENSE_STATE}}` | Maine | Also `recognizedBy` in the credential schema. |
| `{{OWNER_PHOTO}}` | `img/owner.jpg` | |
| `{{TEAM_n_NAME}}` / `{{TEAM_n_TITLE}}` / `{{TEAM_n_CREDENTIALS}}` | n = 2, 3, 4 | The owner is person 1. |

### Pricing
| Token | Example | Notes |
| --- | --- | --- |
| `{{PKG_1_NAME}}` / `{{PKG_2_NAME}}` / `{{PKG_3_NAME}}` | Essentials / Growth / CFO | |
| `{{PKG_n_PRICE}}` | $450 | Include the currency symbol. |
| `{{PKG_n_PRICE_ANNUAL}}` | $4,500 | Shown when the annual toggle is on. Extra token added by this template. |
| `{{PKG_n_FEATURES}}` | — | A marker comment above each feature list; replace the `<li>` items. |
| `{{TAX_RETURN_FROM}}` | $450 | Individual return, starting at. |
| `{{BUSINESS_RETURN_FROM}}` | $1,200 | Business return, starting at. |

### Software
`{{SOFTWARE_1}}`…`{{SOFTWARE_4}}` — e.g. QuickBooks Online, Xero, Gusto, Bill.com.
Shown as **text badges, not vendor logos** (section 10).

### Service pages only
`{{SERVICE_NAME}}` (Bookkeeping), `{{SERVICE_SLUG}}` (`service-bookkeeping`),
`{{SERVICE_PRICE_FROM}}` ($450/mo), `{{SERVICE_INTRO}}` (one or two sentences).

### Industry pages only
`{{INDUSTRY_NAME}}` (Contractors & Trades), `{{INDUSTRY_PAINS}}` (a short eyebrow line,
e.g. "Job costing, 1099s and WIP").

---

## 3. Swapping colours

Everything lives in `:root` at the top of `css/styles.css`. These five do most of the work:

```css
--color-primary: #1F4D3A;   /* headings, links, dark bands   */
--color-accent:  #A6671B;   /* primary CTAs only             */
--color-bg:      #FAF8F3;   /* page background               */
--color-bg-alt:  #EEF2EC;   /* alternating section background */
--color-text:    #16211C;   /* body text                     */
```

Also update `--color-primary-dark`, `--color-accent-dark` (hover states) and
`--color-dark` (footer), plus `<meta name="theme-color">` in each page's `<head>` and the
two hard-coded hexes in the inline logo SVG (header and footer).

### Default — Evergreen & Brass
| Role | Hex | Contrast |
| --- | --- | --- |
| primary `#1F4D3A` | deep green | 9.1:1 on `#FAF8F3`; white on it 9.6:1 |
| accent `#A6671B` | brass | white on it 4.5:1 — **passes AA for normal text, with no margin.** Don't lighten it toward gold while keeping white text. |
| bg `#FAF8F3` / alt `#EEF2EC` | warm white / sage | |
| text `#16211C` / muted `#4B5A52` | | muted is 7.0:1 on bg |

### Alternative 1 — Classic Navy & Taupe (à la lewis.cpa)
```css
--color-primary: #0F3460;  --color-primary-dark: #0B2749;
--color-dark:    #091C33;
--color-accent:  #8C7B6E;  --color-accent-dark: #6E6055;
--color-bg:      #FBFAF8;  --color-bg-alt: #EFEDE9;
--color-text:    #15202B;  --color-muted: #4A5666;
--color-line:    #DAD6CE;  --color-line-soft: #EAE7E1;
```
`#8C7B6E` does **not** pass AA with white text. Either use `--color-accent-dark`
(`#6E6055`, 5.3:1) for buttons, or keep taupe as a border/background accent only and use
navy for the primary button.

### Alternative 2 — Warm Peach & Teal (à la Little Fish)
```css
--color-primary: #2F6F6E;  --color-primary-dark: #22514F;
--color-dark:    #16302F;
--color-accent:  #B4522A;  --color-accent-dark: #8E3F1F;
--color-bg:      #FDF8F4;  --color-bg-alt: #F7E8DF;
--color-text:    #2B2422;  --color-muted: #5A4C47;
--color-line:    #E8D6C9;  --color-line-soft: #F2E5DB;
```
The reference palette's peach `#E9A07F` is a *background* colour — white text on it fails
badly. Peach belongs in `--color-bg-alt` and decorative fills; the CTA uses the deeper
terracotta above.

### Alternative 3 — Monochrome Premium (à la davidfrenchcpa.com)
```css
--color-primary: #111111;  --color-primary-dark: #000000;
--color-dark:    #0A0A0A;
--color-accent:  #2563EB;  --color-accent-dark: #1D4ED8;
--color-bg:      #FFFFFF;  --color-bg-alt: #F4F4F4;
--color-text:    #111111;  --color-muted: #525252;
--color-line:    #E2E2E2;  --color-line-soft: #EFEFEF;
```
White on `#2563EB` is 5.2:1 — fine. Keep the accent for primary actions only, or the
restraint that makes this palette work disappears.

**Always re-check contrast after a swap** — `--color-muted` on `--color-bg-alt` and white
on `--color-accent` are the two pairs that break first.

---

## 4. Swapping fonts

```css
--font-heading: 'Fraunces', Georgia, 'Times New Roman', serif;
--font-body: 'Inter', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
--fs-base: 17px;   /* body size  */
--lh-base: 1.65;   /* line height */
--fw-heading: 600;
```

Replace the Google Fonts `<link>` in **every** page `<head>` to match. Current link:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap">
```

**Alternative A — traditional:** Playfair Display 600/700 + Source Sans 3 400–600.
```
?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap
```
Source Sans 3 runs small — bump `--fs-base` to 18px.

**Alternative B — modern / virtual firm:** Manrope only, 600/700 for headings.
```
?family=Manrope:wght@400;500;600;700;800&display=swap
```
Set both `--font-heading` and `--font-body` to `'Manrope', system-ui, sans-serif` and
`--fw-heading: 700`.

Prices and dates use `font-variant-numeric: tabular-nums` (the `.num`, `.price-amount`,
`.deadline-date` and `table` selectors). Keep that if you change fonts — pick a face with
tabular figures.

To self-host instead and drop the last external request: download the woff2 files into
`fonts/`, add `@font-face` rules with `font-display: swap` at the top of `styles.css`, and
delete the Google `<link>` and both `preconnect`s.

---

## 5. Adding pages

### A service page
1. `cp service.html service-payroll.html`
2. Replace `{{SERVICE_NAME}}` (Payroll), `{{SERVICE_SLUG}}` (`service-payroll`),
   `{{SERVICE_PRICE_FROM}}` and `{{SERVICE_INTRO}}`.
3. Rewrite the three blocks of sample body copy — "Is this you?", "What's included" and
   the FAQ. They're written for Bookkeeping and will read wrong otherwise.
4. Update the `canonical`, `og:url` and both `@id`s in the JSON-LD to the new filename.
5. In the consult form, move `selected` to the matching `<option>` in `#s-service`.
6. Add the page to the `Services` dropdown in all four templates, plus the footer list and
   the home page services grid.

The intended set: Bookkeeping, Tax Preparation, Tax Planning, Payroll, Fractional CFO,
IRS Representation.

### An industry page
Same pattern from `industry.html`. Replace `{{INDUSTRY_NAME}}`, `{{INDUSTRY_PAINS}}`, the
3–6 pain cards, the case snapshot and the FAQ. The pains are the whole point of the page —
generic copy here is worse than no page. Add it to the `Industries` dropdown, the footer
and the home page chips row.

### A town / "areas we serve" page
Only build one if you can write genuinely local content: the town name in the H1 and
intro, local client examples (with permission), the relevant county/state filing quirks,
driving directions or "we meet clients at…", and 2–3 local links. A set of pages that
differ only by a swapped town name is thin content and will be treated as such. Put them
in `areas/` (the footer already links `areas/{{AREA_n}}.html`) and keep the file names
slugged: `areas/camden.html`.

### Recommended site architecture
```
/                             home
/services.html                services hub
/service-<slug>.html          one page per service       (6)
/industries.html              industries hub
/industry-<slug>.html         one page per industry       (5–7)
/pricing.html                 packages
/about.html                   firm story + full team bios with credentials
/areas/<town>.html            one page per town you genuinely serve
/resources.html               hub: calculators, checklists, articles
/tax-calculators.html         free tools — the strongest return-visit driver
/tax-deadlines.html           full calendar; refresh every December
/checklists.html              year-end checklist PDF (gate it or don't, but be consistent)
/blog.html + /blog/<post>     articles
/privacy.html /terms.html /accessibility.html
```

Hub pages (`services.html`, `industries.html`, `resources.html`, `about.html`) aren't in
this template — build them from `industry.html`'s simpler structure: hero, a card grid
linking to the children, a CTA.

---

## 6. Wiring up the booking link and the form

### Booking
Replace `{{BOOKING_URL}}` everywhere with the Calendly / Acuity / Microsoft Bookings link.
It appears in the header, hero, after every section, in the sidebar and in the mobile bar.

To embed the scheduler inline on the home page instead of linking out, put the embed URL in
`data-booking-embed` on the "Pick a time" button in the consult section. `main.js` then
builds the iframe **on click only** — no third-party script loads on page view, so the
booking widget costs nothing until someone wants it, and CLS stays at 0. Leave the token in
place and the button just behaves as a normal link.

### The form
Both forms are plain `POST` forms. Point `action="{{FORM_ENDPOINT}}"` at whatever you use:

| Service | Endpoint shape |
| --- | --- |
| Formspree | `https://formspree.io/f/<id>` |
| Netlify Forms | leave `action=""`, add `netlify` to the `<form>` tag |
| Basin | `https://usebasin.com/f/<id>` |
| Your own handler | any URL that accepts `application/x-www-form-urlencoded` |

Included already: a honeypot field (`company_website` — a filled value is dropped
silently), a `form_name` hidden field so you can tell the forms apart, inline validation
with `aria-invalid` and `aria-describedby`, and a `role="status"` live region for the
result message.

For a true inline success message without a page reload, swap the submit handler in
`main.js` section 5 for a `fetch()` POST and set `.form-status` to the success text.
Until then, use your form service's redirect/thank-you setting.

**Never add fields for sensitive data.** No SSN/SIN, no tax documents, no bank or account
numbers. The microcopy above each form says so and points to the portal — keep it. If a
client asks for a document upload on the public site, the answer is the secure portal.

---

## 7. Updating the deadline calendar each year

Every December (and after any IRS announcement):

1. In `index.html`, find `UPDATE YEARLY: dates below are for tax year {{TAX_YEAR}}`.
2. Update `{{TAX_YEAR}}` and the seven `<li>` items in `.deadline-list`. Update **both**
   the visible text and the `datetime` attribute on each `<time>` — they're read by
   different things.
3. Do the same for the shorter list in `service.html` ("Dates that matter for…").
4. Check each date against [irs.gov](https://www.irs.gov/filing) and the state revenue
   department. Dates falling on a weekend or federal holiday move to the next business day,
   which is why the template notes "Jan 31 falls on a Sunday" for 2027.
5. Add any state-specific dates the client's clients care about (franchise tax, state
   estimates, local business licences).
6. Keep the standing note: *"Dates for {{TAX_YEAR}}; confirm with IRS.gov and your state."*

The shipped dates cover tax year **2026** (filed in 2027). Nothing in the template guesses
dates automatically — on purpose. A wrong date auto-generated by JavaScript is worse than a
stale one a human checks.

The "Get reminders" form posts `email` plus `form_name: "Deadline reminders"`. Route it to a
tagged list, not the general enquiry inbox.

---

## 8. Local SEO checklist

- **Titles** — Home: `CPA & Accountant in {{CITY}}, {{STATE}} | Tax & Bookkeeping | {{FIRM_NAME}}`.
  Service: `{{SERVICE_NAME}} in {{CITY}}, {{STATE}} | {{FIRM_NAME}}`.
  Industry: `Accountant for {{INDUSTRY_NAME}} | {{CITY}} | {{FIRM_NAME}}`.
  Keep each under ~60 characters once tokens are filled.
- **Meta descriptions** — unique per page; the templates ship with distinct ones.
- **Canonical + Open Graph** on every page. Update them when you duplicate a file.
- **One `<h1>` per page**, then a sane H2/H3 ladder. Verified: all four pages have exactly one.
- **NAP consistency** — the footer `<address>`, the JSON-LD `PostalAddress` and the Google
  Business Profile must match character for character, including "Suite" vs "Ste".
- **JSON-LD shipped**: `AccountingService` (a `LocalBusiness` subtype) with `@id`, geo,
  `areaServed` city list, `openingHoursSpecification`, `aggregateRating`, `sameAs`,
  `hasOfferCatalog` and `founder`/`employee` as a `Person` with an
  `EducationalOccupationalCredential`; plus `FAQPage` mirroring the visible FAQ.
  Service and industry pages add `Service` + `BreadcrumbList` + `FAQPage`; pricing adds
  `OfferCatalog`. Everything references the home page's `#firm` node, so **the home page
  must stay published** for the graph to resolve.
- Validate with the [Rich Results Test](https://search.google.com/test/rich-results) after
  filling tokens. `aggregateRating` with invented numbers is a policy violation — leave the
  whole `aggregateRating` block out until the firm has real reviews.
- `openingHoursSpecification` ships as Mon–Fri 09:00–17:00. Change it to match `{{HOURS}}`,
  and add a second entry for tax-season Saturdays if the firm opens them.
- Add a `sitemap.xml` and `robots.txt` as you add pages; set up Google Business Profile and
  Bing Places with the same NAP.
- Plan an annual refresh: the deadline page, the year-end checklist and one article per
  service before January.

---

## 9. Accessibility & performance notes

Built in, don't remove:

- Skip link, `<main id="main">`, semantic landmarks on every page.
- Visible `:focus-visible` outlines in the accent colour.
- Real `<label>` for every input; `aria-invalid` + `aria-describedby` on errors; a
  `role="status" aria-live="polite"` region for form results.
- The pricing toggle is a genuine radio group in a `<fieldset>` with a `<legend>`, switched
  by CSS `:has()` so it works with JS off; JS only announces the change.
- `aria-expanded` on the mobile menu button and each dropdown toggle.
- FAQs are native `<details>`/`<summary>` — keyboard-accessible and searchable with no JS.
- Tables use `<th scope="col">` / `<th scope="row">`, a `<caption>`, and `.sr-only` text
  behind the ✓/— glyphs so a screen reader doesn't read bare punctuation.
- `@media (prefers-reduced-motion: reduce)` neutralises transitions.
- Tap targets ≥ 44px; no horizontal scroll at 360px; breakpoints at 640 / 900 / 1100px.
- Mobile sticky bar with `padding-bottom` on `<body>` so it never covers content.

Performance: the home page is ~66 KB of HTML and the stylesheet ~37 KB (both compress to a
fraction of that over the wire), with no framework, no icon font and no third-party script
on load. Keep it that way:

- Give every image explicit `width`/`height` (CLS).
- `fetchpriority="high"` on the hero image only; `loading="lazy"` on everything below the fold.
- Export real photos as WebP/AVIF at the size they're displayed; the hero should be under
  ~150 KB. Photos are the only thing likely to break the budget.
- Don't add a chat widget that covers content, a pop-up, or a carousel. They're absent by
  design, not by omission.

---

## 10. Honesty rules baked into the template

These aren't style preferences — getting them wrong creates real liability for an
accounting client:

- **Credentials.** Verify the licence and licence state with the client, in writing, before
  publishing. "CPA" is a protected title in every US state; so are "CA" and "chartered
  accountant" elsewhere. If the owner is an EA and not a CPA, the site must say EA. The
  footer line and the JSON-LD `hasCredential` both carry it.
- **No fake vendor logos.** Software and certification marks are text badges
  (`.badge`, `.software-list`). Only use a QuickBooks/Xero logo if the client is actually in
  the partner programme and follows its brand rules.
- **Ratings must be real.** `{{REVIEW_RATING}}` and `{{REVIEW_COUNT}}` appear next to every
  CTA *and* in `aggregateRating`. Pull them from the Google Business Profile the day you launch.
- **Sample content is flagged.** Every testimonial and case snapshot carries a
  `.sample-flag` ("Sample — replace") and a `<!-- REPLACE -->` comment. Remove the flag only
  when the quote is real and you have written permission to use the name, business and town.
- **Pricing language.** "Starting at", "fixed fee in writing before we start", "no hourly
  surprise bills". If the client does bill hourly, change the copy — don't keep the promise.
- **The disclaimer stays.** "This site provides general information, not tax or legal
  advice" in the footer, on every page.
- **No sensitive data in public forms**, and the microcopy that says so.

---

## 11. Per-client replacement checklist

Print this and work down it.

**Content**
- [ ] All tokens replaced — `grep -r '{{' .` returns nothing
- [ ] Every `REPLACE:` comment resolved — `grep -rn 'REPLACE' .`
- [ ] Testimonials replaced with real quotes (name · business · town) and `.sample-flag` removed
- [ ] Case snapshots replaced or deleted, with permission to publish
- [ ] Owner bio rewritten, including one genuine human detail
- [ ] Team cards: real names, titles, credentials — or delete the extra cards
- [ ] FAQ answers reviewed by the client (they're the firm's actual promises)
- [ ] Response promise is one the firm will keep
- [ ] Privacy policy, terms and accessibility pages written

**Brand**
- [ ] 5 custom properties swapped; hover/dark variants updated
- [ ] `theme-color` meta updated in all pages
- [ ] Logo SVG hexes updated in header **and** footer (2 per page)
- [ ] Google Fonts link updated in all pages if the type changed
- [ ] Contrast re-checked: white on accent, muted on bg-alt
- [ ] Favicon replaced (`img/favicon.svg`)

**Photos**
- [ ] Owner portrait (real, natural light — not stock)
- [ ] Team portraits, or the cards removed
- [ ] Office exterior / team at work
- [ ] `alt` text written for each; `width`/`height` match the real file
- [ ] OG images at 1200×630 for home, service, industry and pricing

**Wiring**
- [ ] `{{BOOKING_URL}}` live and tested on mobile
- [ ] `{{PORTAL_URL}}` and `{{PAYMENT_URL}}` live
- [ ] `{{FORM_ENDPOINT}}` tested end to end; both forms deliver
- [ ] Honeypot still in place; a spam submission is dropped
- [ ] Deadline-reminder signups route to a tagged list
- [ ] `tel:` links dial correctly from a phone

**Compliance & accuracy**
- [ ] Licence, licence state and credential letters verified in writing
- [ ] Review rating and count match the live Google profile
- [ ] `aggregateRating` removed if there aren't real reviews yet
- [ ] NAP identical in footer, JSON-LD and Google Business Profile
- [ ] Disclaimer present in the footer of every page
- [ ] No sensitive-data fields anywhere in the public forms

**Yearly (put it in the calendar for December)**
- [ ] `{{TAX_YEAR}}` and every deadline date updated, visible text **and** `datetime`
- [ ] Dates checked against IRS.gov and the state revenue department
- [ ] Weekend/holiday shifts applied
- [ ] Service-page deadline list updated too
- [ ] Prices and package contents reviewed
- [ ] Years in business, client count and review count refreshed
- [ ] Credentials re-verified (licences lapse)
- [ ] Copyright year range updated

**Before launch**
- [ ] Lighthouse mobile ≥ 95 on all four pages
- [ ] Keyboard-only pass: skip link, menu, dropdowns, toggle, forms, FAQs
- [ ] Tested with JS disabled: nav, pricing toggle, forms all usable
- [ ] No horizontal scroll at 360px
- [ ] Rich Results Test passes on all four page types
- [ ] `sitemap.xml` and `robots.txt` in place
