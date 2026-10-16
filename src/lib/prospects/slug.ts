import { demos } from '$lib/demos';

const MAX_SLUG_LENGTH = 63;

export const RESERVED_SLUGS: ReadonlySet<string> = new Set([
  'www',
  'api',
  'admin',
  'mail',
  'demo',
  'site',
  ...Object.keys(demos),
]);

function truncate(slug: string, max: number): string {
  return slug.slice(0, max).replace(/-+$/, '');
}

export function slugify(input: string): string {
  const slug = input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return truncate(slug, MAX_SLUG_LENGTH);
}

export function isReserved(slug: string): boolean {
  return RESERVED_SLUGS.has(slug);
}

export function nextAvailableSlug(base: string, taken: (slug: string) => boolean): string {
  const unavailable = (slug: string) => isReserved(slug) || taken(slug);
  if (!unavailable(base)) return base;
  for (let n = 2; ; n++) {
    const suffix = `-${n}`;
    const candidate = truncate(base, MAX_SLUG_LENGTH - suffix.length) + suffix;
    if (!unavailable(candidate)) return candidate;
  }
}
