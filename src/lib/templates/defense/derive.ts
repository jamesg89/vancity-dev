import type { ReadyProspect } from '$lib/prospects/types';
import { toTelHref } from '$lib/templates/plumbing/derive';
import type { DefenseContent } from './types';

function clean(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function uniqueAreas(areas: string[], city: string, region: string | null): string[] {
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

function joinAnd(items: string[]): string {
  if (items.length < 2) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

// A prospect row knows a name, a city and a phone, nothing else. Credentials, results and
// reviews are claims a regulator can check, so they are never invented: those blocks are
// null/empty here and the template hides them.
export function deriveDefenseContent(prospect: ReadyProspect): DefenseContent {
  const firmName = clean(prospect.companyName);
  const city = clean(prospect.city);
  const region = clean(prospect.region) || null;
  const location = region ? `${city}, ${region}` : city;
  const tel = toTelHref(prospect.phone);
  const areas = uniqueAreas(prospect.nearbyAreas, city, region);
  const monogram = (firmName.match(/[A-Za-z0-9]/)?.[0] ?? '·').toUpperCase();

  return {
    title: `Criminal Defense Lawyer in ${location} | Free Consultation 24/7 | ${firmName}`,
    metaDescription: `${firmName}: criminal defense lawyers in ${location}. Free, confidential consultation, available 24/7. Call ${clean(prospect.phone)}.`,
    firmName,
    monogram,
    city,
    location,
    heroHeadline: `Arrested or charged in ${city}? Talk to a defense lawyer tonight.`,
    phoneDisplay: clean(prospect.phone),
    phoneHref: tel || '#contact',
    textHref: tel ? tel.replace(/^tel:/, 'sms:') : '#contact',
    servingLine: `Serving ${joinAnd([city, ...areas])}`,
    areas,
    faqAreasAnswer: `${joinAnd([city, ...areas])}. Not sure whether we cover your court? Call and ask.`,
    address: null,
    credentials: null,
    proof: null,
    results: [],
    reviews: [],
    feeModel: 'Clear fees explained before we start',
    responsibleAttorney: firmName,
    copyrightLine: `© ${firmName}`
  };
}
