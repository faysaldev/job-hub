# JobHub Phase 6 — client changes and verification

Apply the contents of this Phase 6 frontend ZIP **on top of Phases 1–5**. The ZIP retains the original `front-end/` root and contains no previous-phase files unless they were edited for this phase.

## New screens

- `/admin`: accessible, responsive Super Admin console, visible only to the global `admin` role, with overview, company verification, job moderation, user suspensions, abuse reports, support requests, subscription/invoice lists, read-only Stripe comparison, failed-webhook retry, and audit history. `/admin/plans` remains the Phase 5 versioned plan editor.
- `/recruiter/analytics`: company-scoped recruitment funnel, daily applications and promotion record counts, with honest caveats that impression/click/causal conversion metrics are not instrumented.
- Public job details: report-abusive-listing flow for authenticated candidates/recruiters.

## API footprint

The frontend uses one RTK Query feature slice for the five Phase 6 operations endpoints. Overview, record list and recruiter analytics are consolidated rather than requesting one API per card or tab. Existing Phase 1–5 data fetching and auth/refresh flows stay unchanged.

## Required frontend install & tests

```bash
cd front-end
corepack enable
pnpm install --no-frozen-lockfile  # New Playwright/axe dev dependencies; regenerate + commit lockfile once
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm exec playwright install chromium
# Start frontend/backend in staging mode, then:
PHASE6_WEB_URL=http://localhost:3000 pnpm test:e2e
```

Use `pnpm install --frozen-lockfile` in CI **after** the generated lockfile has been checked in. Browser E2E tests cover the public home/search, private admin gating, nonindex metadata, keyboard focus, responsive width and axe WCAG serious/critical accessibility issues on both desktop and mobile Chrome.

Check admin on mobile and desktop at 375/768/1440px. Verify the user cannot see a different company's analytics. Confirm company/admin plan management still navigates back to operations. Verify R2 image/resume downloads and Stripe Checkout remain functional in staging, not with live customers.

The browser test suite was **authored but not executed** in the patching environment because the project's node_modules and running services were unavailable. See `backends/PHASE6_RELEASE.md` and `backends/PHASE6_CROSS_PHASE_AUDIT.md` for the full release gate and known gaps.

**Files to delete: NONE.**
