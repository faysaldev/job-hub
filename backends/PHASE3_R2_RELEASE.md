# Phase 3 — R2 storage and backend release runbook

**Apply after verified Phase 1 + 2 changes.** Archive contains only changed/new Phase 3 files; overlay paths exactly. Never use this rollout as a blind production deployment.

## 1. Provision storage (required before enabling new uploads)

1. Create **two separate R2 buckets**, e.g. `jobhub-public` and `jobhub-private`, in your Cloudflare account. Do not attach a public custom domain or `r2.dev` endpoint to the private bucket. Disable public access to private bucket.
2. Attach a **verified HTTPS custom domain** (e.g. `https://media.example.com`) to the *public* bucket, with DNS/TLS ready. Put precisely that origin in `R2_PUBLIC_BASE_URL`. Configure Cloudflare Cache Rules for immutable UUID asset paths as appropriate. Do not claim another account's domain.
3. Generate scoped R2 S3 credentials with object read/write/delete permissions restricted to these two buckets. Keep them server-side, never in `NEXT_PUBLIC_*` or repository files.
4. In the **public and private buckets**, configure CORS using the actual frontend origin(s) (production and staging) and HTTP method **PUT**. Allow request headers **Content-Type** and **If-None-Match**; optionally expose **ETag**. The direct upload URL uses a signed `If-None-Match: *` create-once request. Preflight for `OPTIONS` must succeed. The private bucket must NOT permit arbitrary public reads: authorization occurs through the Express API before short-lived signed GET.
5. Apply `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_BUCKET`, `R2_PRIVATE_BUCKET`, `R2_PUBLIC_BASE_URL` in `backends/.env`. `SOCKET_REDIS_ADAPTER=true` only when intentionally running multiple Socket.IO instances against a shared Redis Pub/Sub service; keep `false` for a single instance. If using managed Redis, set `REDIS_URL=rediss://...`.
6. Set `NEXT_PUBLIC_R2_PUBLIC_BASE_URL` to the same HTTPS public origin on the frontend and rebuild Next.js; allow the new host in your CSP if you have a separate deployment security policy. Keep legacy Cloudinary reads during transition.

## 2. Dependencies, database and preflight

```bash
cd backends
# The baseline lockfile predates the new R2 and Redis adapter packages.
# Regenerate lockfile once in a connected development environment, then COMMIT it.
corepack enable
pnpm install --no-frozen-lockfile
pnpm exec tsc -p tsconfig.json --noEmit
pnpm run build
pnpm run phase3:static-check

# Snapshot MongoDB and TEST a restore before applying additive indexes.
PHASE3_INDEXES_APPROVED=yes pnpm run phase3:indexes

cd ../front-end
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

For repeatable CI/deployments use `pnpm install --frozen-lockfile` *after the regenerated backend lockfile is checked in*. Avoid `npm install` mixed with pnpm. Run any existing Phase 1 security scripts, integration tests, and E2E suites too.

## 3. Migration: dry-run -> staging -> batches -> audit

```bash
cd backends
pnpm run phase3:migrate:dry
# Cloudinary source files remain in place. Migration reads from res.cloudinary.com only.
PHASE3_MIGRATION_APPROVED=yes node scripts/phase3-migrate-media.cjs --apply --limit=25
# Repeat only after verifying each batch. Pause/review failed rows.
```

- The migration processes Cloudinary avatar, company logo, seeker resume and application resume references. It downloads with a 15s timeout, rejects redirect and untrusted hosts, checks byte limits and file magic, uploads and HEAD-verifies R2, and uses compare-and-swap to update MongoDB fields. Third-party resume URLs are untouched. **It never deletes Cloudinary assets**.
- `Asset.legacyUrl` retains the old reference for rollback; keep read fallback until you have reviewed all migrated references, CDN propagation, browser image loads and private-file authorization.
- If an individual row fails, it remains on Cloudinary. Fix the reason and rerun. `--limit` controls batch size, not a total migration cursor. Never run with arbitrary unreviewed media hostnames.

## 4. Rollback (no destructive cleanup)

```bash
cd backends
pnpm run phase3:rollback:dry
PHASE3_ROLLBACK_APPROVED=yes node scripts/phase3-rollback-media.cjs --apply --limit=25
```

Rollback only reverts a DB field **if it still equals this migration's asset reference**; it will not overwrite a user's later uploaded file. It deliberately retains objects in **both** R2 and Cloudinary for postmortem and manual cleanup. Reverting the *application code* requires a coordinated rollback to the preceding deploy and old environment variables. If you activate R2-only uploads for new files, rolling back code alone will not make those new R2 references readable in the old version: freeze writes and retain the R2-aware reader or temporarily keep the new code in read-only mode.

## 5. Before exposing production traffic — mandatory live acceptance

For an opt-in automated, **partial staging** sanity check after secrets and buckets are configured, run from `backends` (test tokens are never printed):

```bash
PHASE3_LIVE_TEST_APPROVED=yes \
TEST_API_BASE=https://your-staging-api.example.com/api/v1 \
TEST_SEEKER_TOKEN="<staging-seeker-access-token>" \
TEST_RECRUITER_TOKEN="<unrelated-staging-recruiter-access-token>" \
node scripts/phase3-live-smoke.cjs
```

The smoke test writes two tiny storage objects and verifies authorized/unauthorized private access. It does not validate browser CORS, external-email delivery, malware scanning, end-to-end hiring or payments.

- [ ] Browser PUT (PNG, JPEG, WebP, PDF, DOCX) succeeds against both buckets, CORS preflight permits the exact headers, confirm returns correct URL/reference, public CDN displays images on web and mobile.
- [ ] Signatures/mime/size/expiry/role restrictions reject wrong file purpose and corrupted uploads; no raw objects bypass confirmation.
- [ ] Candidate A cannot get candidate B's private resume unless it is attached to an active application for a job that recruiter B owns; recruiter C and logged-out users get 401/404.
- [ ] Unrelated chat participants and logged-out users cannot fetch attachments; attachments are present only on messages in an authorized conversation.
- [ ] Existing Cloudinary photos and resume links are still accessible during migration; dry-run, partial migration, rollback and repeat-run are tested in staging.
- [ ] Job search pagination, saved jobs, recruiter/company/candidate lists and edits return consistent counts. Job expiration and edits invalidate appropriate Redis results without costly key scans.
- [ ] With multiple servers, Socket.IO Redis adapter emits to the intended user and conversation; reconnection and independent browser tabs behave correctly. In a single instance, adapter off and realtime still works.
- [ ] Stripe webhook signature, idempotency, billing, email/password login and token rotation tests from Phase 1 still pass; no sensitive secrets are logged or deployed to frontend.
- [ ] App builds, accessibility checks, file upload retries, network throttling, rate limits, malformed uploads and mobile E2E flows pass in your *real* environment.

**Operational caveats:** A magic-byte check does not replace antivirus/document malware scanning (especially DOCX). Add a malware scanner/quarantine workflow before accepting untrusted office documents in a security-sensitive production deployment. Set R2 object lifecycle cleanup of abandoned/unconfirmed uploads and monitor storage usage, access logs and rate limiting. Revoke R2 credentials if exposed. This patch does not claim that live endpoints or production builds have been tested in this sandbox.
