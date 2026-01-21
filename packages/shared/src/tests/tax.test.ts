import assert from 'assert';
import { calculatePPN, applyPPN, calculateCartTax, calculateItemTax } from '../tax';

export function runTaxTests() {
  // basic cases
  assert.strictEqual(calculatePPN(100), 11);
  assert.strictEqual(calculatePPN(0), 0);
  const res = applyPPN(200);
  assert.strictEqual(res.tax, 22);
  assert.strictEqual(res.total, 222);

  // item-level tax
  const item = { price: 100, quantity: 2 };
  assert.strictEqual(calculateItemTax(item as any), 22);

  // cart-level rounding strategies
  const items = [
    { price: 100, quantity: 1 },
    { price: 50, quantity: 2 },
  ];
  const atEnd = calculateCartTax(items as any, 'round-at-end');
  // subtotal = 100 + 100 = 200, tax = 22
  assert.strictEqual(atEnd.subtotal, 200);
  assert.strictEqual(atEnd.tax, 22);

  const perItem = calculateCartTax(items as any, 'round-per-item');
  // per-line: tax on 100 = 11, tax on 100 = 11 => tax = 22
  assert.strictEqual(perItem.tax, 22);

  // tax-exempt item
  const items2 = [
    { price: 100, quantity: 1, tax_exempt: true },
    { price: 100, quantity: 1 },
  ];
  const mix = calculateCartTax(items2 as any, 'round-at-end');
  // subtotal 200, taxable 100 -> tax 11
  assert.strictEqual(mix.tax, 11);

  console.log('tax tests passed');
}

if (require.main === module) runTaxTests();
