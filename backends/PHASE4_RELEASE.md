# JobHub Phase 4 — Release and rollback guide

## Baseline and scope

Apply **after Phase 1, Phase 2 and Phase 3**. These ZIPs contain only Phase 4 new/modified files, not the full repository. Back up the entire working tree and MongoDB **before** overlaying. Paths within the ZIPs start with `backends/` and `front-end/`.

Phase 4 keeps Redis, Stripe, Cloudflare R2, existing JWT/auth sessions, Socket.IO, and existing jobs/applications/interviews routes. It introduces company memberships, career pages, a draft/scheduled publication state, a consolidated ATS command route, offers, saved searches, an opt-in private candidate profile, and assigned interview scorecards. Do **not** delete legacy collections or Cloudinary references. No intentionally deleted files.

## Run order (from repository root)

1. Make a backup of the frontend, backend, and MongoDB and ensure Phase 3 deployment is stable.
2. Overlay ZIP contents preserving folder structure. **No Phase 1/2/3 files should be removed.**
3. From `backends/`: `pnpm install --frozen-lockfile` (or `pnpm install` if no usable lockfile is present), `pnpm exec tsc -p tsconfig.json --noEmit`, `pnpm run build`.
4. Read-only dry checks: `pnpm run phase4:static-check`, `pnpm run phase4:preflight`, `pnpm run phase4:indexes` (preview mode).
5. Verify unique slugs and membership index data; on backup-verified staging only: set `PHASE4_CONFIRM_INDEXES=YES` and run `pnpm run phase4:indexes -- --apply`. Index build is **additive**: it does NOT delete existing indexes. Index creation can fail when historical duplicates exist; resolve explicitly rather than forcefully deleting data.
6. From `front-end/`: `pnpm install --frozen-lockfile`, `pnpm exec tsc --noEmit`, `pnpm lint` if script exists, `pnpm build`.
7. Configure one scheduled **one-off process** (not an HTTP endpoint) to run `pnpm run phase4:scheduler` every 5 minutes, with the backend's existing DATABASE_URL/Redis env vars. Do **not** start multiple overlapping schedule runs without verifying idempotency. It publishes due jobs and creates in-app alerts. An external scheduler (Cloud Scheduler / cron job) must be connected. Optional: instrument alerts and publication results for monitoring.
8. Deploy the backend to staging, then the frontend. Validate API, candidate privacy, job visibility, team scopes, notifications and live R2 private resumes. Only promote after all gates pass.

## API compatibility / behavior changes

- Existing routes are retained. New endpoints: `GET/POST /api/v1/recruiter-company/team`, `PATCH /api/v1/recruiter-company/team/:id`, `POST /api/v1/recruiter-company/verification-request`, `PATCH /api/v1/recruiter-company/:id/verification` (platform admin), `GET /api/v1/recruiter-company/careers/:slug`, `GET /api/v1/job/mine`, `PATCH /api/v1/applications/:id`, `PATCH /api/v1/interviews/:id/scorecard`, and `GET/POST /api/v1/saved-jobs/searches`, `PATCH/DELETE /api/v1/saved-jobs/searches/:id`. Exact mounted paths should be verified against backend main route mounts in staging.
- Public job discovery hides draft/scheduled/closed jobs; legacy job records missing `status` remain available if `isActive` and not expired. Draft publication validates all required fields. Scheduled jobs require a worker, otherwise remain unpublished.
- Candidates can be invited only by signed-in verified recruiter accounts. Invites are keyed to email; if outgoing email fails, the invite remains visible to the recipient on `recruiter/team` after login. Invitations are not auto-accepted.
- Recruiter roles: company owner/admin and recruiter manage jobs/applications; interviewer scores **assigned** interviews and cannot browse the company job-edit workspace. Admin review is restricted to platform `admin` role.
- Candidates must explicitly opt in to public search; legacy candidate profiles remain non-discoverable until consent given. Existing private resumes in R2 retain ownership checks.
- Existing applicant statuses and historical jobs remain readable. Old status routes work; new ATS actions are `stage`, `note`, `offer`, `offer-response`. Candidate-facing application responses exclude private internal notes and stage-history notes.

## Staging test gates (all must pass)

1. Register a new recruiter, create company, invite second recruiter and interviewer; confirm email-specific acceptance and refusal of a wrong-account invite.
2. Create draft, close/reopen published job, schedule future publication, run the scheduler and verify the job is publicly visible only after due time.
3. From a different company attempt team edit, job edit/delete, viewing applicant list, sending an offer, scheduling an interview and reading R2 resume. All must fail.
4. Apply as seeker using R2 resume; confirm application only once; ensure internal notes are invisible to seeker and visible to authorized company recruiting team.
5. Complete screening → shortlist → interview, assign a **different** active interviewer, save private scorecard, send offer, accept/decline, hire, and verify correct notifications.
6. Withdraw as candidate; verify status history and that recruiter cannot alter a withdrawn application.
7. Create saved search and enable alerts; publish a new matching job; verify scheduler in-app alert and no duplicate on immediately repeated scheduler runs.
8. Confirm private/public candidate privacy across direct profile endpoints, search results and resume access.
9. Test mobile/desktop navigation, empty/error/loading states, metadata of branded career pages, and full frontend/back builds.
10. Verify PostgreSQL is **not** introduced: MongoDB/Redis/Stripe/R2 integration, backup restore, and deployment rollback are intact.

## Rollback

- Switch scheduler off first. Revert Phase 4 application code using the pre-overlay backup; do not drop new collections/indexes or delete saved-search/team/ATS records. Phase 3 code ignores additive Phase 4 fields, but a job with `status=scheduled` remains unpublished under Phase 3's `isActive` guard until re-enabled. Do not modify such jobs manually without operator review.
- Restore MongoDB from backup only when compatibility requires it and business data recovery is agreed. Run a point-in-time recovery drill, never an untested destructive rollback.

## Verification limits for this package

Static checks, TS/TSX parsing and local import resolution are source-only checks. Full runtime typechecking, build, MongoDB integration, private-R2 validation, and browser E2E require dependencies and configured services; **they are not validated by those source checks**. Also implement and test antivirus/document scanning for private DOCX/PDF before claiming high-assurance production readiness (R2 byte-signature checks alone are not malware protection).
