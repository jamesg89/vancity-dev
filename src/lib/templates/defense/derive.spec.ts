import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import DefenseSite from './DefenseSite.svelte';
import { deriveDefenseContent } from './derive';
import { harbourDefaults } from './defaults';
import type { ReadyProspect } from '$lib/prospects/types';

const prospect: ReadyProspect = {
  slug: 'pike-law',
  companyName: 'Pike Defense Law',
  industry: 'defense',
  city: 'Austin',
  region: 'TX',
  phone: '(512) 555-0142',
  nearbyAreas: ['Austin', 'Round Rock', 'Cedar Park'],
  createdAt: 1,
  archived: false
};

describe('deriveDefenseContent', () => {
  it('builds city-aware copy and a dialable phone', () => {
    const c = deriveDefenseContent(prospect);
    expect(c.title).toBe('Criminal Defense Lawyer in Austin, TX | Free Consultation 24/7 | Pike Defense Law');
    expect(c.phoneHref).toBe('tel:5125550142');
    expect(c.textHref).toBe('sms:5125550142');
    expect(c.areas).toEqual(['Round Rock', 'Cedar Park']);
    expect(c.monogram).toBe('P');
  });

  it('never invents credentials, results or reviews', () => {
    const c = deriveDefenseContent(prospect);
    expect(c.credentials).toBeNull();
    expect(c.proof).toBeNull();
    expect(c.results).toEqual([]);
    expect(c.reviews).toEqual([]);
  });
});

describe('DefenseSite', () => {
  it('hides unverified sections and keeps the ethics lines for a derived prospect', () => {
    const { body: raw } = render(DefenseSite, { props: { content: deriveDefenseContent(prospect) } });
    const body = raw.replace(/\s+/g, ' ');
    expect(body).toContain('Attorney Advertising.');
    expect(body).toContain('does not create an attorney-client relationship');
    expect(body).not.toContain('id="results"');
    expect(body).not.toContain('id="reviews"');
    expect(body).not.toContain('Harbour');
  });

  it('shows results with the disclaimer when the content has them', () => {
    const { body: raw } = render(DefenseSite, { props: { content: harbourDefaults } });
    const body = raw.replace(/\s+/g, ' ');
    expect(body).toContain('id="results"');
    expect(body).toContain('Prior results do not guarantee a similar outcome');
  });
});
