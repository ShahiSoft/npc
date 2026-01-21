// Simple Indonesian holiday calendar helpers (sample set)
const HOLIDAYS = new Set([
  '2026-01-01', // New Year
  '2026-05-01', // Labour Day (example)
  '2026-12-25', // Christmas
]);

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function isHoliday(date: Date): boolean {
  return HOLIDAYS.has(toISODate(date));
}

export function nextBusinessDay(date: Date): Date {
  const out = new Date(date);
  out.setDate(out.getDate() + 1);
  // advance until not weekend and not holiday
  while (out.getDay() === 0 || out.getDay() === 6 || isHoliday(out)) {
    out.setDate(out.getDate() + 1);
  }
  return out;
}

export default { isHoliday, nextBusinessDay };
