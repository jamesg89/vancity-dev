export interface DemoPalette {
  '--bg': string;
  '--paper': string;
  '--ink': string;
  '--ink-soft': string;
  '--accent': string;
  '--accent2': string;
  '--warm': string;
  '--line': string;
}

export interface DemoVariant {
  key: string;
  label: string;
  palette: DemoPalette;
}

export interface DemoConfig {
  slug: string;
  clientName: string;
  tagline: string;
  variants: DemoVariant[];
}
