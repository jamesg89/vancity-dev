import { describe, it, expect } from 'vitest';
import { derivePlumbingContent, toTelHref } from './derive';
import type { Prospect } from '$lib/prospects/types';

const turk: Prospect = {
  slug: 'turk-plumbing',
  companyName: 'Turk Plumbing',
  industry: 'plumbing',
  city: 'Austin',
  region: 'TX',
  phone: '(512) 555-0147',
  nearbyAreas: ['Round Rock', 'Pflugerville', 'Cedar Park'],
  createdAt: 0,
  archived: false
};

describe('derivePlumbingContent', () => {
  it('substitutes company, city and phone', () => {
    const c = derivePlumbingContent(turk);
    expect(c.companyName).toBe('Turk Plumbing');
    expect(c.brandLead).toBe('Turk');
    expect(c.brandTail).toBe('Plumbing');
    expect(c.heroHeadline).toBe('Fast, Honest Plumbing in Austin, TX');
    expect(c.title).toContain('Turk Plumbing');
    expect(c.availabilityPill).toContain('Austin');
    expect(c.phoneDisplay).toBe('(512) 555-0147');
    expect(c.phoneHref).toBe('tel:5125550147');
  });

  it('leaves no Vancouver defaults behind', () => {
    const blob = JSON.stringify(derivePlumbingContent(turk));
    for (const s of [
      'Vancouver',
      'Burnaby',
      'Richmond',
      'North Shore',
      'Octopus',
      '604',
      'PL-204871',
      'V5T',
      'CAD',
      'Financeit',
      'WorkSafe',
      '2009',
      '$5M'
    ])
      expect(blob).not.toContain(s);
    expect(blob).not.toMatch(/\bBC\b/);
  });

  it('handles a single-word company name', () => {
    const c = derivePlumbingContent({ ...turk, companyName: 'Turk' });
    expect(c.brandLead).toBe('Turk');
    expect(c.brandTail).toBeNull();
  });

  it('splits a longer name on the final word', () => {
    const c = derivePlumbingContent({ ...turk, companyName: '  Turk & Sons   Plumbing ' });
    expect(c.companyName).toBe('Turk & Sons Plumbing');
    expect(c.brandLead).toBe('Turk & Sons');
    expect(c.brandTail).toBe('Plumbing');
  });

  it('falls back when nearbyAreas is empty', () => {
    const c = derivePlumbingContent({ ...turk, nearbyAreas: [] });
    expect(c.towns).toEqual([]);
    expect(c.serviceAreaIntro).toContain('greater Austin');
    expect(c.reviewTowns).toEqual(['Austin', 'Austin', 'Austin']);
    expect(c.servingLine).toBe('Serving Austin');
    expect(c.faqAreasAnswer).toMatch(/^Austin\./);
  });

  it('cycles nearby areas across the three reviews', () => {
    expect(derivePlumbingContent({ ...turk, nearbyAreas: ['A', 'B'] }).reviewTowns).toEqual([
      'A',
      'B',
      'A'
    ]);
    expect(derivePlumbingContent({ ...turk, nearbyAreas: ['A'] }).reviewTowns).toEqual([
      'A',
      'A',
      'A'
    ]);
  });

  it('always yields exactly three review towns', () => {
    const many = derivePlumbingContent({ ...turk, nearbyAreas: ['A', 'B', 'C', 'D', 'E'] });
    expect(many.reviewTowns).toEqual(['A', 'B', 'C']);
  });

  it('trims and de-duplicates nearby areas', () => {
    const c = derivePlumbingContent({ ...turk, nearbyAreas: [' A ', 'a', '', 'B'] });
    expect(c.towns).toEqual(['A', 'B']);
  });

  it('builds the area copy from the nearby areas', () => {
    const c = derivePlumbingContent(turk);
    expect(c.towns).toEqual(['Round Rock', 'Pflugerville', 'Cedar Park']);
    expect(c.servingLine).toBe('Serving Austin, Round Rock, Pflugerville & Cedar Park');
    expect(c.serviceAreaHeading).toBe('Plumbers across Greater Austin');
    expect(c.faqAreasAnswer).toBe(
      'Austin, Round Rock, Pflugerville and Cedar Park. Not sure? Get in touch.'
    );
  });

  it('omits the region when absent', () => {
    expect(derivePlumbingContent({ ...turk, region: null }).heroHeadline).toBe(
      'Fast, Honest Plumbing in Austin'
    );
    expect(derivePlumbingContent({ ...turk, region: '  ' }).heroHeadline).toBe(
      'Fast, Honest Plumbing in Austin'
    );
  });

  it('makes no licence or insurance specifics', () => {
    const c = derivePlumbingContent(turk);
    expect(c.licenceLine).toBe('Licensed & Insured');
    expect(c.footerLicenceLine).toBe('Licensed & Insured');
    expect(c.bookingLicenceLine).toBe('Licensed & insured');
    expect(c.licenceShort).toBeNull();
    expect(c.licenceFaqClause).not.toMatch(/[#\d]/);
    expect(c.insuranceClaim).not.toMatch(/[$\d]/);
    expect(c.insuranceClaim).not.toMatch(/worksafe|bc\b/i);
  });

  it('ends the insurance claim with a period', () => {
    expect(derivePlumbingContent(turk).insuranceClaim.endsWith('.')).toBe(true);
  });

  it('invents no verifiable facts', () => {
    const c = derivePlumbingContent(turk);
    expect(c.socialProof).toBeNull();
    expect(c.photoCaptions).toBeNull();
    expect(c.email).toBeNull();
    expect(c.address).toBeNull();
    const prose = [c.foundedLine, c.whyLead, c.heroLead, c.metaDescription].join(' ');
    expect(prose).not.toMatch(/family|since|\d{4}|years/i);
  });

  it('uses no year in the copyright line', () => {
    expect(derivePlumbingContent(turk).copyrightLine).toBe('© Turk Plumbing');
  });

  it('keeps currency and financing neutral', () => {
    const c = derivePlumbingContent(turk);
    expect(c.currencyNote).not.toMatch(/CAD|USD/);
    expect(c.financingProvider).not.toMatch(/financeit/i);
  });

  it('links only the emergency card to the phone', () => {
    const c = derivePlumbingContent(turk);
    expect(c.serviceHrefs).toEqual({ '24/7 Emergency': 'tel:5125550147' });
    expect(c.serviceHrefs['Drain Cleaning']).toBeUndefined();
  });

  describe('without a phone', () => {
    it('falls back to #book and emits no tel: link', () => {
      for (const phone of [null, '', '   ', 'call us']) {
        const c = derivePlumbingContent({ ...turk, phone });
        expect(c.phoneHref).toBe('#book');
        expect(c.serviceHrefs).toEqual({ '24/7 Emergency': '#book' });
        expect(JSON.stringify(c)).not.toContain('tel:');
      }
    });
  });

  describe('postal format', () => {
    const pattern = (region: string | null) =>
      new RegExp(derivePlumbingContent({ ...turk, region }).postal.pattern);

    it('uses an anchored ZIP pattern for US regions', () => {
      const c = derivePlumbingContent(turk);
      expect(c.postal.label).toBe('ZIP code');
      expect(c.postal.pattern.startsWith('^')).toBe(true);
      expect(c.postal.pattern.endsWith('$')).toBe(true);
      expect(pattern('TX').test('78701')).toBe(true);
      expect(pattern('TX').test('78701-1234')).toBe(true);
      expect(pattern('TX').test('abc12345xyz')).toBe(false);
      expect(pattern('TX').test('V5T 3B9')).toBe(false);
    });

    it('uses an anchored postal-code pattern for Canadian regions', () => {
      for (const region of ['BC', 'on', 'Alberta', 'British Columbia']) {
        const c = derivePlumbingContent({ ...turk, region });
        expect(c.postal.label).toBe('Postal code');
        expect(pattern(region).test('K1A 0B1')).toBe(true);
        expect(pattern(region).test('K1A0B1')).toBe(true);
        expect(pattern(region).test('xxK1A 0B1xx')).toBe(false);
        expect(pattern(region).test('78701')).toBe(false);
      }
    });

    it('defaults to the US form for an unknown or missing region', () => {
      for (const region of [null, '', 'Narnia']) {
        expect(derivePlumbingContent({ ...turk, region }).postal.label).toBe('ZIP code');
      }
    });
  });

  it('is pure', () => {
    expect(derivePlumbingContent(turk)).toEqual(derivePlumbingContent({ ...turk }));
  });
});

describe('toTelHref', () => {
  it('reduces to digits', () => expect(toTelHref('(512) 555-0147')).toBe('tel:5125550147'));
  it('keeps a leading plus', () =>
    expect(toTelHref('+1 512 555 0147')).toBe('tel:+15125550147'));
  it('strips anything that could break the attribute', () =>
    expect(toTelHref('5125550147" onclick="x')).toBe('tel:5125550147'));
  it('drops a trailing extension', () =>
    expect(toTelHref('(512) 555-0147 ext. 12')).toBe('tel:5125550147'));
  it('returns an empty href for null', () => expect(toTelHref(null)).toBe(''));
  it('returns an empty href when there are no digits', () =>
    expect(toTelHref('call us')).toBe(''));
});
