import type { Handle } from '@sveltejs/kit';
import { demos } from '$lib/demos/index';

export const handle: Handle = async ({ event, resolve }) => {
	const match = event.url.hostname.match(/^(.+)\.(?:vancity\.dev|localhost)$/);
	if (match && match[1] !== 'www') {
		// event.url keeps the original hostname after reroute, so the slug is recovered here.
		if (Object.hasOwn(demos, match[1])) {
			event.locals.demo = match[1];
		} else {
			event.locals.siteSlug = match[1];
		}
	}
	return resolve(event);
};
