import type { LayoutServerLoad } from './$types';
import { demos } from '$lib/demos/index';

export const load: LayoutServerLoad = ({ url, locals }) => {
  const slug = locals.demo ?? url.pathname.split('/').filter(Boolean)[1];
  const demo = slug ? demos[slug] : null;

  if (!demo) {
    return { demo: null, variant: null, cssVars: '' };
  }

  const variantKey = url.searchParams.get('v') ?? 'a';
  const variant = demo.variants.find((v) => v.key === variantKey) ?? demo.variants[0];
  const cssVars = Object.entries(variant.palette)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');

  return { demo, variant, cssVars };
};
