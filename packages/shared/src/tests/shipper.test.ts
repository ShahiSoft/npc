import assert from 'assert';
import { ShipperClient, normalizeAwb } from '../clients/shipper';

export async function runShipperTests() {
  // AWB normalization
  assert.strictEqual(normalizeAwb(' awb 123 '), 'AWB123');

  // Fake transport to test ShipperClient.createShipment
  const fakeTransport = {
    post: async (path: string, body: any) => ({ awb: 'awb 987', courier: 'SiCepat', status: 'CREATED', raw: { ok: true } }),
  };
  const client = new ShipperClient({ transport: fakeTransport as any });
  const res = await client.createShipment({ id: 'order-1', address: { street: 'Jalan' }, items: [] });
  assert.strictEqual(res.courier, 'SiCepat');
  assert.strictEqual(res.status, 'CREATED');
  assert.strictEqual(res.awb, 'AWB987');

  console.log('shipper client tests passed');
}

if (require.main === module) runShipperTests();
