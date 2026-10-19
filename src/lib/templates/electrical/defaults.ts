import type { ElectricalContent } from './types';

// Showcase content for /p/electrical. Sample business, sample numbers: nothing here is a real
// licence or a real review count.
export const northlineDefaults: ElectricalContent = {
  title: 'Electrician in Maple Grove, MN | 24/7 Emergency & Panel Upgrades | Northline Electric',
  metaDescription:
    'Northline Electric: licensed 24/7 emergency electricians in Maple Grove, MN. Written upfront pricing, same-day service, 2-year workmanship warranty.',
  companyName: 'Northline Electric',
  brandLead: 'Northline',
  brandTail: 'Electric',
  city: 'Maple Grove',
  heroHeadline: 'Licensed Electricians in Maple Grove, MN',
  availabilityPill: 'Electricians available today in Maple Grove',
  phoneDisplay: '(763) 555-0142',
  phoneHref: 'tel:+17635550142',
  email: 'hello@northlineelectric.example',
  licenceLine: 'Licensed & Insured · Master Electrician Lic. #0000000',
  licenceShort: 'Lic. #0000000',
  bookingLicenceLine: 'Licensed & insured · Lic. #0000000',
  licenceFaqClause: 'holds Minnesota master electrician licence #0000000',
  foundedLine: 'Locally owned electricians serving the north metro since 2008.',
  heroLead:
    'You get a written, upfront price before we touch a wire. No surprises, no all-day waiting windows, and every job permitted and inspected.',
  whyLead: 'Locally owned since 2008. Our electricians live in the towns they work in.',
  currencyNote: 'Prices in USD before tax.',
  financingProvider: 'Partner Finance',
  servingLine: 'Serving Maple Grove, Plymouth, Osseo & Blaine',
  serviceAreaHeading: 'Electricians across the north metro',
  serviceAreaIntro: 'Same-day service anywhere within 25 miles of Maple Grove.',
  faqAreasAnswer:
    'Maple Grove, Plymouth, Osseo, Brooklyn Park, Blaine and Coon Rapids. Not sure? Call us.',
  socialProof: {
    ratingValue: '4.9',
    ratingCount: '212',
    yearsBadge: '18',
    jobsCompleted: '4,800+',
    averageArrival: 'Same day'
  },
  photoCaptions: {
    hero: '[ photo · 4:5 · Northline electrician at a customer’s panel ]',
    team: '[ photo · 5:4 · the Northline crew with branded vans ]',
    map: '[ map · 4:3 · north metro service area ]'
  },
  insuranceClaim: 'carries $2M liability insurance and workers’ compensation coverage.',
  postal: { label: 'ZIP code', hint: 'Enter a 5-digit ZIP code.', pattern: '^\d{5}(-\d{4})?$' },
  towns: ['Maple Grove', 'Plymouth', 'Osseo', 'Brooklyn Park', 'Blaine', 'Coon Rapids'],
  reviewTowns: ['Maple Grove', 'Osseo', 'Plymouth'],
  serviceHrefs: { 'Emergency Repair': 'tel:+17635550142' },
  address: ['Northline Electric', '123 Main Street', 'Maple Grove, MN 55369'],
  copyrightLine: '© 2026 Northline Electric',
  footerLicenceLine: 'Lic. #0000000 · Licensed, Bonded & Insured'
};
