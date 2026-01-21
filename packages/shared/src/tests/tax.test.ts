import assert from 'assert';
import { calculatePPN, applyPPN } from '../tax';

export function runTaxTests() {
  // basic cases
  assert.strictEqual(calculatePPN(100), 11);
  assert.strictEqual(calculatePPN(0), 0);
  const res = applyPPN(200);
  assert.strictEqual(res.tax, 22);
  assert.strictEqual(res.total, 222);
  console.log('tax tests passed');
}

if (require.main === module) runTaxTests();
