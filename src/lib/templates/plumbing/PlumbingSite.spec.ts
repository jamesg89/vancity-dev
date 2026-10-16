import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import PlumbingSite from './PlumbingSite.svelte';
import type { PlumbingContent } from './types';

// A prospect-shaped fixture. Deliberately NOT spread from octopusDefaults: every field is
// set here (the type enforces it), so anything Octopus-specific in the output can only
// come from a literal left behind in PlumbingSite.svelte.
const turk: PlumbingContent = {
  title: 'Plumber in Austin, TX | Turk Plumbing',
  metaDescription: 'Turk Plumbing, licensed plumbers in Austin, TX.',
  companyName: 'Turk Plumbing',
  brandLead: 'Turk',
  brandTail: 'Plumbing',
  city: 'Austin',
  heroHeadline: 'Fast, Honest Plumbing in Austin, TX',
  availabilityPill: 'Plumbers available now in Austin',
  phoneDisplay: '(512) 555-0147',
  phoneHref: 'tel:5125550147',
  email: null,
  licenceLine: 'Licensed & Insured',
  licenceShort: null,
  bookingLicenceLine: 'Licensed & insured',
  licenceFaqClause: 'is licensed',
  foundedLine: 'Family-owned plumbers serving Greater Austin.',
  heroLead: 'We find the problem, quote a flat price, and start only when you approve it.',
  whyLead: 'Our plumbers live in the neighbourhoods they work in.',
  currencyNote: 'Prices in USD before tax.',
  financingProvider: 'our lending partner',
  servingLine: 'Serving Austin, Round Rock & Cedar Park',
  serviceAreaHeading: 'Plumbers across Greater Austin',
  serviceAreaIntro: 'Same-day dispatch anywhere in the greater Austin area.',
  faqAreasAnswer: 'Austin, Round Rock, Pflugerville and Cedar Park. Not sure? Call us.',
  socialProof: null,
  photoCaptions: null,
  insuranceClaim: '',
  postal: { label: 'ZIP code', hint: 'Enter a 5-digit ZIP code.', pattern: '^\\d{5}$' },
  towns: ['Round Rock', 'Pflugerville', 'Cedar Park'],
  reviewTowns: ['Round Rock', 'Pflugerville', 'Cedar Park'],
  serviceHrefs: { '24/7 Emergency': 'tel:5125550147' },
  address: null,
  copyrightLine: '© 2026 Turk Plumbing',
  footerLicenceLine: 'Licensed & Insured'
};

// Same prospect, but with a licence number supplied, so the branches that only render
// when `licenceShort` is set (float card, trust item, FAQ clause, booking line) are swept too.
const turkLicensed: PlumbingContent = {
  ...turk,
  licenceLine: 'Licensed & Insured · Lic. #TX-48213',
  licenceShort: 'Lic. #TX-48213',
  bookingLicenceLine: 'Licensed & insured · Lic. #TX-48213',
  licenceFaqClause: 'holds Texas licence #TX-48213',
  footerLicenceLine: 'Lic. #TX-48213 · Licensed, Bonded & Insured'
};

// Octopus / Vancouver values that must never appear on a prospect page. Plain strings are
// matched case-insensitively as substrings; `BC` is two letters, so it is a whole word.
const LEAK_STRINGS = [
  'Octopus',
  'Eight arms',
  'Vancouver',
  'Burnaby',
  'Richmond',
  'North Shore',
  'CAD',
  'Financeit',
  'WorkSafe',
  'PL-204871',
  '604',
  'V5T',
  '612+',
  '17+',
  '9,400',
  '$5M',
  '2009',
  'Vancity'
];

function findLeak(html: string, label: string): string | null {
  const index =
    label === 'BC' ? html.search(/\bBC\b/) : html.toLowerCase().indexOf(label.toLowerCase());
  if (index < 0) return null;
  return html.slice(Math.max(0, index - 60), index + 60);
}

function renderedMarkup(content: PlumbingContent): string {
  const { body, head } = render(PlumbingSite, { props: { content } });
  // SVG path data is numeric noise, not copy.
  return (head + body).replace(/\sd="[^"]*"/g, '');
}

const fixtures: [string, PlumbingContent][] = [
  ['no licence number', turk],
  ['with a licence number', turkLicensed]
];

for (const [name, content] of fixtures) {
  describe(`PlumbingSite with a prospect-shaped fixture (${name})`, () => {
    const html = renderedMarkup(content);

    it('renders the prospect company and phone', () => {
      expect(html).toContain('Turk');
      expect(html).toContain('(512) 555-0147');
    });

    for (const label of [...LEAK_STRINGS, 'BC']) {
      it(`leaks no "${label}"`, () => {
        expect(findLeak(html, label), `"${label}" found near this markup`).toBeNull();
      });
    }

    it('renders no mailto link without an email', () => {
      expect(html).not.toContain('mailto:');
    });
  });
}

describe('PlumbingSite licence branches', () => {
  it('renders the licence number everywhere it is supplied', () => {
    const html = renderedMarkup(turkLicensed);
    expect(html).toContain('holds Texas licence #TX-48213');
    expect(html).toContain('Licensed &amp; insured · Lic. #TX-48213');
    expect(html.split('Lic. #TX-48213').length - 1).toBeGreaterThanOrEqual(5);
  });

  it('makes no licence-number claim when none is supplied', () => {
    const html = renderedMarkup(turk);
    expect(html).toContain('Turk Plumbing is licensed');
    expect(html).not.toContain('Lic. #');
  });
});
