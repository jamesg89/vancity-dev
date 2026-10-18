declare global {
	namespace App {
		interface Locals {
			demo?: string;
			siteSlug?: string;
		}
		interface Platform {
			env: {
				SEND_EMAIL: {
					send(message: import('cloudflare:email').EmailMessage): Promise<void>;
				};
				ASSETS: unknown;
				DB: import('@cloudflare/workers-types').D1Database;
				// Set with `wrangler secret put CF_ACCESS_AUD` after creating the Access application.
				// Absent means Access is not configured, and the admin guard fails closed.
				CF_ACCESS_AUD?: string;
			};
		}
	}
}

export {};
