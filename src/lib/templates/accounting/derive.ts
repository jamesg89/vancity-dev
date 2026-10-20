import type { ReadyProspect } from '$lib/prospects/types';
import { isCanadianRegion, toTelHref } from '$lib/templates/plumbing/derive';
import type { AccountingContent, AccountingPackage } from './types';

function clean(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

// The owner types "Austin, TX" naturally, and the form splits on the comma, so the city and
// the region can arrive as areas. Seeding the seen-set drops them; the city and region are
// already named on their own in every line that lists towns.
function uniqueTowns(areas: string[], city: string, region: string | null): string[] {
  const seen = new Set<string>([city.toLowerCase()]);
  if (region) seen.add(region.toLowerCase());
  const out: string[] = [];
  for (const area of areas) {
    const town = clean(area);
    const key = town.toLowerCase();
    if (!town || seen.has(key)) continue;
    seen.add(key);
    out.push(town);
  }
  return out;
}

// "A", "A & B", "A, B & C"
function joinAmp(items: string[]): string {
  if (items.length < 2) return items.join('');
  return `${items.slice(0, -1).join(', ')} & ${items[items.length - 1]}`;
}

// "A", "A and B", "A, B and C"
function joinAnd(items: string[]): string {
  if (items.length < 2) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

// The tax year the shipped deadline table covers.
// UPDATE YEARLY: bump this and the two tables in AccountingSite.svelte together.
const TAX_YEAR = '2026';

// Illustrative starting fees for a prospect prototype. They are flagged on the page by
// `sampleProof`, because they are our numbers, not the firm's.
function samplePackages(): [AccountingPackage, AccountingPackage, AccountingPackage] {
  return [
    {
      name: 'Essentials',
      blurb: 'Clean books and a filed return, for owner-operators and side businesses.',
      monthly: '$450',
      annual: '$4,500',
      features: [
        'Monthly bookkeeping & reconciliation',
        'Profit & loss and balance sheet by the 15th',
        'Annual business return',
        'A named advisor who replies by email'
      ]
    },
    {
      name: 'Growth',
      blurb: 'Books, payroll and year-round planning for a growing team.',
      monthly: '$950',
      annual: '$9,500',
      features: [
        'Everything in Essentials',
        'Payroll for up to 10 people',
        'Quarterly planning & tax projections',
        "Owner's personal return included"
      ]
    },
    {
      name: 'CFO',
      blurb: 'A finance function without a finance hire.',
      monthly: '$2,400',
      annual: '$24,000',
      features: [
        'Everything in Growth',
        'Monthly advisory session',
        'Cash-flow forecast & KPI dashboard',
        'Priority access by phone'
      ]
    }
  ];
}

export function deriveAccountingContent(prospect: ReadyProspect): AccountingContent {
  const companyName = clean(prospect.companyName);
  const city = clean(prospect.city);
  const region = clean(prospect.region) || null;
  const location = region ? `${city}, ${region}` : city;
  const canadian = isCanadianRegion(region);

  // The logo sets the last word apart; a one-word name has no tail and renders whole.
  const words = companyName.split(' ');
  const brandTail = words.length > 1 ? words[words.length - 1] : null;
  const brandLead = brandTail === null ? companyName : words.slice(0, -1).join(' ');

  const telHref = toTelHref(prospect.phone);
  // A phone with no digits is not dialable, so the CTA points at the booking form instead.
  const phoneHref = telHref || '#consult';

  const towns = uniqueTowns(prospect.nearbyAreas, city, region);
  const areaList = [city, ...towns];
  // Three towns parallel to the three static testimonials, repeating when fewer were given.
  const reviewSource = towns.length > 0 ? towns : [city];
  const reviewTowns = [0, 1, 2].map((i) => reviewSource[i % reviewSource.length]);

  return {
    title: `Accountant in ${location} | Tax & Bookkeeping | ${companyName}`,
    metaDescription: `${companyName} — bookkeeping, tax preparation and year-round tax planning for small businesses and families in ${location}. Fixed monthly fees and a reply within one business day.`,
    companyName,
    brandLead,
    brandTail,
    // "CPA" is a protected title, so an unverified firm gets the generic line.
    brandSub: 'Accounting & Tax',
    city,
    location,
    jurisdiction: canadian ? 'CA' : 'US',
    taxYear: TAX_YEAR,
    eyebrow: `${city} Bookkeeping & Tax Firm`,
    heroHeadline: 'Clear books, lower taxes, and an accountant who actually calls back.',
    heroLead: `${companyName} handles the books, payroll and taxes for small businesses, owners and families across ${joinAmp(areaList)} — in person or entirely online.`,
    phoneDisplay: clean(prospect.phone),
    phoneHref,
    email: null,
    bookingHref: '#consult',
    portalUrl: null,
    paymentUrl: null,
    googleReviewsUrl: null,
    responsePromise: 'one business day',
    hours: 'Mon–Fri, business hours',
    taxSeasonHours: null,
    credentials: null,
    socialProof: null,
    owner: null,
    team: [],
    photoCaptions: null,
    software: [],
    packages: samplePackages(),
    returnFrom: { personal: '$450', business: '$1,200' },
    serviceFrom: { bookkeeping: '$450', payroll: '$95' },
    priceNote: canadian
      ? 'Sample pricing in CAD before tax. Your fee is confirmed in a written proposal before any work begins — never an unexpected bill.'
      : 'Sample pricing before tax. Your fee is confirmed in a written proposal before any work begins — never an unexpected bill.',
    sampleProof: true,
    reviewTowns,
    servingLine: `Serving ${joinAmp(areaList)}`,
    serviceAreaIntro: `In-person appointments in ${city}, and online anywhere in ${region ?? 'the area'}.`,
    faqAreasAnswer: `${joinAnd(areaList)}. Not sure? Get in touch.`,
    towns,
    address: null,
    copyrightLine: `© ${companyName}`,
    footerCredentialLine: null,
    disclaimer:
      'This site provides general information, not tax or legal advice. Reading it does not create a client relationship.'
  };
}
