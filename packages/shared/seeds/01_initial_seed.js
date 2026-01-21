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

  // insert a sample user
  const user = {
    id: knex.raw('gen_random_uuid()'),
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
  };

  await knex('users').insert({
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
  await knex('products').insert({ name: 'Sample Box', price: 89000 });

  // sample subscription seeded for convenience (link via user email)
  const [u] = await knex('users').select('id').where({ email: 'dev-user@example.com' }).limit(1);
  if (u && u.id) {
    const [prod] = await knex('products').select('id').limit(1);
    const [subscriptionId] = await knex('subscriptions').insert({ user_id: u.id, plan: 'monthly', status: 'active', next_billing_date: knex.fn.now() }).returning('id');
    // create an order as example
    await knex('orders').insert({ user_id: u.id, subscription_id: subscriptionId, amount: 89000, status: 'created' });
  }
};
