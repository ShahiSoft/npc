#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR=$(cd "$(dirname "$0")/../../.." && pwd)
echo "Bringing up docker-compose infra..."
docker compose -f "$ROOT_DIR/docker-compose.dev.yml" up -d

echo "Waiting for Postgres to accept connections..."
for i in {1..60}; do
  if docker run --rm --network host postgres:14 pg_isready -h 127.0.0.1 -p 5432 -U postgres >/dev/null 2>&1; then
    echo "Postgres ready"
    break
  fi
  sleep 1
done

echo "Running migrations"
DATABASE_URL="postgres://postgres:postgres@127.0.0.1:5432/nusantara_dev" pnpm --filter @nusantara/shared run migrate
DATABASE_URL="postgres://postgres:postgres@127.0.0.1:5432/nusantara_dev" pnpm --filter @nusantara/shared run seed
DATABASE_URL="postgres://postgres:postgres@127.0.0.1:5432/nusantara_dev" pnpm --filter @nusantara/shared run migrate:smoke

echo "All done"
