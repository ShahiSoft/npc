export type Holiday = {
  date: string; // ISO yyyy-mm-dd
  name: string;
  region?: string;
};

function toISODate(d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d;
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const extraHolidays = new Map<string, Holiday>();

export function addExtraHoliday(dateISO: string, name: string, region?: string) {
  const key = toISODate(dateISO);
  extraHolidays.set(key, { date: key, name, region });
}

function fixedHolidaysForYear(year: number): Holiday[] {
  const by = (m: number, d: number, name: string): Holiday => ({ date: `${year}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`, name });
  return [
    by(1, 1, "New Year's Day"),
    by(5, 1, 'Labour Day'),
    by(8, 17, 'Independence Day'),
    by(12, 25, 'Christmas Day'),
  ];
}

export function listHolidays(year: number, region?: string): Holiday[] {
  const fixed = fixedHolidaysForYear(year);
  // compute moveable holidays (Eid, Nyepi) and include
  const moveable: Holiday[] = [];
  try {
    const eid = computeEidAlFitrForGregorianYear(year);
    if (eid) moveable.push({ date: eid, name: 'Eid al-Fitr' });
  } catch (_err) {
    // ignore and allow manual override
  }
  const nyepi = computeNyepiForYear(year);
  if (nyepi) moveable.push({ date: nyepi, name: 'Nyepi' });

  const extras: Holiday[] = [];
  for (const [k, v] of extraHolidays.entries()) {
    if (k.startsWith(String(year))) {
      if (!region || v.region === region) extras.push(v);
    }
  }

  return [...fixed, ...moveable, ...extras];
}

// ---------- Moveable holiday helpers ----------
// Convert Hijri (tabular arithmetic) to Julian day number
function hijriToJulianDay(hYear: number, hMonth: number, hDay: number): number {
  const year = hYear;
  const month = hMonth;
  const day = hDay;
  const n = day + Math.ceil(29.5 * (month - 1)) + (year - 1) * 354 + Math.floor((3 + 11 * year) / 30);
  // epoch offset approximate to align with Gregorian
  return n + 1948439 - 1;
}

// Fliegel & Van Flandern algorithm to convert Julian day to Gregorian date
function julianDayToGregorian(jd: number): Date {
  let j = Math.floor(jd) + 32044;
  const g = Math.floor(j / 146097);
  let dg = j % 146097;
  const c = Math.floor((Math.floor(dg / 36524 + 1) * 3) / 4);
  dg = dg - c * 36524;
  const b = Math.floor(dg / 1461);
  const db = dg % 1461;
  const a = Math.floor((Math.floor(db / 365 + 1) * 3) / 4);
  const da = db - a * 365;
  const y = g * 400 + c * 100 + b * 4 + a;
  const m = Math.floor((da * 5 + 308) / 153) - 2;
  const d = da - Math.floor((m + 4) * 153 / 5) + 122;
  const Y = y - 4800 + Math.floor((m + 2) / 12);
  const M = (m + 2) % 12 + 1;
  const D = d + 1;
  return new Date(Date.UTC(Y, M - 1, D));
}

function hijriToGregorian(hYear: number, hMonth: number, hDay: number): string {
  const jd = hijriToJulianDay(hYear, hMonth, hDay);
  const dt = julianDayToGregorian(jd);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function computeEidAlFitrForGregorianYear(gYear: number): string | undefined {
  // approximate hijri year corresponding to gregorian year
  const approxHijri = Math.floor((gYear - 622) * 33 / 32);
  const candidates = [approxHijri - 1, approxHijri, approxHijri + 1, approxHijri + 2];
  for (const hy of candidates) {
    try {
      // Eid al-Fitr = 1 Shawwal (Hijri month 10, day 1)
      const iso = hijriToGregorian(hy, 10, 1);
      if (iso.startsWith(String(gYear))) return iso;
    } catch (_e) {
      continue;
    }
  }
  return undefined;
}

// Small curated Nyepi (Saka new year) table for near-term years; can be expanded or overridden via addExtraHoliday
const NYEPI_TABLE: Record<number, string> = {
  2024: '2024-03-11',
  2025: '2025-03-31',
  2026: '2026-03-21',
  2027: '2027-03-12',
};

export function computeNyepiForYear(year: number): string | undefined {
  return NYEPI_TABLE[year];
}

export function isHoliday(date: Date | string, region?: string): boolean {
  const iso = toISODate(date);
  const year = Number(iso.slice(0,4));
  const all = listHolidays(year, region);
  return all.some(h => h.date === iso);
}

export function isBusinessDay(date: Date | string, region?: string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getUTCDay(); // 0 Sun .. 6 Sat
  if (day === 0 || day === 6) return false;
  return !isHoliday(d, region);
}

export function nextBusinessDay(date: Date | string, region?: string): string {
  let d = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
  // move at least one day forward
  d.setUTCDate(d.getUTCDate() + 1);
  while (!isBusinessDay(d, region)) {
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return toISODate(d);
}

export function addBusinessDays(date: Date | string, days: number, region?: string): string {
  if (days < 0) throw new Error('negative days not supported');
  let d = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
  let added = 0;
  while (added < days) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (isBusinessDay(d, region)) added++;
  }
  return toISODate(d);
}

export default {
  addExtraHoliday,
  listHolidays,
  isHoliday,
  isBusinessDay,
  nextBusinessDay,
  addBusinessDays,
};

