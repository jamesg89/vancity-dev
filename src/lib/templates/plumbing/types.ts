export interface PlumbingContent {
  title: string;
  metaDescription: string;
  companyName: string;
  brandLead: string;
  brandTail: string | null;
  city: string;
  metroLabel: string;
  heroHeadline: string;
  availabilityPill: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  licenceLine: string;
  licenceShort: string | null;
  foundedLine: string;
  whyLead: string;
  servingLine: string;
  serviceAreaHeading: string;
  serviceAreaIntro: string;
  faqAreasAnswer: string;
  // null => every block built from these numbers is hidden
  socialProof: {
    ratingValue: string; // "4.9"
    ratingCount: string; // "612+"
    yearsBadge: string; // "17+"
    jobsCompleted: string; // "9,400+"
    averageArrival: string; // "47 min"
  } | null;
  // FAQ clause after the licence sentence; empty => the sentence ends after the licence
  insuranceClaim: string;
  postal: { label: string; hint: string; pattern: string }; // pattern is passed to new RegExp()
  towns: string[]; // empty => town list hidden
  reviewTowns: string[]; // 3 entries, parallel to the static reviews
  serviceHrefs: Record<string, string>; // service title -> href; absent => '#book'
  address: string[] | null; // null => address block hidden
  copyrightLine: string;
  footerLicenceLine: string;
}
