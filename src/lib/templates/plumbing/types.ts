export interface PlumbingContent {
  title: string;
  metaDescription: string;
  companyName: string;
  brandLead: string;
  brandTail: string | null;
  city: string;
  cityRegion: string;
  metroLabel: string;
  heroHeadline: string;
  availabilityPill: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  licenceLine: string;
  licenceShort: string | null;
  foundedLine: string;
  servingLine: string;
  serviceAreaHeading: string;
  serviceAreaIntro: string;
  faqAreasAnswer: string;
  towns: string[]; // empty => town list hidden
  reviewTowns: string[]; // 3 entries, parallel to the static reviews
  serviceHrefs: Record<string, string>; // service title -> href; absent => '#book'
  address: string[] | null; // null => address block hidden
  copyrightLine: string;
  footerLicenceLine: string;
}
