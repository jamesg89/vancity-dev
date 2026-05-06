import type { DemoConfig } from './types';

export const alexjo: DemoConfig = {
	slug: 'alexjo',
	clientName: 'Alex Jo, CPA',
	tagline: 'Chartered Professional Accountant · Vancouver, BC',
	variants: [
		{
			key: 'a',
			label: 'Option A — Editorial',
			palette: {
				'--bg': '#F5F1EA',
				'--paper': '#FBF8F2',
				'--ink': '#0E1B2C',
				'--ink-soft': '#3A4A60',
				'--accent': '#B08A3E',
				'--accent2': '#C9A769',
				'--warm': '#D4B896',
				'--line': 'rgba(14,27,44,0.14)',
			},
		},
		{
			key: 'b',
			label: 'Option B — Architectural',
			palette: {
				'--bg': '#F0EDE6',
				'--paper': '#F8F5EF',
				'--ink': '#0E1B2C',
				'--ink-soft': '#3A4A60',
				'--accent': '#9C7935',
				'--accent2': '#B89450',
				'--warm': '#C8A87A',
				'--line': 'rgba(14,27,44,0.14)',
			},
		},
		{
			key: 'c',
			label: 'Option C — Portrait',
			palette: {
				'--bg': '#FAF7F2',
				'--paper': '#FEFBf6',
				'--ink': '#1A2A40',
				'--ink-soft': '#404E64',
				'--accent': '#C4963A',
				'--accent2': '#D4AC60',
				'--warm': '#DEC49A',
				'--line': 'rgba(26,42,64,0.14)',
			},
		},
	],
};
