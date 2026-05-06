import type { DemoConfig } from './types';

export const waterstcafe: DemoConfig = {
  slug: 'waterstcafe',
  clientName: 'Water St. Café',
  tagline: 'Artisan coffee · Gastown, Vancouver',
  variants: [
    {
      key: 'a',
      label: 'Option A — Warm Espresso',
      palette: {
        '--bg': '#f5f0e8',
        '--paper': '#ede8e0',
        '--ink': '#1f1512',
        '--ink-soft': '#5a4035',
        '--accent': '#6b4c35',
        '--accent2': '#4a7562',
        '--warm': '#c8936a',
        '--line': 'rgba(31,21,18,0.14)',
      },
    },
    {
      key: 'b',
      label: 'Option B — Pacific Blue',
      palette: {
        '--bg': '#e8edf2',
        '--paper': '#dde3e9',
        '--ink': '#0d1e28',
        '--ink-soft': '#3a5060',
        '--accent': '#1d4d6e',
        '--accent2': '#4a8070',
        '--warm': '#d4604a',
        '--line': 'rgba(13,30,40,0.14)',
      },
    },
    {
      key: 'c',
      label: 'Option C — Stone & Rust',
      palette: {
        '--bg': '#f0ede8',
        '--paper': '#e8e4de',
        '--ink': '#1c1c1a',
        '--ink-soft': '#5a5855',
        '--accent': '#3d3d38',
        '--accent2': '#6b6b66',
        '--warm': '#a35d3a',
        '--line': 'rgba(28,28,26,0.14)',
      },
    },
  ],
};
