#!/usr/bin/env node
const path = require('path');

(async () => {
  console.log('Starting ephemeral Postgres via Testcontainers...');
  const tc = await import('testcontainers');
  const { GenericContainer, Wait } = tc;
  const container = await new GenericContainer('postgres:14')
    .withEnvironment('POSTGRES_DB', 'npc_dev')
    .withEnvironment('POSTGRES_USER', 'postgres')
    .withEnvironment('POSTGRES_PASSWORD', 'postgres')
    .withExposedPorts(5432)
    .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(5432);
  const connectionString = `postgresql://postgres:postgres@${host}:${port}/npc_dev`;
  console.log('Postgres ready at', connectionString);

  const knex = require('knex')({
    client: 'pg',
    connection: connectionString,
    migrations: {
      directory: path.resolve(__dirname, '..', 'migrations')
    }
  });

  try {
    console.log('Running migrations...');
    await knex.migrate.latest();
    console.log('Running seeds...');
    await knex.seed.run();

    console.log('Running smoke query...');
    const res = await knex.raw('SELECT COUNT(*)::int AS cnt FROM users');
    const cnt = res.rows ? res.rows[0].cnt : res[0].cnt;
    console.log('users count:', cnt);

    console.log('Ephemeral DB run successful. Cleaning up...');
  } catch (err) {
    console.error('Error during ephemeral DB run:', err);
    process.exitCode = 2;
  } finally {
    try { await knex.destroy(); } catch (e) {}
    try { await container.stop(); } catch (e) {}
  }

  process.exit(process.exitCode || 0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
