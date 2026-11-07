# Phase 3 — Changed/new files only

This ZIP must be overlaid on the completed **Phase 1 and Phase 2** JobHub repository. **R2 presigned upload/confirm/access, private ACL, legacy migration/rollback, MongoDB search indexes, Redis cache versioning, Socket.IO Redis adapter, and scripts.**

New files (excluding this manifest): **10**. Modified files: **26**. Files to delete: **0**.

## File manifest

| Status | Path |
|---|---|
| MODIFIED | `backends/.env.example` |
| NEW | `backends/PHASE3_API_CONTRACTS.md` |
| NEW | `backends/PHASE3_R2_RELEASE.md` |
| MODIFIED | `backends/package.json` |
| NEW | `backends/scripts/phase3-build-indexes.cjs` |
| NEW | `backends/scripts/phase3-live-smoke.cjs` |
| NEW | `backends/scripts/phase3-migrate-media.cjs` |
| NEW | `backends/scripts/phase3-rollback-media.cjs` |
| NEW | `backends/scripts/phase3-static-check.cjs` |
| MODIFIED | `backends/src/config/ENV.ts` |
| MODIFIED | `backends/src/config/redis.ts` |
| MODIFIED | `backends/src/config/socketio.ts` |
| MODIFIED | `backends/src/domains/Applications/application.model.ts` |
| MODIFIED | `backends/src/domains/Applications/application.services.ts` |
| MODIFIED | `backends/src/domains/Applications/application.validation.ts` |
| MODIFIED | `backends/src/domains/Asset/asset.controller.ts` |
| NEW | `backends/src/domains/Asset/asset.model.ts` |
| MODIFIED | `backends/src/domains/Asset/asset.route.ts` |
| NEW | `backends/src/domains/Asset/asset.services.ts` |
| NEW | `backends/src/domains/Asset/asset.storage.ts` |
| MODIFIED | `backends/src/domains/Company/company.model.ts` |
| MODIFIED | `backends/src/domains/Company/company.route.ts` |
| MODIFIED | `backends/src/domains/Company/company.services.ts` |
| MODIFIED | `backends/src/domains/Company/company.validation.ts` |
| MODIFIED | `backends/src/domains/Jobs/job.model.ts` |
| MODIFIED | `backends/src/domains/Jobs/job.services.ts` |
| MODIFIED | `backends/src/domains/Messages/message.model.ts` |
| MODIFIED | `backends/src/domains/Messages/message.services.ts` |
| MODIFIED | `backends/src/domains/SavedJobs/savedjob.services.ts` |
| MODIFIED | `backends/src/domains/Seeker/seeker.model.ts` |
| MODIFIED | `backends/src/domains/Seeker/seeker.services.ts` |
| MODIFIED | `backends/src/domains/Seeker/seeker.validation.ts` |
| MODIFIED | `backends/src/domains/User/user.model.ts` |
| MODIFIED | `backends/src/domains/User/user.route.ts` |
| MODIFIED | `backends/src/domains/User/user.services.ts` |
| MODIFIED | `backends/src/middlewares/fileUpload.middleware.ts` |

## Deleted paths

**NONE**

## Deployment conditions

- Read `backends/PHASE3_R2_RELEASE.md` and `backends/PHASE3_API_CONTRACTS.md`.
- The uploaded baseline `pnpm-lock.yaml` has **not** been regenerated because the npm registry is not available in this environment. After overlay, run `pnpm install --no-frozen-lockfile` in a connected development environment, review/commit the refreshed backend lockfile, then use frozen installs in CI.
- Run `pnpm exec tsc -p tsconfig.json --noEmit`, `pnpm run build`, `pnpm run phase3:static-check` and the staging tests before release.
- R2 public and private buckets, credentials, CORS policies, scanned private uploads, Redis and MongoDB must be configured before production.

## Offline verification performed

- TypeScript/TSX parser check: **287 parsed files, 0 syntax parse errors**.
- Local import resolver check: **723 imports, 0 missing paths**.
- Backend Phase 3 source guardrails: **15/15 pass**.
- Phase 3 CLI Node syntax checks: **pass**.
- **Not** verified: full Next.js/backend compilation, deployed R2, Redis and MongoDB operations, browser CORS, Stripe E2E, external services. Run all release checks with dependencies/services configured.
