# JobHub Phase 6 - Backend release and rollback runbook

**Scope:** QA IDs S-06, S-08, S-12, R-17, plus regression evidence for all 37 IDs from `jobhub-qa-report-18-nov-2026.pdf`. This patch is **incremental to Phases 1-5**; it contains changed files only, not a complete deployable repository. Apply using the repository root as the merge destination.

## What changed

- Reuse the existing `GET /api/v1/job` for similar jobs. No new public endpoint.
- Existing `POST /api/v1/saved-jobs` is idempotent under retries/parallel tabs, with the existing unique index and public-job authorization.
- `GET /api/v1/job/:id` populates real company industry, URL, location, verification status. The UI no longer invents a verified brand or website.
- Reject newly published `$0-$0` ranges with an **inline salaryMax validation error**; existing zero-valued salaries render as **Salary not specified** pending approved data cleanup.
- A read-only-by-default legacy data audit finds `Echnical Project Manager`, `Vecgtor`, negative and zero salaries. Only unambiguous fixes can be applied with **opt-in + validated backup checksum**; ambiguous names require human review.
- The 37-case `qa/phase6-regression-matrix.json` and `qa/phase6-evidence.template.json` are acceptance tracking documents. No case is marked passed without actual evidence.
- Hardened backup, restore and job-data repair tooling streams checksums rather than reading whole archives into RAM.
- CI workflow lives under `.github/workflows/phase6-ci.yml`. No new authentication, jobs, billing or storage API routes.

## 1. Safely apply

1. Start from repository versions that already include ALL Phase 1-5 patches, using both frontend and backend of the same build.
2. Snapshot current Git SHA, database schema/indexes, Redis key version and live worker deployments. Keep credentials outside source control.
3. Merge **only** the file paths from this archive, preserving `src/`, `scripts/`, `tests/`, `qa/`, and `.github/` structure. Never replace a repository with this archive alone.
4. Run in isolated staging first. Staging must use separate Stripe test-mode keys, MongoDB DB, R2 buckets, Redis namespace, mail sending identity, domains and dedicated seeker/recruiter test accounts.

## 2. Dependency checks, build and offline regression

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
pnpm phase6:source-audit
pnpm phase6:regression
pnpm phase6:offline-test
pnpm phase6:unit-check
```

**Pass conditions:** all commands return status 0 and no tests are failed. A source parser or static assertion does not replace a TypeScript compile or runtime test. The backend `tests/phase6-validation.test.cjs` depends on compiled `dist/`, therefore run it **after** `pnpm build`.

## 3. Backup, restore and indexes (staging rehearsal first)

The existing backup helper needs `mongodump` on PATH. Never print connection strings. Put archives and receipts in protected storage.

```bash
PHASE6_BACKUP_APPROVED=YES PHASE6_BACKUP_DIR=/secure/backups \
  DATABASE_URL="$STAGING_DATABASE_URL" pnpm phase6:backup -- --backup
```

A successful backup produces `jobhub-TIMESTAMP.archive.gz` and a sibling `.archive.gz.sha256` receipt. Verify archive integrity and restore into an **isolated** namespace (never the source database):

```bash
PHASE6_RESTORE_ARCHIVE=/secure/backups/jobhub-TIMESTAMP.archive.gz \
PHASE6_SOURCE_DB=jobhub_staging PHASE6_DRILL_DB=jobhub_restore_verify01 \
PHASE6_DRILL_DATABASE_URL="$ISOLATED_RESTORE_MONGO_URL" \
  pnpm phase6:restore-drill -- --restore
```

Use `PHASE6_RESTORE_APPROVED=YES` to enable the restore operation. Without this variable the command must refuse mutation. Verify collection counts and key read paths after restore. **Never point the drill URI at production.**

Indexes are preview-only by default. After approval (and backup):

```bash
DATABASE_URL="$STAGING_DATABASE_URL" pnpm phase6:indexes
PHASE6_INDEXES_APPROVED=YES DATABASE_URL="$STAGING_DATABASE_URL" pnpm phase6:indexes -- --apply
```

Review duplicate-key warnings and the company's transaction-supporting MongoDB replica set. Do not drop data or indexes as an automated fix.

## 4. Job data-quality audit (S-12)

```bash
DATABASE_URL="$STAGING_DATABASE_URL" PHASE6_AUDIT_DIR=/secure/audits \
  pnpm phase6:job-data-audit
