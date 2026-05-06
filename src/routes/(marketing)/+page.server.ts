import { EmailMessage } from 'cloudflare:email';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	bookConsult: async ({ request, platform }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString().trim() ?? '';
		const email = data.get('email')?.toString().trim() ?? '';
		const timing = data.get('timing')?.toString() ?? '';
		const description = data.get('description')?.toString().trim() ?? '';

		if (!name || !email) return fail(400, { error: 'Name and email are required.' });

		const subject = `Consult Request — ${name}`;
		const bodyLines = [
			`Name: ${name}`,
			`Email: ${email}`,
			`Best time: ${timing || 'Not specified'}`,
			description ? `Project: ${description}` : ''
		].filter(Boolean);

		const headers = [
			`From: "Vancity Dev" <no-reply@vancity.dev>`,
			`To: james@vancity.dev`,
			`Subject: ${subject}`,
			`MIME-Version: 1.0`,
			`Content-Type: text/plain; charset=utf-8`
		].join('\r\n');

		const raw = `${headers}\r\n\r\n${bodyLines.join('\n')}`;

		try {
			const message = new EmailMessage('no-reply@vancity.dev', 'james@vancity.dev', raw);
			await platform?.env?.SEND_EMAIL?.send(message);
			return { success: true };
		} catch (e) {
			console.error('Email send failed:', e);
			return fail(500, { error: 'Could not send email. Please try james@vancity.dev directly.' });
		}
	}
};
