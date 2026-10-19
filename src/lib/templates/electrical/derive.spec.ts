import { describe, it, expect } from 'vitest';
import { deriveElectricalContent } from './derive';
import type { ReadyProspect } from '$lib/prospects/types';

const prospect: ReadyProspect = {
  slug: 'volt-electric',
  companyName: 'Volt Electric',
  industry: 'electrical',
  city: 'Austin',
  region: 'TX',
  phone: '(512) 555-0147',
  nearbyAreas: ['Round Rock', 'Austin', 'Cedar Park'],
  createdAt: 0,
  archived: false
};

describe('deriveElectricalContent', () => {
  it('substitutes company, city and phone', () => {
    const c = deriveElectricalContent(prospect);
    expect(c.brandLead).toBe('Volt');
    expect(c.brandTail).toBe('Electric');
    expect(c.heroHeadline).toBe('Licensed Electricians in Austin, TX');
    expect(c.title).toBe(
      'Electrician in Austin, TX | 24/7 Emergency & Panel Upgrades | Volt Electric'
    );
    expect(c.phoneHref).toBe('tel:5125550147');
  });

  it('drops the city from the towns and invents no licence or social proof', () => {
    const c = deriveElectricalContent(prospect);
    expect(c.towns).toEqual(['Round Rock', 'Cedar Park']);
    expect(c.licenceShort).toBeNull();
    expect(c.socialProof).toBeNull();
    expect(c.photoCaptions).toBeNull();
    expect(c.email).toBeNull();
  });

  it('links only the emergency card to the phone, and falls back to the form without digits', () => {
    expect(deriveElectricalContent(prospect).serviceHrefs).toEqual({
      'Emergency Repair': 'tel:5125550147'
    });
    const c = deriveElectricalContent({ ...prospect, phone: 'call us' });
    expect(c.phoneHref).toBe('#book');
  });

  it('always yields three review towns', () => {
    expect(deriveElectricalContent({ ...prospect, nearbyAreas: [] }).reviewTowns).toEqual([
      'Austin',
      'Austin',
      'Austin'
    ]);
  });
});
