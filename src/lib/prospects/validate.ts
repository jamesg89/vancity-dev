import { industries } from '$lib/templates';
import type { IndustryKey, NewProspect } from './types';
import { slugify } from './slug';

// Every field as the browser submitted it. This is what a failed form is re-filled from, so
// it is never trimmed or normalised.
export interface ProspectFormValues {
  companyName: string;
  industry: string;
  city: string;
  region: string;
  phone: string;
  nearbyAreas: string;
}

export type ProspectFormErrors = Partial<Record<keyof ProspectFormValues | 'form', string>>;

export interface ParsedProspectForm {
  values: ProspectFormValues;
  errors: ProspectFormErrors;
  // Present only when there are no errors.
  prospect?: NewProspect;
  slugBase?: string;
}

const MAX_COMPANY = 100;
const MAX_CITY = 80;
const MAX_REGION = 40;
const MAX_AREA = 60;

const PHONE_MESSAGE = 'Enter a phone number with area code, like (512) 555-0142.';

const squash = (value: string) => value.replace(/\s+/g, ' ').trim();

export function formValues(data: FormData): ProspectFormValues {
  const get = (key: keyof ProspectFormValues) => {
    const value = data.get(key);
    return typeof value === 'string' ? value : '';
  };
  return {
    companyName: get('companyName'),
    industry: get('industry'),
    city: get('city'),
    region: get('region'),
    phone: get('phone'),
    nearbyAreas: get('nearbyAreas')
  };
}

// A real number is 7-15 digits, written only with digits, spaces and ( ) + . -, optionally
// followed by an extension. "call us" and "555" fail; so does a number with prose around it.
function validPhone(phone: string): boolean {
  const main = phone.replace(/\s*(?:ext\.?|x|#)\s*\d+\s*$/i, '');
  if (!/^\+?[\d\s().-]+$/.test(main)) return false;
  const digits = main.replace(/\D/g, '').length;
  return digits >= 7 && digits <= 15;
}

// Areas are stored comma-separated and split on read, so an area can never contain a comma:
// commas and line breaks are the separators here and nothing else survives to storage.
function parseAreas(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const piece of raw.split(/[,\r\n]+/)) {
    const area = squash(piece);
    const key = area.toLowerCase();
    if (!area || seen.has(key)) continue;
    seen.add(key);
    out.push(area);
  }
  return out;
}

// Advisory only: these never block a submit, because the owner may have a reason. They name the
// two ways a comma-split "Austin, TX" goes wrong, since both end up on the prospect's page.
export function areaWarnings(cityValue: string, areasValue: string): string[] {
  const city = squash(cityValue).toLowerCase();
  const warnings: string[] = [];
  for (const area of parseAreas(areasValue)) {
    if (city && area.toLowerCase() === city)
      warnings.push(`"${area}" is the city itself, so it will not be listed as a nearby town.`);
    else if (/^[A-Za-z]{2}$/.test(area))
      warnings.push(
        `"${area}" looks like a state or province code, not a town. Commas separate areas, so "Austin, TX" is two areas.`
      );
  }
  return warnings;
}

export function parseProspectForm(values: ProspectFormValues): ParsedProspectForm {
  const errors: ProspectFormErrors = {};

  const companyName = squash(values.companyName);
  const slugBase = slugify(companyName);
  if (!companyName) errors.companyName = 'Enter a company name.';
  else if (companyName.length > MAX_COMPANY)
    errors.companyName = `Keep the company name under ${MAX_COMPANY} characters.`;
  else if (!slugBase)
    errors.companyName = 'Use at least one letter or number. The link is built from the name.';

  if (!Object.hasOwn(industries, values.industry)) errors.industry = 'Choose an industry.';

  const city = squash(values.city);
  if (!city) errors.city = 'Enter a city.';
  else if (city.length > MAX_CITY) errors.city = `Keep the city under ${MAX_CITY} characters.`;

  const region = squash(values.region);
  if (region.length > MAX_REGION) errors.region = `Keep this under ${MAX_REGION} characters.`;

  const phone = squash(values.phone);
  if (!validPhone(phone)) errors.phone = PHONE_MESSAGE;

  const nearbyAreas = parseAreas(values.nearbyAreas);
  if (nearbyAreas.some((area) => area.length > MAX_AREA))
    errors.nearbyAreas = `Each area must be under ${MAX_AREA} characters. Separate areas with commas.`;

  if (Object.keys(errors).length > 0) return { values, errors };

  return {
    values,
    errors,
    slugBase,
    prospect: {
      companyName,
      industry: values.industry as IndustryKey,
      city,
      region: region || null,
      phone,
      nearbyAreas
    }
  };
}
