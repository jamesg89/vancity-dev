import type { Reroute } from '@sveltejs/kit';
import { demos } from '$lib/demos/index';

export const reroute: Reroute = ({ url }) => {
	const match = url.hostname.match(/^(.+)\.(?:vancity\.dev|localhost)$/);
	if (!match || match[1] === 'www') return;

	const slug = match[1];
	if (Object.hasOwn(demos, slug)) {
		return `/demo/${slug}${url.pathname === '/' ? '' : url.pathname}`;
	}
	// Prospect sites are single-page: every path on the subdomain is the one site. The D1
	// lookup cannot happen here (reroute also runs in the browser, with no platform.env);
	// the /site load does it, keyed on locals.siteSlug.
	return '/site';
};
