import assert from 'assert';
import { validateAddress } from '../utils/address-validator';

export function runAddressTests() {
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
  const bad = validateAddress({});
  assert.strictEqual(bad.valid, false);
  console.log('address tests passed');
}

if (require.main === module) runAddressTests();
