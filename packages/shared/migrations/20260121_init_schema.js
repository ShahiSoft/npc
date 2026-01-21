/**
 * Initial schema for Nusantara monorepo shared domain.
 * Creates Users, Products, Subscriptions, Orders, Payments, Shipments tables
 */
exports.up = async function (knex) {
  // Ensure pgcrypto extension is available for gen_random_uuid()
  try {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  } catch (err) {
    // ignore - some hosted DBs may not allow extension creation; in that case UUIDs may be generated client-side
  }

  // Users
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').notNullable().unique();
    table.string('phone');
    // store addresses as JSONB (flexible Indonesian address structure)
    table.jsonb('addresses').defaultTo('[]');
    table.jsonb('taste_profile').defaultTo('{}');
    table.timestamps(true, true);
  });

  // Products
  await knex.schema.createTable('products', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.bigInteger('price').notNullable().defaultTo(0); // price in smallest currency unit (IDR)
    table.boolean('tax_exempt').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });

  // Subscriptions
  await knex.schema.createTable('subscriptions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('plan').notNullable();
    table.string('status').notNullable().defaultTo('active');
    table.timestamp('next_billing_date');
    table.timestamps(true, true);
  });

  // Orders
  await knex.schema.createTable('orders', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('subscription_id').references('id').inTable('subscriptions').onDelete('SET NULL');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('payment_id').references('id').inTable('payments').onDelete('SET NULL');
    table.uuid('shipment_id').references('id').inTable('shipments').onDelete('SET NULL');
    table.bigInteger('amount').notNullable().defaultTo(0);
    table.string('status').notNullable().defaultTo('created');
    table.timestamps(true, true);
  });

  // Payments
  await knex.schema.createTable('payments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('order_id').references('id').inTable('orders').onDelete('SET NULL');
    table.bigInteger('amount').notNullable().defaultTo(0);
    table.string('status').notNullable().defaultTo('pending');
    table.string('provider');
    table.jsonb('provider_response').defaultTo('{}');
    table.timestamps(true, true);
  });

  // Shipments
  await knex.schema.createTable('shipments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('order_id').references('id').inTable('orders').onDelete('CASCADE');
    table.string('courier');
    table.string('awb');
    table.string('status').notNullable().defaultTo('created');
    table.jsonb('raw_response').defaultTo('{}');
    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('shipments');
  await knex.schema.dropTableIfExists('payments');
  await knex.schema.dropTableIfExists('orders');
  await knex.schema.dropTableIfExists('subscriptions');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('users');
};
