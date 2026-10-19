import type { PlumbingContent } from '../plumbing/types';

// The prospect-site content contract is trade-neutral (company, phone, towns, licence lines,
// social proof), so the electrical template reuses it rather than forking a near-identical
// interface. Trade-specific copy lives in ElectricalSite.svelte; this object only carries
// what varies per prospect.
export type ElectricalContent = PlumbingContent;
