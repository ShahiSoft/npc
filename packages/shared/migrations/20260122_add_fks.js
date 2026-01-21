exports.up = async function(knex) {
  // Add FK constraints after initial data model is in place to avoid circular dependency issues
  await knex.schema.alterTable('payments', (table) => {
    table.foreign('order_id').references('id').inTable('orders').onDelete('SET NULL');
  });
  await knex.schema.alterTable('shipments', (table) => {
    table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE');
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('payments', (table) => {
    table.dropForeign('order_id');
  });
  await knex.schema.alterTable('shipments', (table) => {
    table.dropForeign('order_id');
  });
};
