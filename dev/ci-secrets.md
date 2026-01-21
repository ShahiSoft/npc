# CI Secrets & Usage

Required GitHub Secrets used by CI and integration tests:

- `DATABASE_URL` — Postgres connection string for migrations and integration tests. Example: `postgres://postgres:postgres@localhost:5432/nusantara_dev` (set in the workflow environment for local runner or GitHub Actions secrets for hosted systems).
- `XENDIT_API_KEY` — Xendit API key for sandbox/integration tests (optional; used only when running sandbox tests).
- `SHIPPER_API_KEY` — Shipper.id API key for sandbox/integration tests (optional).
- `JWT_PRIVATE_KEY` / `JWT_PUBLIC_KEY` — PEM keys used by the shared auth module if issuing/validating tokens in CI or integration tests. For local dev, use `node packages/shared/scripts/generate-jwt-keys.js` to generate keys and then set them as secrets.

How to use in workflow:

```yaml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  XENDIT_API_KEY: ${{ secrets.XENDIT_API_KEY }}
  SHIPPER_API_KEY: ${{ secrets.SHIPPER_API_KEY }}
  JWT_PRIVATE_KEY: ${{ secrets.JWT_PRIVATE_KEY }}
  JWT_PUBLIC_KEY: ${{ secrets.JWT_PUBLIC_KEY }}
```

Local dev:

1. Generate JWT keys for dev:

```bash
node packages/shared/scripts/generate-jwt-keys.js
```

2. Export `DATABASE_URL` and other variables in `.env.development` (do NOT commit secrets):

```env
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/nusantara_dev
JWT_PRIVATE_KEY="$(cat packages/shared/scripts/keys/jwt_private.pem)"
JWT_PUBLIC_KEY="$(cat packages/shared/scripts/keys/jwt_public.pem)"
```

Security note: Never commit secrets to Git. Use GitHub Secrets and environment variable injection in workflows.

How to add GitHub Secrets (repo-level)
1. Go to your repository on GitHub.
2. Settings → Secrets and variables → Actions → New repository secret.
3. Enter the secret name (e.g., `DATABASE_URL`) and the value, then click `Add secret`.
4. Repeat for each required secret (`XENDIT_API_KEY`, `SHIPPER_API_KEY`, `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY`).

Organization-level secrets can be configured under the organization settings and scoped to repositories if preferred.
