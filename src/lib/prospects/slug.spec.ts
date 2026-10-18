import { describe, it, expect } from 'vitest';
import { slugify, isReserved, nextAvailableSlug } from './slug';

describe('slugify', () => {
  it('lowercases and hyphenates', () => expect(slugify('Turk Plumbing')).toBe('turk-plumbing'));
  it('strips punctuation', () =>
    expect(slugify('Turk & Sons Plumbing, LLC.')).toBe('turk-sons-plumbing-llc'));
  it('collapses repeated separators', () => expect(slugify('A  --  B')).toBe('a-b'));
  it('trims leading and trailing hyphens', () => expect(slugify('  -Turk-  ')).toBe('turk'));
  it('strips non-ascii', () => expect(slugify('Café Plomberie')).toBe('cafe-plomberie'));
  it('caps at 63 characters with no trailing hyphen', () => {
    const s = slugify('x'.repeat(40) + ' ' + 'y'.repeat(40));
    expect(s.length).toBeLessThanOrEqual(63);
    expect(s.endsWith('-')).toBe(false);
  });
  it('returns empty string when nothing survives', () => expect(slugify('!!!')).toBe(''));
});

describe('isReserved', () => {
  it('rejects infrastructure names', () => expect(isReserved('www')).toBe(true));
  it('rejects existing demo slugs', () => expect(isReserved('waterstcafe')).toBe(true));
  it('allows a normal slug', () => expect(isReserved('turk-plumbing')).toBe(false));
});

describe('nextAvailableSlug', () => {
  it('returns the base when free', () =>
    expect(nextAvailableSlug('turk-plumbing', () => false)).toBe('turk-plumbing'));
  it('suffixes past collisions', () =>
    expect(
      nextAvailableSlug('turk-plumbing', (s) => s === 'turk-plumbing' || s === 'turk-plumbing-2')
    ).toBe('turk-plumbing-3'));
  it('treats reserved names as taken', () =>
    expect(nextAvailableSlug('demo', () => false)).toBe('demo-2'));
  it('keeps the suffixed slug within 63 characters', () => {
    const base = 'a'.repeat(63);
    expect(nextAvailableSlug(base, (s) => s === base).length).toBeLessThanOrEqual(63);
  });
});
