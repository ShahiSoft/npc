import assert from 'assert';
import { isHoliday, nextBusinessDay } from '../holidays';

export function runHolidaysTests() {
  const d = new Date('2026-01-01');
  assert.strictEqual(isHoliday(d), true);
  const next = nextBusinessDay(new Date('2026-12-25'));
  // 2026-12-25 is holiday, next business day should be after that (not weekend)
  assert.ok(next > new Date('2026-12-25'));
  console.log('holidays tests passed');
}

if (require.main === module) runHolidaysTests();
