# JWT Key Rotation & Revocation Plan (Draft)

Overview
- Use asymmetric keys (RSA/ECDSA) for signing JWTs. Store private keys securely (GitHub Secrets or secret manager).

Rotation policy (recommended)
- Rotate keys every 90 days for production systems or on suspected compromise.
- Maintain a key identifier (`kid`) in JWT headers to support multiple active keys during rotation.

Operations
1. Generate new key pair (dev):

```bash
node packages/shared/scripts/generate-jwt-keys.js
```

2. Publish new public key to a key registry (for tests, use `JWT_PUBLIC_KEY` secret).
3. Update service(s) to accept both old and new keys for a short overlap window.
4. After rollout and verification, remove old key from secrets and consumers.

Revocation
- Maintain a revocation list (e.g., short-lived token expiry, or central blacklist) for issued tokens that must be invalidated immediately. For Phase‑1, use short token TTLs and a simple in-memory revocation endpoint in the auth service for testing.

Testing helpers
- Use `packages/shared/scripts/generate-jwt-keys.js` to create test keys.
- Add tests that sign with new key and verify with public key.

Notes
- This is a draft. For production, integrate with a secret manager (AWS KMS/Secrets Manager, Azure Key Vault, GCP KMS) and automate rotation.
