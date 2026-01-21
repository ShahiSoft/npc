exports.up = async function(knex) {
  // Add indexes and constraints for data integrity
  await knex.schema.alterTable('users', (t) => {
    t.index(['email'], 'users_email_idx');
  });
  // simple length check via raw SQL to avoid knex check() portability
  await knex.raw("ALTER TABLE users ADD CONSTRAINT users_email_min_length CHECK (char_length(email) > 3)");

  await knex.schema.alterTable('products', (t) => {
    t.index(['name'], 'products_name_idx');
  });
  // price must be >= 0
  await knex.raw('ALTER TABLE products ADD CONSTRAINT products_price_nonnegative CHECK (price >= 0)');
};

exports.down = async function(knex) {
  await knex.schema.alterTable('users', (t) => {
    t.dropIndex(['email'], 'users_email_idx');
  });
  await knex.raw('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_min_length');
  await knex.schema.alterTable('products', (t) => {
    t.dropIndex(['name'], 'products_name_idx');
  });
  // drop check constraint if exists
  await knex.raw('ALTER TABLE products DROP CONSTRAINT IF EXISTS products_price_nonnegative');
};
