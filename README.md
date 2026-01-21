# Nusantara Pantry Club — Monorepo

This repository contains the Nusantara Pantry Club monorepo. It provides a shared TypeScript library (`@nusantara/shared`), sample services, clients, and developer tooling to implement the unified platform described in `dev/Master-plan.txt`.

Quick start (local development)

Prerequisites:
- Node.js (LTS) and `corepack` (for `pnpm`)
- Docker (recommended for Postgres/Redis via `docker-compose`) — required for integration smoke tests

Install dependencies:

```bash
pnpm install
```

Start infra (Postgres + Redis) using the provided compose file:

```bash
pnpm run infra:up
# Wait for services to become healthy (see logs)
```

Run migrations and seeds for the shared package:

```bash
pnpm --filter @nusantara/shared run migrate
pnpm --filter @nusantara/shared run seed
```

Build all packages:

```bash
pnpm -w -r run build
```

Run the shared test suite (unit tests + smoke tests). Smoke tests that require Docker/Testcontainers will be skipped if Docker is unavailable.

```bash
node packages/shared/dist/tests/run.js
```

Repository layout (top-level):

- `packages/shared` — shared types, events, clients, utilities, migrations, and tests
- `packages/services` — sample services (e.g., `sample-consumer`)
- `dev/` — planning and phase files (Master-plan and phase summaries)
- `.github/workflows` — CI and Testcontainers workflows

CI

- CI builds and runs tests using GitHub Actions (`.github/workflows/ci.yml`).
- Integration / Testcontainers tests run in `.github/workflows/testcontainers.yml` where Docker is available.

Contributing

See `CONTRIBUTING.md` for branch, commit and PR guidelines, and how to run tests locally.

License

See repository `LICENSE` or contact the maintainers.
# Nusantara Pantry Club — Monorepo

This repository contains the monorepo skeleton for Nusantara Pantry Club as described in `dev/Master-plan.txt`.

Quick commands (use your package manager, e.g., `pnpm` / `yarn` / `npm`):

```bash
# install deps
pnpm install

# development
pnpm run dev

# build all packages
pnpm run build
```

Packages are under `packages/`.
