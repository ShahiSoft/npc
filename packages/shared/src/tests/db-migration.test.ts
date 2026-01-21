/* eslint-disable @typescript-eslint/no-var-requires */
export async function runDbMigrationTests() {
  console.log('Running DB migration tests with Testcontainers...');
  const tc = await import('testcontainers');
  const GenericContainer: any = (tc as any).GenericContainer;
  const Wait: any = (tc as any).Wait;
  const pg = await new GenericContainer('postgres:14')
    .withEnvironment('POSTGRES_DB', 'npc_test')
    .withEnvironment('POSTGRES_USER', 'postgres')
    .withEnvironment('POSTGRES_PASSWORD', 'postgres')
    .withExposedPorts(5432)
    .withWaitStrategy(Wait.forListeningPorts ? Wait.forListeningPorts([5432]) : Wait.forListeningPort(5432))
    .start();

  const host = pg.getHost();
  const port = pg.getMappedPort(5432);
  const connectionString = `postgresql://postgres:postgres@${host}:${port}/npc_test`;

  const path = require('path');
  const knex = require('knex')({
    client: 'pg',
    connection: connectionString,
    migrations: { directory: path.resolve(__dirname, '..', 'migrations') },
  });

  try {
    await knex.migrate.latest();
    console.log('Migrations applied');
    // simple smoke check: ensure orders table exists
    const exists = await knex.schema.hasTable('orders');
    if (!exists) throw new Error('orders table not found after migrations');
    console.log('orders table exists');
  } finally {
    try { await knex.migrate.rollback(); } catch (e) {}
    try { await knex.destroy(); } catch (e) {}
    try { await pg.stop(); } catch (e) {}
  }

  console.log('DB migration tests passed');
}

if (require.main === module) {
  runDbMigrationTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
