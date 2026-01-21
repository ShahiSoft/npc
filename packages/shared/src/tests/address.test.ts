import assert from 'assert';
import { validateAddress } from '../utils/address-validator';

export function runAddressTests() {
  // basic valid
  const ok = validateAddress({
    province: 'DKI Jakarta',
    city: 'Jakarta',
    district: 'Sudirman',
    village: 'Kebon',
    street: 'Jl. Merdeka',
    rt: '4',
    rw: '3',
    postal_code: '10210',
  });
  assert.strictEqual(ok.valid, true);
  assert.strictEqual(ok.normalized?.rt, '04');
  assert.strictEqual(ok.normalized?.rw, '03');

  // RT/RW with labels and extra spaces
  const ok2 = validateAddress({
    province: ' JAWA BARAT ',
    city: 'Bandung',
    district: 'Coblong',
    village: 'Dago',
    street: '  Jalan Asia Afrika  ',
    rt: 'RT 12',
    rw: 'RW 5',
    postal_code: 40115,
  });
  assert.strictEqual(ok2.valid, true);
  assert.strictEqual(ok2.normalized?.rt, '12');
  assert.strictEqual(ok2.normalized?.rw, '05');

  // invalid postal code
  const badPostal = validateAddress({
    province: 'A',
    city: 'B',
    district: 'C',
    village: 'D',
    street: 'E',
    rt: '1',
    rw: '1',
    postal_code: '12',
  });
  assert.strictEqual(badPostal.valid, false);
  assert.ok(badPostal.errors.some((e) => e.includes('postal_code')));

  // invalid rt/rw
  const badRt = validateAddress({
    province: 'A',
    city: 'B',
    district: 'C',
    village: 'D',
    street: 'E',
    rt: 'RTX',
    rw: 'RWY',
    postal_code: '12345',
  });
  assert.strictEqual(badRt.valid, false);
  assert.ok(badRt.errors.some((e) => e.includes('rt')));

  // missing fields
  const bad = validateAddress({});
  assert.strictEqual(bad.valid, false);
  console.log('address tests passed');
}

if (require.main === module) runAddressTests();
