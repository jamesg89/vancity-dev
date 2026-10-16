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
			};
		}
	}
}

export {};
