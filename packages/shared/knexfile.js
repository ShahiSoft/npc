try {
  // optional dotenv load for local development
  // wrap in try/catch so knex CLI doesn't fail if dotenv isn't installed
  // CI sets DATABASE_URL directly.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
} catch (err) {
  // ignore
}
/**
 * Knex configuration for packages/shared migrations and seeds.
 * Uses `DATABASE_URL` env var when provided, otherwise defaults to a local Postgres URI.
 */
module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1:5432/nusantara_dev',
    migrations: {
      directory: __dirname + '/migrations',
    },
    seeds: {
      directory: __dirname + '/seeds',
    },
  },
};
