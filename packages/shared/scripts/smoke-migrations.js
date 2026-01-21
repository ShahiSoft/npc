const Knex = require('knex');
const config = require('../knexfile');

async function run() {
  const env = process.env.NODE_ENV || 'development';
  const knex = Knex(config[env]);
  try {
    // Check that the key tables exist
    const hasUsers = await knex.schema.hasTable('users');
    const hasOrders = await knex.schema.hasTable('orders');
    const hasSubscriptions = await knex.schema.hasTable('subscriptions');
    if (!hasUsers || !hasOrders || !hasSubscriptions) {
      console.error('Smoke test failed: expected tables not present', { hasUsers, hasOrders, hasSubscriptions });
      process.exitCode = 2;
      return;
    }

    // perform a simple query to ensure DB is responsive
    const [{ count }] = await knex('users').count('*');
    console.log('users count:', count);
    console.log('Migration smoke test passed');
  } catch (err) {
    console.error(err);
    process.exitCode = 2;
  } finally {
    await knex.destroy();
  }
}

if (require.main === module) run();
