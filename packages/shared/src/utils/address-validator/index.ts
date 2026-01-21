export interface ValidationResult {
  valid: boolean;
  errors: string[];
  normalized?: any;
}

function normalizeString(s: string) {
  return s.trim().replace(/\s+/g, ' ');
}

export function validateAddress(addr: any): ValidationResult {
  const errors: string[] = [];
  if (!addr) return { valid: false, errors: ['address required'] };
  const required = ['province', 'city', 'district', 'village', 'street', 'rt', 'rw', 'postal_code'];
  required.forEach((k) => {
    if (!addr[k] || String(addr[k]).trim() === '') errors.push(`${k} is required`);
  });

  // RT/RW pattern: should be 2 digits usually; accept 1-3 digits
  const rt = String(addr.rt || '');
  const rw = String(addr.rw || '');
  if (!/^[0-9]{1,3}$/.test(rt)) errors.push('rt must be 1-3 digits');
  if (!/^[0-9]{1,3}$/.test(rw)) errors.push('rw must be 1-3 digits');

  const normalized = {
    province: normalizeString(addr.province || ''),
    city: normalizeString(addr.city || ''),
    district: normalizeString(addr.district || ''),
    village: normalizeString(addr.village || ''),
    street: normalizeString(addr.street || ''),
    rt: rt.padStart(2, '0'),
    rw: rw.padStart(2, '0'),
    postal_code: String(addr.postal_code || '').trim(),
  };

  return { valid: errors.length === 0, errors, normalized };
}

export default { validateAddress };
