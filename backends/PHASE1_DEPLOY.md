# JobHub Phase 1 — backend deployment and verification

This update modifies only the existing authentication/account APIs. **No new public HTTP endpoints** were introduced. Account verification and password reset use the existing routes; SMTP work is queued in MongoDB instead of blocking HTTP requests.

## Before deployment

1. Merge the included `backends/` paths into the original codebase. Preserve all other project files and your existing `.env` secrets. Review the `.env.example` additions; **never deploy example secret values**.
2. Set strong, independent `JWT_SECRET`, `JWT_REFRESH_SECRET` (at least 24 characters each), `MAIL_OUTBOX_KEY` (a stable random 32+-character value), `DATABASE_URL`, and exact `FRONTEND_URL` origin(s). Use a verified sending domain: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`, and TLS settings. Alternatively, the existing Gmail app-password transport is still supported.
3. In production, SMTP must be configured: the server fails fast if credentials are missing. Set `MAIL_VERIFY_ON_STARTUP=true` as a deployment preflight when the provider permits SMTP verification. Send a real test email before enabling registrations.
4. Set `AUTH_COOKIE_SAME_SITE=none` for a cross-site HTTPS frontend/API deployment, or `lax` if browser and API are same-site. Cross-site authentication may be blocked by browser third-party-cookie restrictions; where possible, serve your API on the same site as the frontend. Secure cookies in production require HTTPS. `FRONTEND_URL` is also the shared CORS allowlist.
5. Run the index creation command against a backed-up database, and review any preexisting conflicting indexes before applying: `node scripts/phase1-build-indexes.cjs` from the backend directory.
6. Compile and deploy both frontend and backend from the same release; do not roll out only one half of a session-protocol change.

## Required delivery worker

Queued verification/recovery messages are encrypted in MongoDB until sent (or discarded on expiry). The API process also checks the queue every 15 seconds, but request-based CPU services may pause background work. **For Cloud Run, schedule `node dist/mail-worker.js` as a Cloud Run Job at least once per minute**, using the same environment variables/database and restricted access. Avoid exposing a new public endpoint for the poller. Monitor failed outbox records and SMTP errors. Do not change `MAIL_OUTBOX_KEY` while unexpired messages are queued.

## Local checks

```sh
npm install
npm run typecheck
npm run build
npm run phase1:auth-check
node scripts/phase1-static-security-check.cjs
node scripts/phase1-build-indexes.cjs
```

Run the optional `node scripts/phase1-staging-smoke.cjs` only on an isolated staging backend connected to a Mailpit sandbox inbox. The script intentionally creates and deletes **test** seeker and recruiter accounts; see its header for required environment variables. It cannot substitute for testing live SMTP deliverability, the real browser cookie policy, or a 30-minute session test.

## Existing HTTP routes (unchanged)

`POST /api/v1/auth/register`, `verify-email`, `login`, `forgot-password`, `reset-password`, `resend-verification`, `refresh`, `logout`; and existing authenticated `/api/v1/users/self/in`, `PATCH /api/v1/users/update`, `PATCH /api/v1/users/change-password`, `DELETE /api/v1/users/delete-profile`.

Access JWTs are 15 minutes, refresh cookies 30 days, and at most three active sessions per user. Password change, reset, and account disable revoke sessions. The account deletion operation is a **soft delete**; retention/data-erasure policy requires separate legal/product review.

## Release gate

Verify: normal and disposable-address sign-up behavior; registration recovery when SMTP temporarily fails; email links and six-digit fallback; reset code expiry, reuse and attempt throttling; wrong-password errors; refresh cookie attributes; concurrent refresh calls; mobile Safari and Chromium reload/direct navigation; logout and password-change revocation; 30-minute ordinary use; settings security. Keep source auditing distinct from verified live behavior.
