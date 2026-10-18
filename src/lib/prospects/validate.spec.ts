import { describe, expect, it } from 'vitest';
import { areaWarnings, parseProspectForm } from './validate';

const good = {
  companyName: 'Turk Plumbing',
  industry: 'plumbing',
  city: 'Austin',
  region: 'TX',
  phone: '(512) 555-0142',
  nearbyAreas: 'Round Rock, Pflugerville'
};

describe('parseProspectForm', () => {
  it('accepts a complete form and returns a NewProspect and the slug base', () => {
    const r = parseProspectForm(good);
    expect(r.errors).toEqual({});
    expect(r.slugBase).toBe('turk-plumbing');
    expect(r.prospect).toEqual({
      companyName: 'Turk Plumbing',
      industry: 'plumbing',
      city: 'Austin',
      region: 'TX',
      phone: '(512) 555-0142',
      nearbyAreas: ['Round Rock', 'Pflugerville']
    });
  });

  it('keeps the raw submitted values so a failed form can be re-shown', () => {
    const r = parseProspectForm({ ...good, companyName: '', city: '  Austin  ' });
    expect(r.prospect).toBeUndefined();
    expect(r.values.city).toBe('  Austin  ');
    expect(r.values.phone).toBe('(512) 555-0142');
  });

  it('requires company name, city and phone', () => {
    const r = parseProspectForm({ ...good, companyName: ' ', city: '', phone: '' });
    expect(r.errors.companyName).toBe('Enter a company name.');
    expect(r.errors.city).toBe('Enter a city.');
    expect(r.errors.phone).toMatch(/phone number/);
  });

  it('rejects a company name that slugifies to nothing', () => {
    const r = parseProspectForm({ ...good, companyName: '!!!' });
    expect(r.errors.companyName).toMatch(/Use at least one letter or number\./);
    expect(r.prospect).toBeUndefined();
  });

  it('treats region and nearby areas as optional', () => {
    const r = parseProspectForm({ ...good, region: ' ', nearbyAreas: '' });
    expect(r.errors).toEqual({});
    expect(r.prospect?.region).toBeNull();
    expect(r.prospect?.nearbyAreas).toEqual([]);
  });

  it('rejects an unknown industry', () => {
    expect(parseProspectForm({ ...good, industry: 'basket-weaving' }).errors.industry).toBeDefined();
    expect(parseProspectForm({ ...good, industry: 'constructor' }).errors.industry).toBeDefined();
  });

  describe('phone', () => {
    it.each(['call us', '555', '12345', '--- ---', '512-555-0142 or ask for Bob', '1'.repeat(16)])(
      'rejects %j',
      (phone) => {
        expect(parseProspectForm({ ...good, phone }).errors.phone).toBeDefined();
      }
    );

    it.each(['512-555-0142', '(512) 555-0142', '+1 512 555 0142', '512.555.0142', '555-0142', '512-555-0142 x12'])(
      'accepts %j',
      (phone) => {
        expect(parseProspectForm({ ...good, phone }).errors.phone).toBeUndefined();
      }
    );
  });

  describe('nearby areas', () => {
    it('splits on commas and newlines, trims, drops blanks and duplicates', () => {
      const r = parseProspectForm({ ...good, nearbyAreas: 'Round Rock,\n  cedar park , ,Round Rock\r\nPflugerville' });
      expect(r.prospect?.nearbyAreas).toEqual(['Round Rock', 'cedar park', 'Pflugerville']);
    });

    it('never produces an area containing a comma, so storage round-trips', () => {
      const r = parseProspectForm({ ...good, nearbyAreas: 'Austin, TX' });
      // Pinned exactly: a bare .every() here once passed while "TX" became a town on the page.
      expect(r.prospect?.nearbyAreas).toEqual(['Austin', 'TX']);
      expect(r.prospect?.nearbyAreas.every((a) => !a.includes(','))).toBe(true);
    });

    it('rejects an absurdly long area', () => {
      expect(parseProspectForm({ ...good, nearbyAreas: 'x'.repeat(200) }).errors.nearbyAreas).toBeDefined();
    });
  });

  it('caps field lengths', () => {
    expect(parseProspectForm({ ...good, companyName: 'a'.repeat(200) }).errors.companyName).toBeDefined();
    expect(parseProspectForm({ ...good, city: 'a'.repeat(200) }).errors.city).toBeDefined();
  });
});

describe('areaWarnings', () => {
  it('is quiet for ordinary towns', () => {
    expect(areaWarnings('Austin', 'Round Rock, Cedar Park')).toEqual([]);
    expect(areaWarnings('', '')).toEqual([]);
  });

  it('warns when an area is the city, ignoring case and spacing', () => {
    const w = areaWarnings(' Austin ', 'round rock,  AUSTIN');
    expect(w).toHaveLength(1);
    expect(w[0]).toContain('AUSTIN');
    expect(w[0]).toContain('city');
  });

  it('warns on a bare two-letter region code', () => {
    const w = areaWarnings('Austin', 'Round Rock, TX');
    expect(w).toHaveLength(1);
    expect(w[0]).toContain('"TX"');
  });

  it('warns twice for the natural "Austin, TX" input', () => {
    expect(areaWarnings('Austin', 'Austin, TX')).toHaveLength(2);
  });

  it('does not block the submit: the same input still parses', () => {
    const r = parseProspectForm({ ...good, nearbyAreas: 'Austin, TX' });
    expect(r.errors).toEqual({});
    expect(r.prospect).toBeDefined();
  });
});
