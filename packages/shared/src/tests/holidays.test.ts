import assert from 'assert';
import { listHolidays, isHoliday, addExtraHoliday, nextBusinessDay } from '../holidays';

export function runHolidaysTests() {
  // fixed holiday exists
  const y = 2026;
  const fixed = listHolidays(y);
  const hasNewYear = fixed.some(h => h.date === `${y}-01-01`);
  assert.strictEqual(hasNewYear, true, 'expected New Year holiday present');

  // add extra holiday and ensure detection
  addExtraHoliday('2026-01-02', 'Test Holiday');
  assert.strictEqual(isHoliday('2026-01-02'), true, 'extra holiday should be detected');

  // next business day after the extra holiday should be after the holiday and be a business day
  const next = nextBusinessDay('2026-01-02');
  // next must be later than the holiday and must be a business day
  assert.ok(next > '2026-01-02');
  // ensure it's not a holiday/weekend
  // import local helper
  const { isBusinessDay } = require('../holidays');
  assert.strictEqual(isBusinessDay(next), true);

  console.log('holidays tests passed');
}

if (require.main === module) runHolidaysTests();
