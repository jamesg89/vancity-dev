import type { ReadyProspect } from '$lib/prospects/types';
import type { ElectricalContent } from './types';
import {
  clean,
  joinAmp,
  joinAnd,
  postalFor,
  toTelHref,
  uniqueTowns
} from '../plumbing/derive';

export function deriveElectricalContent(prospect: ReadyProspect): ElectricalContent {
  const companyName = clean(prospect.companyName);
  const city = clean(prospect.city);
  const region = clean(prospect.region) || null;
  const location = region ? `${city}, ${region}` : city;

  const words = companyName.split(' ');
  const brandTail = words.length > 1 ? words[words.length - 1] : null;
  const brandLead = brandTail === null ? companyName : words.slice(0, -1).join(' ');

  // A phone with no digits is not dialable, so the CTA points at the booking form instead.
  const phoneHref = toTelHref(prospect.phone) || '#book';
  const phoneDisplay = clean(prospect.phone);

  const towns = uniqueTowns(prospect.nearbyAreas, city, region);
  const reviewSource = towns.length > 0 ? towns : [city];
  const reviewTowns = [0, 1, 2].map((i) => reviewSource[i % reviewSource.length]);

  return {
    title: `Electrician in ${location} | 24/7 Emergency & Panel Upgrades | ${companyName}`,
    metaDescription: `${companyName}: licensed 24/7 emergency electricians in ${location}. Written upfront pricing, same-day service, 2-year workmanship warranty.`,
    companyName,
    brandLead,
    brandTail,
    city,
    heroHeadline: `Licensed Electricians in ${location}`,
    availabilityPill: `Electricians available today in ${city}`,
    phoneDisplay,
    phoneHref,
    email: null,
    licenceLine: 'Licensed & Insured',
    licenceShort: null,
    bookingLicenceLine: 'Licensed & insured',
    licenceFaqClause: 'is licensed',
    foundedLine: `Local electricians serving ${city} and the surrounding area.`,
    heroLead:
      'You get a written, upfront price before we touch a wire. No surprises, and every job permitted and inspected.',
    whyLead: 'Honest advice, a written price, and electricians who treat your home with care.',
    currencyNote: 'Prices shown before tax.',
    financingProvider: 'our lending partner',
    servingLine: `Serving ${joinAmp([city, ...towns])}`,
    serviceAreaHeading: `Electricians across Greater ${city}`,
    serviceAreaIntro: `Same-day service anywhere in the greater ${city} area.`,
    faqAreasAnswer: `${joinAnd([city, ...towns])}. Not sure? Get in touch.`,
    socialProof: null,
    photoCaptions: null,
    insuranceClaim: 'carries liability insurance.',
    postal: postalFor(region),
    towns,
    reviewTowns,
    serviceHrefs: { 'Emergency Repair': phoneHref },
    address: null,
    copyrightLine: `© ${companyName}`,
    footerLicenceLine: 'Licensed & Insured'
  };
}
