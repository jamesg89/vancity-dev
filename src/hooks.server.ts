import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const match = event.url.hostname.match(/^(.+)\.vancity\.dev$/);
	if (match && match[1] !== 'www') {
		event.locals.demo = match[1];
	}
	return resolve(event);
};
