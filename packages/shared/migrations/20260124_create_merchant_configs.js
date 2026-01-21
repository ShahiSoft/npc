exports.up = async function (knex) {
  await knex.schema.createTable('merchant_configs', (table) => {
    table.string('merchant_id').primary();
    table.string('rounding').notNullable().defaultTo('round-at-end');
    table.string('region').nullable();
    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('merchant_configs');
};
