import assert from 'assert';
import { XenditClient, XenditInvoiceResponse, XenditInvoiceRequest } from '../clients/xendit';

export async function runXenditTests() {
  // transport that records calls and returns preset responses
  const calls: any[] = [];
  const fakeTransport = {
    post: async (path: string, body: any) => {
      calls.push({ method: 'post', path, body });
      return { id: 'inv_1', ...body, status: 'PENDING', invoice_url: 'https://xend.it/inv_1' } as XenditInvoiceResponse;
    },
    get: async (path: string) => {
      calls.push({ method: 'get', path });
      if (path.startsWith('/v2/invoices?')) return [{ id: 'inv_1', external_id: 'ext-1', amount: 1000, status: 'PAID' }];
      return { id: 'inv_1', external_id: 'ext-1', amount: 1000, status: 'PAID' };
    }
  };

  const client = new XenditClient({ transport: fakeTransport });

  const req: XenditInvoiceRequest = { external_id: 'ext-1', amount: 1000, payer_email: 'a@b.test' };
  const created = await client.createInvoice(req);
  assert.strictEqual(created.external_id, 'ext-1');
  assert.strictEqual(created.status, 'PENDING');

  const got = await client.getInvoice('inv_1');
  assert.strictEqual(got.id, 'inv_1');

  // test fallback search by external_id
  const got2 = await client.getInvoice('ext-1');
  assert.strictEqual(got2.external_id, 'ext-1');

  console.log('xendit client tests passed');
}

if (require.main === module) runXenditTests();
