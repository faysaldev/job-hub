# Phase 6 release & rollback runbook — JobHub

**Scope:** Apply Phase 6 ZIPs to your existing working Phase 1–5 source tree. Each ZIP contains *only Phase 6 additions and modifications*. Preserve all other files and production data. This release is a candidate until the staging release gate passes. No files should be deleted solely because of Phase 6.

## 1 — Preflight

1. Create a version-controlled checkpoint/branch of the complete Phase 1–5 frontend and backend. Reconcile all Phase 1–5 overlays **in order** if deploying to a fresh copy.
2. Confirm Node 22+/24, pnpm, MongoDB replica set, Redis, R2 public/private buckets and CORS, Stripe test/live secrets with matching webhook signing secret, email provider, frontend/backend origins, and Socket.IO Redis adapter configuration on multi-instance deployments.
3. Set `DATABASE_URL`, `FRONTEND_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, authentication credentials, R2 bucket/credentials, and Redis connection in secured deployment variables. Never include these in client `NEXT_PUBLIC_*`, source code or logs.
4. Rotate old demo/admin credentials and stale production API keys; confirm cross-origin cookie settings and token rotation from Phase 1.
5. Temporarily disable new Stripe Checkout/recruiter promotions during the maintenance window until backend, indexes, frontend and webhook reconciliations pass.

## 2 — Backend install, build, offline checks

```bash
cd backends
corepack enable
# Phase 3/5 introduced packages; refresh the lockfile in a networked dev/CI environment.
pnpm install --no-frozen-lockfile
pnpm exec tsc -p tsconfig.json --noEmit
pnpm build
node scripts/phase6-regression.cjs
pnpm phase6:source-audit
pnpm phase6:unit-check
pnpm phase6:indexes
```

Commit the refreshed `pnpm-lock.yaml` after reviewing it; later CI/builds should use **`pnpm install --frozen-lockfile`**. For an existing codebase without a backend lockfile, generate one and commit before deployments. Static scripts cover Phase 1/3/4/5/6 guardrails but do **not** replace integration/security tests.

Review Phase 4/5 migration and index preflights in their previous release docs. Phase 6 index preview does **not** alter data. To apply after a verified backup, use:

```bash
# bash (PowerShell: $env:PHASE6_INDEXES_APPROVED="YES")
PHASE6_INDEXES_APPROVED=YES pnpm phase6:indexes --apply
```

## 3 — Backup and restore drill, mandatory

Install MongoDB Database Tools (`mongodump`, `mongorestore`) and use an access-controlled archive location outside your web root.

```bash
# Bash. PowerShell uses $env:NAME="value" to export variables.
PHASE6_BACKUP_APPROVED=YES PHASE6_BACKUP_DIR=/secure/backups pnpm phase6:backup --backup
# Set PHASE6_RESTORE_ARCHIVE to the generated .archive.gz, PHASE6_SOURCE_DB to the source DB name,
# PHASE6_DRILL_DB to e.g. jobhub_restore_20261107, and PHASE6_DRILL_DATABASE_URL to an isolated test cluster.
pnpm phase6:restore-drill              # verify archive .sha256, no write
PHASE6_RESTORE_APPROVED=YES pnpm phase6:restore-drill --restore
```

The restore helper permits **only an explicit `jobhub_restore_...` namespace** and refuses to run without approval. Confirm actual document counts, representative read queries and index consistency manually in that isolated database; do not use production DB for this drill. Encrypt/retain backups under your organization's retention policy and restrict access to candidate PII.

## 4 — Frontend install, typecheck, lint, build and browser tests

```bash
cd ../front-end
pnpm install --no-frozen-lockfile    # Phase 6 adds Playwright and axe dev dependencies
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm exec playwright install chromium
# Start frontend and backend with staging config in separate processes first.
PHASE6_WEB_URL=http://localhost:3000 pnpm test:e2e
```

Commit the updated frontend lockfile. Browser suite covers public route rendering, private-admin gating, metadata, keyboard navigation, width overflow and axe WCAG serious/critical violations (desktop/mobile). Configure `PHASE6_WEB_URL` to staging origin. Do not run browser or payment tests against live customers.

## 5 — Backend staging integration and performance smoke

```bash
cd ../backends
PHASE6_STAGING_URL=https://staging-api.example.test pnpm phase6:api-smoke
PHASE6_STAGING_URL=https://staging-api.example.test PHASE6_PERF_SAMPLES=15 PHASE6_PERF_P95_MS=1500 pnpm phase6:performance
```

For role coverage supply `PHASE6_STAGING_ADMIN_TOKEN`, `PHASE6_STAGING_RECRUITER_TOKEN` and `PHASE6_STAGING_SEEKER_TOKEN` for separate sandbox accounts. Verify cross-tenant resume/message access, direct browser R2 upload and CORS, active token revocation after suspension, company verification, moderation/cache invalidation, Stripe subscriptions, refunds and idempotence using dedicated test fixtures. Run Phase 3's live R2 smoke test (`scripts/phase3-live-smoke.cjs`) with test credentials and all Phase 4/5 end-to-end acceptance lists.

**Critical:** The provided staging smoke tests are read-only or use schema-invalid requests; they do **not** automatically perform money movement, full company hiring or backup restoration. Those need an isolated seeded environment plus an operator-approved runbook. If staging variables are absent, Node tests are skipped; skipped tests are **not passed tests**.

## 6 — Deploy, monitor, and rollback

Deploy backend first after backup/index preflight, confirm `/healthz` and `/readyz`, then frontend. Keep old frontend compatible while backend propagates. Configure alerts for error-rate increase, auth/suspension failures, MongoDB connection health, Redis errors, Stripe webhook failures, invoice mismatch and pending support/moderation queues. Track p50/p95 latency by route **without** logging query strings, tokens, resumes or personal form data. Review chargeback and refund states against Stripe.

Rollback before customers pay: disable writes/checkout, restore previous tested frontend/backend build, retain new additive collections. If paid events have already been accepted, freeze checkout first, reconcile Stripe events, subscription entitlements and invoices, and only then revert binaries; **never delete billing ledgers**. R2 asset versions and Cloudinary legacy references must remain accessible. Rollback a MongoDB schema only from a **verified, isolated restore** and with explicit data-loss/reconciliation approval. Carry out a practice rollback in staging and record actual results, owners, UTC timestamps and approval evidence.

## 7 — Release gate (all must pass, no exceptions)

- [ ] Both production builds + typechecks, frontend lint, static regression, staging API and Playwright E2E passed.
- [ ] Admin actions are scoped and audited; unauthorized recruiter cannot read admin records; seeker cannot access other candidates' resumes; suspended sessions are rejected.
- [ ] Admin can verify employers, moderate jobs, suspend accounts, process reports/support, review Stripe invoices/events, and safely retry failed canonical events.
- [ ] R2 browser uploads, signed private GET, expiry, malformed files and Cloudinary migration/rollback tested.
- [ ] Real scheduled/draft job, candidate application, team workflows, interviews, offers and hire end-to-end tested on staging.
- [ ] Stripe price tampering, webhook retry, refund, customer portal, plan quota, cancellation/renewal and sponsored expiration tested.
- [ ] Automated health, logs, dashboards and alerts enabled; backup **restored and validated** in isolation; rollback **practiced and validated**.
- [ ] Privacy/legal notices, PII access policy, email deliverability, document malware scanning/quarantine decision, and data retention reviewed.

**Status on delivery:** Code and offline assertions delivered. Full integration, build, performance and release gates could not be certified without installed project dependencies, staging service credentials and live infrastructure. Do not claim the release is production-ready on static results alone.
