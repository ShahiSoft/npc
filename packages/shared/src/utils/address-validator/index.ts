export interface AddressInput {
  province?: string;
  city?: string;
  district?: string;
  village?: string;
  street?: string;
  rt?: string | number; // neighborhood unit
  rw?: string | number; // community unit
  postal_code?: string | number;
  [key: string]: unknown;
}

export interface NormalizedAddress {
  province: string;
  city: string;
  district: string;
  village: string;
  street: string;
  rt: string; // zero-padded 2 chars
  rw: string; // zero-padded 2 chars
  postal_code: string; // 5-digit string
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  normalized?: NormalizedAddress;
}

import { findRegionByPostalCode } from '../../constants/regions';

function normalizeString(s: unknown) {
  if (s === undefined || s === null) return '';
  return String(s).trim().replace(/\s+/g, ' ');
}

function parseRtRw(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  // common formats: "04", "4", "RT 04", "RT04", "04/RW03", "04-03" (we only parse single unit here)
  // If combined RT/RW provided like "RT 04/RW 03", caller should split; here we accept single numeric
  const m = s.match(/(\d{1,3})/);
  if (!m) return null;
  const num = m[1];
  if (!/^[0-9]{1,3}$/.test(num)) return null;
  return num.padStart(2, '0');
}

function normalizePostalCode(pc: unknown): string | null {
  if (pc === undefined || pc === null) return null;
  const s = String(pc).trim();
  // Indonesian postal codes are 5 digits
  const m = s.match(/^(\d{5})$/);
  if (!m) return null;
  return m[1];
}

export function validateAddress(addr: AddressInput | undefined | null): ValidationResult {
  const errors: string[] = [];
  if (!addr) return { valid: false, errors: ['address required'] };

  const requiredFields: Array<keyof AddressInput> = [
    'province',
    'city',
    'district',
    'village',
    'street',
    'rt',
    'rw',
    'postal_code',
  ];

  requiredFields.forEach((k) => {
    const v = addr[k];
    if (v === undefined || v === null || String(v).trim() === '') {
      errors.push(`${k} is required`);
    }
  });

  const rt = parseRtRw(addr.rt);
  const rw = parseRtRw(addr.rw);
  if (!rt) errors.push('rt must contain 1-3 numeric digits');
  if (!rw) errors.push('rw must contain 1-3 numeric digits');

  const postal = normalizePostalCode(addr.postal_code);
  if (!postal) errors.push('postal_code must be exactly 5 digits');

  const normalized: NormalizedAddress | undefined =
    errors.length === 0
      ? {
          province: normalizeString(addr.province),
          city: normalizeString(addr.city),
          district: normalizeString(addr.district),
          village: normalizeString(addr.village),
          street: normalizeString(addr.street),
          rt: rt as string,
          rw: rw as string,
          postal_code: postal as string,
        }
      : undefined;

  // If we have a postal code -> region mapping, prefer that mapping to normalize province/city
  if (normalized && normalized.postal_code) {
    const mapped = findRegionByPostalCode(normalized.postal_code);
    if (mapped) {
      if (mapped.province !== normalized.province || mapped.city !== normalized.city) {
        normalized.province = mapped.province;
        normalized.city = mapped.city;
      }
    }
  }

  return { valid: errors.length === 0, errors, normalized };
}

export default { validateAddress };
