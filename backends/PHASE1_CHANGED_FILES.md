# Phase 1 — backends changed-files manifest

This archive is an **overlay**: extract/copy its contents into the root of the existing `job-hub-master` project, preserving directories. Files not listed here are not included.

Original files replaced or added: **63** plus this manifest.

## Included files

- `backends/.env.example` — UPDATED
- `backends/PHASE1_API_CONTRACTS.md` — NEW
- `backends/PHASE1_SECURITY_RELEASE.md` — NEW
- `backends/scripts/phase1-build-indexes.cjs` — NEW
- `backends/scripts/phase1-data-preflight.cjs` — NEW
- `backends/scripts/phase1-static-security-check.cjs` — NEW
- `backends/src/config/cors.ts` — NEW
- `backends/src/config/redis.ts` — UPDATED
- `backends/src/config/socketio.ts` — UPDATED
- `backends/src/domains/Applications/application.controller.ts` — UPDATED
- `backends/src/domains/Applications/application.model.ts` — UPDATED
- `backends/src/domains/Applications/application.route.ts` — UPDATED
- `backends/src/domains/Applications/application.services.ts` — UPDATED
- `backends/src/domains/Applications/application.validation.ts` — NEW
- `backends/src/domains/Asset/asset.route.ts` — UPDATED
- `backends/src/domains/Auth/auth.controller.ts` — UPDATED
- `backends/src/domains/Auth/auth.route.ts` — UPDATED
- `backends/src/domains/Auth/auth.service.ts` — UPDATED
- `backends/src/domains/Auth/auth.session.model.ts` — NEW
- `backends/src/domains/Auth/auth.token.services.ts` — UPDATED
- `backends/src/domains/Auth/auth.validation.ts` — UPDATED
- `backends/src/domains/Company/company.model.ts` — UPDATED
- `backends/src/domains/Company/company.route.ts` — UPDATED
- `backends/src/domains/Company/company.services.ts` — UPDATED
- `backends/src/domains/Conversations/conversations.controller.ts` — UPDATED
- `backends/src/domains/Conversations/conversations.model.ts` — UPDATED
- `backends/src/domains/Conversations/conversations.services.ts` — UPDATED
- `backends/src/domains/Generals/general.route.ts` — UPDATED
- `backends/src/domains/Generals/general.services.ts` — UPDATED
- `backends/src/domains/Interviews/interviews.controller.ts` — UPDATED
- `backends/src/domains/Interviews/interviews.route.ts` — UPDATED
- `backends/src/domains/Interviews/interviews.services.ts` — UPDATED
- `backends/src/domains/Interviews/interviews.validation.ts` — NEW
- `backends/src/domains/Jobs/job.controller.ts` — UPDATED
- `backends/src/domains/Jobs/job.model.ts` — UPDATED
- `backends/src/domains/Jobs/job.route.ts` — UPDATED
- `backends/src/domains/Jobs/job.services.ts` — UPDATED
- `backends/src/domains/Jobs/job.validation.ts` — UPDATED
- `backends/src/domains/Messages/message.controller.ts` — UPDATED
- `backends/src/domains/Messages/message.services.ts` — UPDATED
- `backends/src/domains/SavedJobs/savedjob.model.ts` — UPDATED
- `backends/src/domains/SavedJobs/savedjob.route.ts` — UPDATED
- `backends/src/domains/SavedJobs/savedjob.services.ts` — UPDATED
- `backends/src/domains/Seeker/seeker.controller.ts` — UPDATED
- `backends/src/domains/Seeker/seeker.model.ts` — UPDATED
- `backends/src/domains/Seeker/seeker.route.ts` — UPDATED
- `backends/src/domains/Seeker/seeker.services.ts` — UPDATED
- `backends/src/domains/Seeker/seeker.validation.ts` — UPDATED
- `backends/src/domains/Stripe/stripe.controller.ts` — UPDATED
- `backends/src/domains/Stripe/stripe.route.ts` — UPDATED
- `backends/src/domains/User/user.controller.ts` — UPDATED
- `backends/src/domains/User/user.model.ts` — UPDATED
- `backends/src/domains/User/user.services.ts` — UPDATED
- `backends/src/domains/User/user.validation.ts` — UPDATED
- `backends/src/index.ts` — UPDATED
- `backends/src/lib/query.ts` — NEW
- `backends/src/middlewares/auth.middleware.ts` — UPDATED
- `backends/src/middlewares/rateLimit.middleware.ts` — NEW
- `backends/src/middlewares/requireTrustedOrigin.ts` — NEW
- `backends/src/middlewares/validation.middleware.ts` — UPDATED
- `backends/src/server.ts` — UPDATED
- `backends/src/types/protected-request.d.ts` — UPDATED
- `backends/src/types/types.ts` — UPDATED

## Deleted files

**NONE** — no existing source files are deleted by Phase 1.

## Deployment notes

- Follow `backends/PHASE1_SECURITY_RELEASE.md` and `backends/PHASE1_API_CONTRACTS.md` before starting the server.
- Run the read-only database duplicate-index preflight before applying unique MongoDB indexes.
- Configure distinct JWT and JWT refresh secrets, the exact FRONTEND_URL origins, Stripe webhook signing secret, and current Redis/MongoDB/SMTP/Cloudinary variables.
- Do not delete Cloudinary assets yet; Cloudflare R2 migration belongs to Phase 3.
- Existing users will need to log in again due to the new session/token format.
- The original project ROOT README includes demo credentials: remove them manually if publishing, and rotate any credentials that remain active.

### Verification limits

Offline TypeScript syntax parsing and 21 backend source-level assertions passed. Full dependency-based typechecking, builds, MongoDB tests, Stripe webhooks, and browser E2E tests were **not executed** in the packaging environment and must be completed in staging.
