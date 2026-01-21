/**
 * Seed initial data for development convenience.
 */
exports.seed = async function (knex) {
  // clean tables (order-sensitive)
  await knex('shipments').del().catch(() => {});
  await knex('payments').del().catch(() => {});
  await knex('orders').del().catch(() => {});
  await knex('subscriptions').del().catch(() => {});
  await knex('products').del().catch(() => {});
  await knex('users').del().catch(() => {});
  /* eslint-disable @typescript-eslint/no-var-requires */
  // generate client-side UUIDs for ids
  const { randomUUID } = require('crypto');
  const userId = randomUUID();
  const productId = randomUUID();
  const subscriptionId = randomUUID();
  const orderId = randomUUID();

  // insert a sample user
  await knex('users').insert({
    id: userId,
    email: 'dev-user@example.com',
    phone: '+6281234567890',
    addresses: JSON.stringify([
      {
        province: 'DKI Jakarta',
        city: 'Jakarta Selatan',
        district: 'Kebayoran Baru',
        village: 'Gandaria',
        street: 'Jl. Example No.1',
        rt: '004',
        rw: '003',
        postal_code: '12130'
      }
    ]),
    taste_profile: JSON.stringify({ spice_tolerance: 'medium' }),
  });

  // sample product
  await knex('products').insert({ id: productId, name: 'Sample Box', price: 89000 });

  // sample subscription seeded for convenience
  await knex('subscriptions').insert({ id: subscriptionId, user_id: userId, plan: 'monthly', status: 'active', next_billing_date: knex.fn.now() });
  // create an order as example
  await knex('orders').insert({ id: orderId, user_id: userId, subscription_id: subscriptionId, amount: 89000, status: 'created' });
};
