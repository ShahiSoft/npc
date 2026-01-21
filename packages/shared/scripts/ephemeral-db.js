#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
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
    // Some Docker setups don't surface the postgres startup log reliably; wait for listening port instead
    .withWaitStrategy(Wait.forListeningPorts([5432]))
    .start();

  // Start Redis container for Pub/Sub smoke test
  console.log('Starting ephemeral Redis via Testcontainers...');
  const redisContainer = await new GenericContainer('redis:7')
    .withExposedPorts(6379)
    .withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
    .start();

  const redisHost = redisContainer.getHost();
  const redisPort = redisContainer.getMappedPort(6379);
  const redisUrl = `redis://${redisHost}:${redisPort}`;
  console.log('Redis ready at', redisUrl);

  const host = container.getHost();
  const port = container.getMappedPort(5432);
  const connectionString = `postgresql://postgres:postgres@${host}:${port}/npc_dev`;
  console.log('Postgres ready at', connectionString);

  const knex = require('knex')({
    client: 'pg',
    connection: connectionString,
    migrations: {
      directory: path.resolve(__dirname, '..', 'migrations'),
    },
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

    // Run a simple Redis Pub/Sub roundtrip to validate event flow
    console.log('Running Redis Pub/Sub smoke test...');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const IORedis = require('ioredis');
    const sub = new IORedis({ host: redisHost, port: redisPort });
    const pub = new IORedis({ host: redisHost, port: redisPort });

    const topic = 'test:user_created';
    const payload = JSON.stringify({ id: 'smoke-user', email: 'smoke@example.com' });

    const pubPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Redis pub/sub timeout')), 10000);
      sub.subscribe(topic, (err) => {
        if (err) return reject(err);
        sub.once('message', (ch, msg) => {
          clearTimeout(timeout);
          if (ch === topic && msg === payload) {
            resolve(true);
          } else {
            reject(new Error('Redis message mismatch'));
          }
        });
        // publish after subscribe
        pub.publish(topic, payload).catch(reject);
      });
    });

    await pubPromise;
    await sub.quit();
    await pub.quit();
    console.log('Redis Pub/Sub smoke test passed');

    console.log('Ephemeral DB run successful. Cleaning up...');
  } catch (err) {
    console.error('Error during ephemeral DB run:', err);
    process.exitCode = 2;
  } finally {
    try {
      await knex.destroy();
    } catch (e) {
      /* ignore cleanup errors */
    }
    try {
      await container.stop();
    } catch (e) {
      /* ignore container stop errors */
    }
    try {
      await redisContainer.stop();
    } catch (e) {
      /* ignore redis stop errors */
    }
  }

  process.exit(process.exitCode || 0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
