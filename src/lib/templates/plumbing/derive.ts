import type { ReadyProspect } from '$lib/prospects/types';
import type { PlumbingContent } from './types';

const CA_REGIONS = new Set([
  'BC',
  'AB',
  'SK',
  'MB',
  'ON',
  'QC',
  'NB',
  'NS',
  'PE',
  'PEI',
  'NL',
  'YT',
  'NT',
  'NU',
  'BRITISH COLUMBIA',
  'ALBERTA',
  'SASKATCHEWAN',
  'MANITOBA',
  'ONTARIO',
  'QUEBEC',
  'NEW BRUNSWICK',
  'NOVA SCOTIA',
  'PRINCE EDWARD ISLAND',
  'NEWFOUNDLAND AND LABRADOR',
  'YUKON',
  'NORTHWEST TERRITORIES',
  'NUNAVUT'
]);

// US ZIP unless the region is positively a Canadian province. A Canadian-format field that
// rejects a valid ZIP is the worse failure, so unknown and null regions get the US form.
export function postalFor(region: string | null): PlumbingContent['postal'] {
  const key = region?.toUpperCase() ?? '';
  if (CA_REGIONS.has(key)) {
    return {
      label: 'Postal code',
      hint: 'Enter a valid postal code, like A1A 1A1.',
      pattern: '^[A-Za-z]\\d[A-Za-z] ?\\d[A-Za-z]\\d$'
    };
  }
  return {
    label: 'ZIP code',
    hint: 'Enter a 5-digit ZIP code.',
    pattern: '^\\d{5}(-\\d{4})?$'
  };
}

// Reduces a phone number to digits and an optional leading "+", so nothing in the value can
// break out of the href attribute. A trailing extension is dropped rather than dialled.
export function toTelHref(phone: string | null): string {
  if (!phone) return '';
  const trimmed = phone.trim().replace(/\s*(?:ext\.?|x|#)\s*\d+\s*$/i, '');
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';
  return `tel:${trimmed.startsWith('+') ? '+' : ''}${digits}`;
}

export function clean(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

// The owner types "Austin, TX" naturally, and the form splits on the comma, so the city and
// the region can arrive as areas. Seeding the seen-set drops them; the city and region are
// already named on their own in every line that lists towns.
export function uniqueTowns(areas: string[], city: string, region: string | null): string[] {
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
export function joinAmp(items: string[]): string {
  if (items.length < 2) return items.join('');
  return `${items.slice(0, -1).join(', ')} & ${items[items.length - 1]}`;
}

// "A", "A and B", "A, B and C"
export function joinAnd(items: string[]): string {
  if (items.length < 2) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

export function derivePlumbingContent(prospect: ReadyProspect): PlumbingContent {
  const companyName = clean(prospect.companyName);
  const city = clean(prospect.city);
  const region = clean(prospect.region) || null;
  const location = region ? `${city}, ${region}` : city;

  const words = companyName.split(' ');
  const brandTail = words.length > 1 ? words[words.length - 1] : null;
  const brandLead = brandTail === null ? companyName : words.slice(0, -1).join(' ');

  const telHref = toTelHref(prospect.phone);
  // A phone with no digits is not dialable, so the CTA points at the booking form instead.
  const phoneHref = telHref || '#book';
  const phoneDisplay = clean(prospect.phone);

  const towns = uniqueTowns(prospect.nearbyAreas, city, region);
  const reviewSource = towns.length > 0 ? towns : [city];
  const reviewTowns = [0, 1, 2].map((i) => reviewSource[i % reviewSource.length]);

  return {
    title: `Plumber in ${location} | 24/7 Emergency Plumbing | ${companyName}`,
    metaDescription: `${companyName} — licensed 24/7 emergency plumbers in ${location}. Flat upfront pricing, on-site in 60 minutes, 2-year written guarantee.`,
    companyName,
    brandLead,
    brandTail,
    city,
    heroHeadline: `Fast, Honest Plumbing in ${location}`,
    availabilityPill: `Plumbers available now in ${city}`,
    phoneDisplay,
    phoneHref,
    email: null,
    licenceLine: 'Licensed & Insured',
    licenceShort: null,
    bookingLicenceLine: 'Licensed & insured',
    licenceFaqClause: 'is licensed',
    foundedLine: `Local plumbers serving ${city} and the surrounding area.`,
    heroLead:
      'We find the problem, quote a flat price, and start only when you approve it.',
    whyLead: 'Honest advice, a flat price, and a plumber who treats your home with care.',
    currencyNote: 'Prices shown before tax.',
    financingProvider: 'our lending partner',
    servingLine: `Serving ${joinAmp([city, ...towns])}`,
    serviceAreaHeading: `Plumbers across Greater ${city}`,
    serviceAreaIntro: `Same-day dispatch anywhere in the greater ${city} area.`,
    faqAreasAnswer: `${joinAnd([city, ...towns])}. Not sure? Get in touch.`,
    socialProof: null,
    photoCaptions: null,
    insuranceClaim: 'carries liability insurance.',
    postal: postalFor(region),
    towns,
    reviewTowns,
    serviceHrefs: { '24/7 Emergency': phoneHref },
    address: null,
    copyrightLine: `© ${companyName}`,
    footerLicenceLine: 'Licensed & Insured'
  };
}
