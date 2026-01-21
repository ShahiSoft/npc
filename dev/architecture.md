# Architecture Overview — Nusantara Pantry Club

This short architecture README summarizes the major components, owners, and contact points for Phase‑1.

Core components
- `packages/shared` — Shared types, events, clients, utilities, and DB migrations. Owner: `@admin` (admin@nusantara.example.com)
- `packages/services` — Sample and reference services (e.g., `sample-consumer`). Owner: `@admin` (admin@nusantara.example.com)
- CI / infra — GitHub Actions workflows and `docker-compose.dev.yml`. Owner: `@admin` (admin@nusantara.example.com)

High-level topology
- Single Postgres DB shared by services (migrations in `packages/shared/migrations`)
- Event bus: Redis Pub/Sub (typed `PubSub` abstraction in `packages/shared/src/events`)
- Shared clients: Xendit and Shipper clients under `packages/shared/src/clients`

Local development
- Use `pnpm run infra:up` to start Postgres and Redis locally via `docker-compose.dev.yml`.
- Run migrations and seeds in `packages/shared` as documented in the top-level `README.md`.

Contacts and escalation
- Primary maintainer alias: maintainers@nusantara.example.com
- Shared package: shared-team@nusantara.example.com
- Infra & CI: infra-team@nusantara.example.com

Notes
- Replace placeholder team handles/emails with actual GitHub teams and contact addresses as appropriate for your org.
- See `dev/phase-1.md` for completed tasks and links to implementation locations.
