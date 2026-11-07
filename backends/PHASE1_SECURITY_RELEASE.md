# JobHub Phase 1 — security foundation & release runbook

This patch is an **incremental overlay** for the uploaded JobHub project. It is not a rebuilt project and it does not change the UI design system or migrate Cloudinary to R2 (Phase 3).

## What changed

- Admin role is no longer accepted by public signup; profile updates are strictly allowlisted.
- Access tokens are signed for 15 minutes; password hashes and verification codes are not returned to clients. Auth sessions use rotating, 30-day, HttpOnly refresh cookies stored as SHA-256 token hashes in MongoDB; three active sessions per account.
- Registration email verification and password reset codes have 10-minute expiry and attempt limits; login/registration/reset have Redis-backed rate limiting with local fallback.
- Authorization now verifies DB-backed user role, active session, and ownership on all protected REST endpoints and Socket.IO message/conversation actions.
- Recruiter job mutations, applicant records, interview scheduling and hiring are scoped to the owning recruiter. Candidate application withdrawals and job deletion preserve history.
- Messaging and notification requests are participant/receiver-scoped; shared Redis message cache is read **only after** membership authorization. Socket connections reauthorize on every event.
- Fixed-price legacy Stripe boost checkout verifies the applicant, verifies signed webhooks, and grants paid status only after server-side confirmed payment. User-provided price fields are ignored.
- API search and dashboard queries use bounded pagination, escaped regex searches, corrected job activity filters and targeted cache invalidation rather than Redis key scans.
- The original API paths are retained for frontend compatibility; **`POST /api/v1/auth/refresh` and `POST /api/v1/stripe/webhook`** are the only new routes (the existing `/auth/logout` route now revokes a real session). Merging different security-sensitive APIs into a single endpoint would worsen cacheability, permissions and maintenance.

## Before using the patch

1. **Immediately rotate the published demo/admin passwords** found in the repository root `README.md` if any of those accounts still exist. The root README is outside the two requested component ZIPs, so **remove the "Demo Access / Credentials" section manually** before publishing.
2. Backup MongoDB and record the original frontend/backend commit hashes and environment variables. Rollback requires restoring both frontend and backend together; a new access-token protocol intentionally invalidates older JWTs.
3. Generate two independent random secrets: `openssl rand -hex 32` for `JWT_SECRET` and `JWT_REFRESH_SECRET`; use distinct values. Match `FRONTEND_URL` against the browser's actual origin, and configure `AUTH_COOKIE_SAME_SITE` for your domain topology.
4. Run the read-only duplicate-index preflight **before** creating any new unique index; do not erase historical applications without reviewing them. Validate a backup restore.
5. Keep Cloudinary, MongoDB, Redis and email service configured. Set `STRIPE_WEBHOOK_SECRET` for Stripe webhooks. Set a fixed `APPLICATION_BOOST_PRICE_CENTS` to enable the optional legacy boost, or leave it `0` to disable it. For production, set distinct origins and HTTPS.

## Commands: backend (Node 22+, pnpm)

```bash
cd backends
corepack enable
pnpm install --frozen-lockfile
node scripts/phase1-static-security-check.cjs
node scripts/phase1-data-preflight.cjs
# Fix duplicate records safely if the preflight reports any (do not proceed blindly).
node scripts/phase1-build-indexes.cjs
pnpm exec tsc --noEmit
pnpm run build
pnpm run dev
```

## Commands: frontend

```bash
cd front-end
corepack enable
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
pnpm run dev
```

Full endpoint inventory and per-route permissions: **`PHASE1_API_CONTRACTS.md`**. The inventory covers 60 routes mounted by the main router plus the separate Stripe webhook.

## Stripe webhook delivery

Register `https://<YOUR_API_HOST>/api/v1/stripe/webhook` in Stripe and listen for `checkout.session.completed` plus `checkout.session.async_payment_succeeded`. Configure its signing secret (`whsec_...`). Test with Stripe CLI on local development and verify that a cancelled or unpaid session **never** marks an application paid. Candidate-provided `amount` is ignored on checkout. Existing paid amounts created before Phase 1 require reconciliation against Stripe records: do not automatically elevate legacy unverified amounts.

## Data/index compatibility

- Existing user/password hashes, seeker profiles, companies, jobs, messages and application records are **not destroyed**. Existing users must **sign in again** after cutover because earlier bearer JWTs did not contain a session ID and token type. New verification codes use a different hash format; pending users should use *Resend verification*.
- `jobs.isDeleted`, `applications.isWithdrawn`, `applications.boostPaymentStatus`, `applications.boostPriceCents`, and `conversations.hiddenFor` have safe default/missing-value handling. Existing `paid_amount` values remain intact for audit, but should not be treated as paid without webhook reconciliation.
- A new unique compound index is required for applications `(job_id,applicant)` and saved jobs `(userId,jobId)`. The preflight script reports any duplicates before index creation. The script `phase1-build-indexes.cjs` is explicit; stage and test it before production. MongoDB must allow index creation.
- Production Redis outages cause temporary fallback to in-process rate limiting; **do not rely on fallback protection under multi-instance high-traffic production**. Monitor Redis connectivity and use shared adapter for multi-node Socket.IO if scaling horizontally.
- The existing 10MB authenticated Cloudinary image upload remains for Phase 3; private resumes continue to use the existing URL field until secure R2 migration.

## Public listing caveat

The public candidate/company profile queries hide disabled/unverified account records after pagination to prevent accidental exposure, but original database total counts still include inactive profiles. If disabled accounts are common, a fully accurate public pagination count requires an indexed aggregate join in a follow-up optimization.

## Required tests before a production release

| Test | Expected result |
| --- | --- |
| Public register with `role:admin` | 400; no admin user created |
| Candidate PATCH `/users/update` with `{ role:"admin", isEmailVerified:true }` | 400; properties unchanged |
| Seeker login, verify email, refresh, logout | Cookie rotates, 15-min access issued, logout revokes session |
| Expired/reset-password session | Protected API and Socket.IO deny access |
| Recruiter A edits/deletes recruiter B's job | 404; no mutation |
| Recruiter A updates B's application's status | 404; no mutation |
| Candidate A withdraws candidate B's application | 404; no mutation |
| Recruiter hires unrelated candidate | 404; no mutation |
| Unauthorized Socket.IO conversation:join/messages:get | Error; no room access and no cached messages |
| User A edits/deletes B's message | Error; no mutation |
| Public seeker listing | No email/phone/resume URLs |
| Stripe client sets arbitrary amount | Rejected/ignored; server-configured amount only |
| Fake Stripe webhook / duplicate event | Signature rejected / no duplicate fulfillment |
| Soft-deleted job | No public visibility; historic applications retained |
| 3+ sessions, password reset, account deletion | Old/revoked sessions denied |
| Load tests for pagination and Redis cache invalidation | Bounded queries, no stale active listings, acceptable latency |

**Verification boundary:** Source-level security assertions and TypeScript syntax parsing may be run offline. A full dependency typecheck, production build, database integration test, browser E2E test, real SMTP delivery, and real Stripe webhook test require the actual installed dependencies, data services and project secrets. Do **not** claim a production launch passed until those checks complete on your staging environment.

## Rollback

Re-deploy the backed-up **matched frontend/backend versions** and restore the original environment. New auth cookies/sessions should be invalidated if rolling back to a protocol that does not understand them. Keep existing database data; do not drop the added indexes before evaluating application write rules. Retain webhook event history for audit. Do not deploy the new frontend alone against the old backend (or vice versa) because the session protocol is coupled.
