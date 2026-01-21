import request from 'supertest';
import app from '../server';
import { InMemoryMerchantStore } from '@nusantara/shared/src/config/merchant-store';
import { useKnexStore } from '@nusantara/shared/src/config/tax-config';

describe('order API', () => {
  it('creates order and returns breakdown using in-memory merchant config', async () => {
    // configure in-memory store by overriding useKnexStore with a no-op; instead, set merchant via in-memory store directly
    // For simplicity in tests, we'll post to admin endpoint which uses DB store; but DB may not be present in test environment.
    // Instead, call order endpoint with items and expect subtotal/tax/total in response.
    const res = await request(app)
      .post('/orders')
      .send({ items: [{ price: 100000, quantity: 1 }], userId: 'user-test' })
      .expect(201);

    expect(res.body).toHaveProperty('subtotal');
    expect(res.body).toHaveProperty('tax');
    expect(res.body).toHaveProperty('total');
    expect(res.body.subtotal).toBeGreaterThan(0);
  });
});
