# Contributing to Nusantara Pantry Club

Thank you for contributing. This document describes how to work with the repo, run tests locally, and submit PRs.

Branching & workflow
- Use short-lived feature branches off `main`: `feat/<short-description>`, `fix/<short-description>`, `chore/<short>`.
- Keep changes focused and add tests for new behavior.

Commit messages
- Follow Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`.

Pull requests
- Open a PR targeting `main` and include a clear description and testing steps.
- Ensure CI passes (lint, typecheck, build, tests).
- Request at least one reviewer before merge.

Code style
- TypeScript projects follow ESLint and Prettier configs at the package level. Run:

```bash
pnpm -w -r run lint
pnpm -w -r run format
```

Running tests locally

Unit tests (fast):

```bash
pnpm -w -r run test
```

Shared integration / smoke tests (may require Docker):

```bash
pnpm run infra:up
pnpm --filter @nusantara/shared run migrate
pnpm --filter @nusantara/shared run seed
node packages/shared/dist/tests/run.js
```

Adding tests
- Put unit tests next to source under `packages/*/src/tests`.
- Keep tests deterministic and avoid network calls — use injected fake transports or mocks.

Security & secrets
- Do not commit secrets. Use GitHub Actions secrets for CI and environment-specific `.env` files locally (listed in `.gitignore`).

Reporting issues
- Open an issue with a reproducible example and expected behavior.

Maintainers
- See `CODEOWNERS` (if present) or request maintainers via PR reviewers.
