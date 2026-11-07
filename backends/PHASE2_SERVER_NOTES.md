# JobHub Phase 2 — Backend Patch (apply after Phase 1)

## Scope

UI/UX is frontend-heavy. This backend patch intentionally avoids broad API rewrites and preserves Phase 1 security, Redis, Stripe, Cloudinary and database schemas.

- Added **one** new public read endpoint: `GET /api/v1/generals/discovery`.
- Output is the existing success envelope with `data: { categoryStats: CategoryStat[], topJobs: JobCard[] }`.
- Discovery jobs come from one bounded, recent-open-jobs query rather than the existing multi-step all-applications ranking aggregate. They have `author`, company name/logo, job title, type, location and salary fields needed for the new homepage. Public responses have a short cache-control header.
- `GET /api/v1/job` is the canonical filtered + paginated job search. `GET /api/v1/job/search` is retained as an alias to the same handler, not a second implementation.
- Old `/generals/top-jobs`, `/generals/category-stats`, and `/generals/subcategory-stats` remain for existing clients. Nothing requiring client re-registration has been removed.
- Query shape and ownership restrictions from Phase 1 are preserved. The backend source remains a modular Express monolith and no new infrastructure dependencies were added.

## Install order and commands

Overlay the backend archive on the **Phase 1** repository root, along with the Phase 2 frontend archive.

```bash
cd backends
corepack enable
pnpm install --frozen-lockfile
pnpm exec tsc -p tsconfig.json --noEmit
pnpm build
pnpm dev
```

## Smoke tests (run with a configured API and database)

```bash
curl -fsS 'http://localhost:3001/api/v1/generals/discovery'
curl -fsS 'http://localhost:3001/api/v1/job?limit=10&page=1'
curl -fsS 'http://localhost:3001/api/v1/job/search?limit=10&page=1'
```

Verify response envelopes and pagination, compare the canonical and alias responses, and test updated job records to confirm Redis invalidation and frontend refresh. Repeat Phase 1 auth/authorization and Stripe webhook integration tests; this patch is **not** a substitute for them.

## No removals

**Delete: NONE**. No environment secrets, schemas, package dependencies, Redis keys or customer data are deliberately removed.

## Release caveat

Syntax checks and API contract inspection were completed. Package installation, live build, MongoDB/Redis tests and payment flow checks were unavailable in the isolated environment. Production readiness requires full staging verification.