```

This is **read-only**. Inspect `*.jsonl` plus summary. `Vecgtor` and any unfamiliar company/title spelling are **manual-review only**. When unambiguous fixes are approved and the backup checksum is verified:

```bash
PHASE6_DATA_FIX_APPROVED=YES PHASE6_BACKUP_RECEIPT=/secure/backups/jobhub-TIMESTAMP.archive.gz.sha256 \
DATABASE_URL="$STAGING_DATABASE_URL" PHASE6_AUDIT_DIR=/secure/audits \
  pnpm phase6:job-data-audit -- --apply
```

Job corrections use compare-and-set, so changes made by an active recruiter are not overwritten. After approved corrections, increment the `jobhub:search:version` Redis key or wait for documented cache expiry, and recheck public search and dashboards. Preserve before/after audit records for rollback. Run the same audited sequence in production **only after staging passes** and a production backup is verified.

## 5. Staging API, authenticated browser and infrastructure checks

```bash
PHASE6_STAGING_URL=https://staging-api.example.com pnpm phase6:api-smoke
PHASE6_STAGING_URL=https://staging-api.example.com pnpm exec node scripts/phase6-performance.cjs
```

For authenticated API smoke, supply **only isolated staging** credentials in `PHASE6_STAGING_ADMIN_TOKEN`, `PHASE6_STAGING_RECRUITER_TOKEN` and `PHASE6_STAGING_SEEKER_TOKEN`. The `phase6:api-smoke` script deliberately skips fixtures it lacks. **A skipped test is not verified evidence.**

The optional **mutating** publishing smoke must run only with an empty-quota staging recruiter and never against production:

```bash
PHASE6_MUTATION_APPROVED=YES PHASE6_ISOLATED_TENANT=YES \
PHASE6_STAGING_URL=https://staging-api.example.com \
PHASE6_STAGING_RECRUITER_TOKEN="$ISOLATED_RECRUITER_TOKEN" \
  pnpm phase6:isolated-publish-test
```

This creates a disposable draft, edits and publishes it, checks public search, and archives it. The script attempts cleanup even if assertions fail; review staging for leftovers after any interruption. Staging hosts must be visibly named `staging`, `stage`, `qa`, or `test` and use HTTPS.

Also verify, with dedicated fixtures: fresh signup and verification email, password reset, 30-minute session retention, R2 upload/preview/private resume authorization, company logo and banners, recruiter counts and quota locks, ATS stage history, interview time zones and notifications, team invitation acceptance/revocation, follow alerts, Stripe test-mode checkout + webhook fulfillment/refund, database indexes, Redis cache invalidation, mail worker and scheduled jobs.

## 6. Mandatory 37-ID evidence gate

1. Copy `qa/phase6-evidence.template.json` to a secure, untracked location.
2. Set staging environment identity, **deployed frontend and backend Git commit SHAs**, and actual `verifiedAt` time.
3. Record each QA ID as `passed` **only after executing its test** and attaching an evidence reference (e.g. `https://...`, `artifact:...`, `run:...`, `s3://...`, or `gs://...`). Include a concise note; do not put access tokens, PII, payment details or CVs in logs.
4. Run `node scripts/phase6-evidence-gate.cjs /secure/qa/staging-evidence.json`. It **must exit nonzero** if any ID is missing, failed or unverifiable. `ELIGIBLE_FOR_FINAL_REVIEW` is not automatic production approval.
5. Obtain QA and security signoff, confirm no open Critical/High defects, restore-drill evidence, and deployment-version parity. Only then enable release.

The default evidence template deliberately fails the release gate, including all 5 Critical and 16 High IDs.

## 7. Rollout and rollback

Roll out backend and frontend together; use gradual traffic if supported. Verify `/readyz` plus job searches, auth refresh, recruiter billing, Stripe webhook, email queue and R2 after each step. Keep production Stripe charges disabled until test-mode E2E and reversals pass. Ensure worker/scheduler deploy uses the same source SHA and shared Redis namespace.

On a regression: halt rollout; disable new checkout if payment handling is affected; restore last known good *code* deployment (frontend, backend, workers together). Preserve diagnostic IDs and data, do not automatically restore a database over live user changes. Restore data only from a verified archive after a documented recovery decision and an isolated restore rehearsal. Run the QA smoke again after rollback. Never silently reset plan quotas, delete user data, or expose private resumes.

## Verification honesty

Static and local unit tests can pass without a live service. **This ZIP cannot certify a 30-minute session, a real R2 browser upload, a Stripe webhook or all 37 QA cases by itself.** Those are explicit staging release gates, not assumed successes.
