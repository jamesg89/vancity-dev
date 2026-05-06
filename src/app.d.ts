declare global {
	namespace App {
		interface Locals {
			demo?: string;
		}
		interface Platform {
			env: {
				SEND_EMAIL: {
					send(message: import('cloudflare:email').EmailMessage): Promise<void>;
				};
				ASSETS: unknown;
			};
		}
	}
}

export {};
