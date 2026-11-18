# JobHub Phase 2 - Backend Deployment & Acceptance

Apply this ZIP **on top of the original backend AND the Phase 1 backend patch**. The ZIP contains only changed/new Phase 2 files. Do not replace your database with any dump or seed fixture. This release reuses the existing `/api/v1/job`, `/api/v1/job/:jobId`, `/api/v1/job/mine`, `/api/v1/generals/discovery`, and `/api/v1/billing/dashboard` routes. No new public endpoints are introduced.

## Canonical job policy

- `draft`: private, neither searchable nor quota-reserved. Incomplete fields allowed.
- `scheduled`: private until the scheduler publishes it. Reserves one active job slot if unexpired and not blocked or archived.
- `published`: publicly discoverable **only** while `isActive=true`, unexpired, not blocked, and not archived. Reserves one slot while eligible.
- `closed`: private, no slot reserved, application history retained. A reopened listing must have a future deadline and available capacity.
- `expired`: determined from `applicationDeadline <= now` (without modifying historical status). Private and no longer reserves quota.
- `blocked`: platform moderation takes priority over any other status. Private and no longer reserves quota.
- `archived`: existing DELETE route now soft-archives (`isDeleted=true`, `status=closed`, `isActive=false`) and keeps applications/history intact.
- Legacy published records with missing `status` are recognized while `isActive=true`. The old `author` owner relationship and newer `companyId` relationship remain supported.

**Naming:** `activeJobs` in the existing billing/analytics API now means **reserved published + scheduled slots**. `openJobs` means published, eligible, and currently accepting applications. `publishedJobs` means historical non-archived published listings (including expired ones). These are deliberately different metrics and the frontend labels them explicitly.

## Release order

1. Back up the live MongoDB database and verify rollback from a staging environment. Confirm MongoDB transactions work (replica set/Atlas, majority write concern). **Do not** deploy a stand-alone MongoDB without transaction support; concurrent plan-quota enforcement uses `withTransaction`.
2. Install dependencies using the repo's existing lockfile, e.g. `pnpm install --frozen-lockfile`. Then run `pnpm typecheck`, `pnpm build`, `pnpm phase2:check`, and `node scripts/phase6-source-audit.cjs`.
3. Review additive index definitions before creating them: `node scripts/phase4-build-indexes.cjs` (dry preview). With a maintenance window/backup and DB approval: `PHASE4_CONFIRM_INDEXES=YES node scripts/phase4-build-indexes.cjs --apply`. This creates indexes defined in `job.model.ts`; it does **not** drop indexes or modify data.
4. Run `pnpm phase2:reconcile` with **DATABASE_URL** configured. This defaults to a **read-only audit** and writes `phase2-reconciliation-<timestamp>.json` to the current directory. It reads the current published Free-plan limit (falling back to 1), active subscriptions, and affected company job totals.
5. Review over-limit accounts and communicate the grandfathering rule: **existing published and scheduled listings are preserved**, but no additional job slot can be reserved while usage is at/above the customer's limit. No batch unpublication is performed.
6. Optional legacy status normalization **only after backup and review**: `node scripts/phase2-reconcile-jobs.cjs --apply --acknowledge`. It writes `status:published` only for active, unexpired legacy records currently missing a status. It never removes/archives jobs. Do not run against production without an approved change record.
7. Deploy the backend with Phase 1's email worker and existing `/dist/scripts/phase4-scheduler.js` as a recurring **one-off background job every 5 minutes**. Scheduled postings do not publish automatically without that worker. Confirm your deployed front-end and back-end versions match.
8. Verify Redis cache version invalidation after create, publish, edit, close, archive, and scheduled publication. The search cache has a maximum 30-second lifetime and must not expose expired jobs.

## Existing API contracts

- `POST /job` with `{title,status:'draft'}` creates a draft. With `status:'published'`, the payload must contain all publishable fields, and it must pass the plan limit.
- `PUT /job/:jobId` accepts only changed fields. Set `status:'draft'` on a currently published/scheduled job to store **private `pendingDraft` changes**, without mutating the visible listing. Submit `status:'published'` to apply and validate the draft.
- `PUT /job/:jobId` with `status:'closed'` closes; with `status:'scheduled'` and future `publishAt` schedules. `DELETE /job/:jobId` archives non-destructively.
- `GET /job` returns `{jobs,pagination,facets:{categories,subcategories}}`. `locationType=remote` is structural, and `location=Remote` is supported for older clients. `salaryRanges` supports named frontend IDs plus previous numeric min-max values. Applicant-count filters run only when selected.
- Errors include `{message,errors:[{field,message}]}` and HTTP 422 for completed-job field failures. 403 plan-capacity errors also include the `status` field.
- `GET /job/mine` includes `{jobs,pagination,overview}`. Each item has `hasDraftChanges` and `expired`, and the overview separates `quotaUsed`, `quotaLimit`, `overLimit`, `openJobs`, `scheduledJobs`, and `publishedJobs`.

## Staging sign-off (must pass before claiming production-ready)

- Create a fresh recruiter + company; publish first valid job on a 1-slot Free plan; verify it appears on `/job` and the first homepage discovery page.
- Reopen and edit that job. Save a private draft; the public job must remain unchanged. Reload the editor and verify edits persist. Publish the staged draft; the public listing updates.
- Attempt a second concurrent publication. Verify an explicit `status` quota error and unchanged first listing. With two simultaneous submissions, no duplicate slot reservations.
- Close and reopen with a future deadline; verify quota release and reacquisition. Archive and verify `isDeleted=true`, listing removed from public search, while applications remain stored.
- Verify remote filtering, salary ranges, category/subcategory aggregates, pagination, and posted-date filters with real jobs. Confirm the homepage discovery is the same leading ordered subset of the `/job` results.
- Verify dashboard `openJobs`, `publishedJobs`, `scheduledJobs` and billing `activeJobs` against direct MongoDB counts, especially for already-over-limit companies and expired posts.
- Run the scheduler against a due scheduled job, and verify exactly one publication transition and search-cache refresh.
- Re-run the QA report's R-01, R-02, R-03, R-04, R-06, R-07, R-15, R-16, R-18, R-19, R-20, S-03, S-04, and S-05 scenarios.

## Local verification limitations

This patch was reviewed with static source/import checks and isolated lifecycle tests. No network access to install project dependencies, nor a live MongoDB/Redis/staging environment, was available in the packaging session. Full TypeScript typechecking, production builds, database migration, and browser E2E verification **must be run after dependency installation**, and the release should not be marked production-ready until those pass.
