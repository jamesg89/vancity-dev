import type { Reroute } from '@sveltejs/kit';

export const reroute: Reroute = ({ url }) => {
	const match = url.hostname.match(/^(.+)\.vancity\.dev$/);
	if (match && match[1] !== 'www') {
		return `/demo/${match[1]}${url.pathname === '/' ? '' : url.pathname}`;
	}
};
