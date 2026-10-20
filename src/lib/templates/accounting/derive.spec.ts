import { describe, it, expect } from 'vitest';
import { deriveAccountingContent } from './derive';
import type { ReadyProspect } from '$lib/prospects/types';

const base: ReadyProspect = {
  slug: 'turk-accounting',
  companyName: 'Turk Accounting',
  industry: 'accounting',
  city: 'Austin',
  region: 'TX',
  phone: '(512) 555-0147',
  nearbyAreas: ['Round Rock', 'Cedar Park'],
  createdAt: 0,
  archived: false
};

const derive = (over: Partial<ReadyProspect> = {}) => deriveAccountingContent({ ...base, ...over });

describe('deriveAccountingContent', () => {
  it('builds the local title and description', () => {
    const c = derive();
    expect(c.title).toBe('Accountant in Austin, TX | Tax & Bookkeeping | Turk Accounting');
    expect(c.metaDescription).toContain('Turk Accounting');
    expect(c.metaDescription).toContain('Austin, TX');
  });

  it('splits the company name for the logo', () => {
    expect(derive().brandLead).toBe('Turk');
    expect(derive().brandTail).toBe('Accounting');
    const oneWord = derive({ companyName: 'Ledgerworks' });
    expect(oneWord.brandLead).toBe('Ledgerworks');
    expect(oneWord.brandTail).toBeNull();
  });

  it('lists the city and the nearby towns, in order, without repeating them', () => {
    // The owner typed "Austin, TX" into the areas box, so both arrive as areas.
    const c = derive({ nearbyAreas: ['Round Rock', 'Austin', 'TX', 'Cedar Park', 'round rock'] });
    expect(c.towns).toEqual(['Round Rock', 'Cedar Park']);
    expect(c.servingLine).toBe('Serving Austin, Round Rock & Cedar Park');
    expect(c.faqAreasAnswer).toBe('Austin, Round Rock and Cedar Park. Not sure? Get in touch.');
  });

  it('falls back to the city when no areas were given', () => {
    const c = derive({ nearbyAreas: [] });
    expect(c.towns).toEqual([]);
    expect(c.servingLine).toBe('Serving Austin');
    expect(c.reviewTowns).toEqual(['Austin', 'Austin', 'Austin']);
  });

  it('drops the region from the location when there is none', () => {
    const c = derive({ region: null });
    expect(c.location).toBe('Austin');
    expect(c.title).toBe('Accountant in Austin | Tax & Bookkeeping | Turk Accounting');
  });

  it('dials the prospect phone, and falls back to the form when it cannot', () => {
    expect(derive().phoneHref).toBe('tel:5125550147');
    expect(derive({ phone: 'x 123' }).phoneHref).toBe('#consult');
  });

  // The whole point of the null-able fields: a prospect row carries no licence, no rating and
  // no named people, so the page must claim none of them.
  it('invents no credential, rating, person or address', () => {
    const c = derive();
    expect(c.credentials).toBeNull();
    expect(c.socialProof).toBeNull();
    expect(c.owner).toBeNull();
    expect(c.team).toEqual([]);
    expect(c.address).toBeNull();
    expect(c.email).toBeNull();
    expect(c.photoCaptions).toBeNull();
    expect(c.footerCredentialLine).toBeNull();
    expect(c.googleReviewsUrl).toBeNull();
  });

  it('keeps "CPA" out of the brand line and the eyebrow', () => {
    const c = derive();
    expect(c.brandSub).toBe('Accounting & Tax');
    expect(c.eyebrow).toBe('Austin Bookkeeping & Tax Firm');
  });

  it('marks the sample prices and reviews as samples', () => {
    const c = derive();
    expect(c.sampleProof).toBe(true);
    expect(c.priceNote).toContain('Sample pricing');
  });

  it('has no portal or payment link until the firm has one', () => {
    const c = derive();
    expect(c.portalUrl).toBeNull();
    expect(c.paymentUrl).toBeNull();
    expect(c.bookingHref).toBe('#consult');
  });

  describe('jurisdiction', () => {
    it('is CA for a Canadian province, by code or by name', () => {
      expect(derive({ region: 'BC' }).jurisdiction).toBe('CA');
      expect(derive({ region: 'bc' }).jurisdiction).toBe('CA');
      expect(derive({ region: 'Ontario' }).jurisdiction).toBe('CA');
      expect(derive({ region: 'BC' }).priceNote).toContain('CAD');
    });

    it('is US for a US state, an unknown region and no region', () => {
      expect(derive({ region: 'TX' }).jurisdiction).toBe('US');
      expect(derive({ region: 'Somewhere' }).jurisdiction).toBe('US');
      expect(derive({ region: null }).jurisdiction).toBe('US');
      expect(derive().priceNote).not.toContain('CAD');
    });
  });

  it('carries three sample packages with the middle one priced between the others', () => {
    const c = derive();
    expect(c.packages).toHaveLength(3);
    expect(c.packages.map((p) => p.name)).toEqual(['Essentials', 'Growth', 'CFO']);
    for (const pkg of c.packages) {
      expect(pkg.monthly).toMatch(/^\$[\d,]+$/);
      expect(pkg.annual).toMatch(/^\$[\d,]+$/);
      expect(pkg.features.length).toBeGreaterThan(2);
    }
  });

  it('squashes whitespace in the fields it echoes', () => {
    const c = derive({ companyName: '  Turk   Accounting ', city: ' Austin  ' });
    expect(c.companyName).toBe('Turk Accounting');
    expect(c.city).toBe('Austin');
  });
});
