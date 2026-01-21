import assert from 'assert';
import { chargeSandbox } from '../clients/xendit';
import { createShipmentMock } from '../clients/shipper';

export async function runClientsTests() {
  const p = await chargeSandbox(5000);
  assert.strictEqual(p.status, 'PAID');
  const s = await createShipmentMock({ id: 'order1' });
  assert.ok(s.awb && s.status === 'CREATED');
  console.log('clients tests passed');
}

if (require.main === module) runClientsTests();
