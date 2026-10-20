import type { AccountingContent } from './types';

// The showcase at /cpa. A fully-filled firm, so every optional block renders: credentials,
// social proof, the owner and team, photo captions, software, address.
// Fictional firm. Nothing here is a real licence, rating or review.
export const fraserRidgeDefaults: AccountingContent = {
  title: 'CPA & Accountant in Vancouver, BC | Tax & Bookkeeping | Fraser Ridge CPA',
  metaDescription:
    'Fraser Ridge CPA — a CPA-led accounting firm in Vancouver, BC. Fixed-fee bookkeeping, tax preparation and planning for small businesses and families. Replies in one business day.',
  companyName: 'Fraser Ridge CPA',
  brandLead: 'Fraser Ridge',
  brandTail: 'CPA',
  brandSub: 'CPA & Advisors',
  city: 'Vancouver',
  location: 'Vancouver, BC',
  jurisdiction: 'CA',
  taxYear: '2026',
  eyebrow: 'Vancouver CPA & Bookkeeping Firm',
  heroHeadline: 'Clear books, lower taxes, and an accountant who actually calls back.',
  heroLead:
    'Fraser Ridge CPA handles the books, payroll and taxes for small businesses, owners and families across Metro Vancouver — in person or entirely online.',
  phoneDisplay: '(604) 555-0172',
  phoneHref: 'tel:+16045550172',
  email: 'hello@fraserridgecpa.ca',
  bookingHref: '#consult',
  portalUrl: '#portal',
  paymentUrl: '#payment',
  googleReviewsUrl: '#reviews',
  responsePromise: 'one business day',
  hours: 'Mon–Fri 9am–5pm',
  taxSeasonHours: 'Mon–Sat 8am–7pm',
  credentials: {
    suffix: 'CPA, CA',
    licenceRegion: 'British Columbia',
    badges: ['CPA — British Columbia', 'QuickBooks ProAdvisor', 'Xero Certified']
  },
  socialProof: { ratingValue: '4.9', ratingCount: '87', yearsBadge: '14', clientCount: '240' },
  owner: {
    name: 'Sarah Whitcomb',
    role: 'Founder & Managing Partner',
    bio: 'Sarah founded Fraser Ridge CPA in 2012 after a decade in public practice, tired of watching small businesses get billed by the hour for a phone call. She reviews every monthly close personally. Outside the office you will find her coaching youth soccer and losing an argument with a 1972 pickup.',
    linkedinUrl: '#linkedin'
  },
  team: [
    { name: 'Marcus Reyes', title: 'Senior Accountant', credentials: 'CPA' },
    { name: 'Lena Okafor', title: 'Bookkeeping Manager', credentials: 'QuickBooks ProAdvisor' },
    { name: 'Tom Brennan', title: 'Payroll Specialist', credentials: 'PCP' }
  ],
  photoCaptions: {
    hero: '[ photo · 4:5 · Sarah at the Fraser Ridge office, natural light ]',
    team: '[ photo · 5:4 · the Fraser Ridge team at work ]'
  },
  software: ['QuickBooks Online', 'Xero', 'Wagepoint', 'Dext'],
  packages: [
    {
      name: 'Essentials',
      blurb: 'Clean books and a filed return, for owner-operators and side businesses.',
      monthly: '$450',
      annual: '$4,500',
      features: [
        'Monthly bookkeeping & reconciliation',
        'Profit & loss and balance sheet by the 15th',
        'Annual corporate return',
        'Email support in one business day'
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
      blurb: 'A finance function without a finance hire, for $1M+ businesses.',
      monthly: '$2,400',
      annual: '$24,000',
      features: [
        'Everything in Growth',
        'Monthly advisory session',
        'Cash-flow forecast & KPI dashboard',
        'Priority access by phone'
      ]
    }
  ],
  returnFrom: { personal: '$450', business: '$1,200' },
  serviceFrom: { bookkeeping: '$450', payroll: '$95' },
  priceNote:
    'Prices in CAD before tax, for a business with clean records and one bank account. Your final fee is confirmed in a written proposal before any work begins — no hourly surprise bills.',
  sampleProof: false,
  reviewTowns: ['Burnaby', 'North Vancouver', 'Richmond'],
  servingLine: 'Serving Vancouver, Burnaby, Richmond & the North Shore',
  serviceAreaIntro:
    'In-person appointments at our Main Street office, and online anywhere in British Columbia.',
  faqAreasAnswer:
    'Vancouver, Burnaby, Richmond, North and West Vancouver, New Westminster and Surrey — and online anywhere in Canada. Not sure? Get in touch.',
  towns: ['Burnaby', 'Richmond', 'North Vancouver', 'West Vancouver', 'New Westminster', 'Surrey'],
  address: ['Fraser Ridge CPA', '1820 Main Street, Suite 300', 'Vancouver, BC V5T 3B9'],
  copyrightLine: '© 2026 Fraser Ridge CPA',
  footerCredentialLine: 'Sarah Whitcomb, CPA, CA — registered with CPA British Columbia',
  disclaimer:
    'This site provides general information, not tax or legal advice. Reading it does not create a client relationship. Please speak with us about your own situation before acting.'
};
