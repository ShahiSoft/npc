# Database migrations & seeds (packages/shared)

This folder contains Knex migration and seed files for the shared schema used by the monorepo.

Usage

1. Ensure you have a running Postgres instance. By default the knexfile uses:

```
postgres://postgres:postgres@127.0.0.1:5432/nusantara_dev
```

2. To run migrations:

```bash
# from repo root
corepack enable
corepack prepare pnpm@latest --activate
pnpm --filter @nusantara/shared install
pnpm --filter @nusantara/shared run migrate
```

3. To undo the last migration:

```bash
pnpm --filter @nusantara/shared run migrate:rollback
```

4. To seed initial data (development only):

```bash
pnpm --filter @nusantara/shared run seed
```

Notes
- `migrate` and `seed` scripts are defined on `packages/shared/package.json` and use `knex` with the local `knexfile.js`.
- The migrations create `users`, `products`, `subscriptions`, `orders`, `payments`, `shipments` tables with appropriate foreign keys.
- Addresses are stored as `JSONB` to support Indonesian address flexibility (RT/RW, village/district fields).
- Running the seed file will insert a sample user, product, subscription and order for local development.
