// 'US' picks IRS wording and the 1040/1120-S deadline table; 'CA' picks the CRA, T1/T2 and
// the RRSP and instalment dates. Nothing else in the component varies by country.
export type Jurisdiction = 'US' | 'CA';

export interface AccountingPackage {
  name: string;
  blurb: string;
  monthly: string; // display string with the currency symbol, e.g. "$450"
  annual: string;
  features: string[];
}

export interface AccountingContent {
  title: string;
  metaDescription: string;
  companyName: string;
  brandLead: string;
  brandTail: string | null;
  brandSub: string; // small line under the logo, e.g. "CPA & Advisors"
  city: string;
  location: string; // "Austin, TX", or just the city when no region was given
  jurisdiction: Jurisdiction;
  taxYear: string; // the year the visible deadline list covers
  eyebrow: string; // hero eyebrow; must not say "CPA" unless `credentials` is set
  heroHeadline: string;
  heroLead: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string | null; // null => mailto links hidden
  bookingHref: string; // scheduler URL, or '#consult' to scroll to the form
  portalUrl: string | null; // null => every Client Portal link is hidden
  paymentUrl: string | null; // null => every Make a Payment link is hidden
  googleReviewsUrl: string | null;
  responsePromise: string; // e.g. "one business day"
  hours: string;
  taxSeasonHours: string | null;
  // null => no credential claim anywhere: no "CPA-led", no licence line, no badges.
  // Never derive this from a prospect row; a licence is a verifiable fact.
  credentials: { suffix: string; licenceRegion: string; badges: string[] } | null;
  // null => rating, years in business and client count are hidden everywhere
  socialProof: {
    ratingValue: string; // "4.9"
    ratingCount: string; // "87"
    yearsBadge: string; // "14"
    clientCount: string; // "240"
  } | null;
  // null => the whole team section is hidden
  owner: { name: string; role: string; bio: string; linkedinUrl: string | null } | null;
  team: { name: string; title: string; credentials: string }[]; // empty => team grid hidden
  // Placeholder captions inside the photo slots; null => slots render as plain tonal panels
  photoCaptions: { hero: string; team: string } | null;
  software: string[]; // empty => the strip says we work in whatever they already use
  packages: [AccountingPackage, AccountingPackage, AccountingPackage];
  returnFrom: { personal: string; business: string };
  serviceFrom: { bookkeeping: string; payroll: string };
  priceNote: string; // currency and scope caveat under the packages
  // true => testimonials, case snapshots and the prices carry a "sample" marker. On a
  // prospect prototype that is the honest reading: none of those numbers are theirs yet.
  sampleProof: boolean;
  reviewTowns: string[]; // 3 entries, parallel to the static testimonials
  servingLine: string;
  serviceAreaIntro: string;
  faqAreasAnswer: string;
  towns: string[]; // empty => town chips hidden
  address: string[] | null; // null => address block hidden
  copyrightLine: string;
  footerCredentialLine: string | null;
  disclaimer: string;
}
