import type { IndustryKey } from '$lib/prospects/types';

export const industries: Record<IndustryKey, { label: string }> = {
  plumbing: { label: 'Plumbing' },
  defense: { label: 'Criminal Defense Law' },
  electrical: { label: 'Electrical' }
};
