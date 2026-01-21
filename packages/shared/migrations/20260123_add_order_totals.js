exports.up = async function (knex) {
  await knex.schema.alterTable('orders', (table) => {
    table.bigInteger('subtotal').notNullable().defaultTo(0); // in smallest currency unit
    table.bigInteger('tax').notNullable().defaultTo(0);
    table.bigInteger('total').notNullable().defaultTo(0);
  });
  // index for quick lookups by totals
  await knex.schema.alterTable('orders', (table) => {
    table.index(['subtotal'], 'orders_subtotal_idx');
    table.index(['tax'], 'orders_tax_idx');
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('orders', (table) => {
    table.dropIndex(['subtotal'], 'orders_subtotal_idx');
    table.dropIndex(['tax'], 'orders_tax_idx');
  });
  await knex.schema.alterTable('orders', (table) => {
    table.dropColumn('subtotal');
    table.dropColumn('tax');
    table.dropColumn('total');
  });
};
