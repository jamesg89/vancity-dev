import { error, type Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { demos } from '$lib/demos/index';
import { adminAccessAllowed, isAdminRequest } from '$lib/admin-guard';

export const handle: Handle = async ({ event, resolve }) => {
	// Before resolve, so page loads, form actions and +server.ts endpoints are all covered.
	if (isAdminRequest(event.url.pathname, event.route.id) && !adminAccessAllowed(event.url, event.request.headers, dev)) {
		error(403, 'Forbidden');
	}

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
