import assert from 'assert';
import { XenditClient } from '../clients/xendit';
import { createShipmentMock } from '../clients/shipper';

export async function runClientsTests() {
  // Use fake transport to avoid network calls
  const fakeTransport = {
    post: async (path: string, body: any) => ({ id: 'inv_test', ...body, status: 'PAID' }),
    get: async (path: string) => ({ id: 'inv_test', external_id: 'ext-test', amount: 5000, status: 'PAID' }),
  };
  const client = new XenditClient({ transport: fakeTransport as any });
  const invoice = await client.createInvoice({ external_id: 'ext-test', amount: 5000 });
  assert.strictEqual(invoice.status, 'PAID');

  const s = await createShipmentMock({ id: 'order1' });
  assert.ok(s.awb && s.status === 'CREATED');
  console.log('clients tests passed');
}

if (require.main === module) runClientsTests();
