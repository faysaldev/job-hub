# JobHub Phase 6 - Frontend integration and staging QA

**Apply on top of Phase 5**, retaining all earlier patches. This archive contains **changed/new files only**, not a full standalone frontend. Preserve paths when overlaying into the frontend repository.

## Improvements

- Similar jobs are ranked from the existing `GET /api/v1/job` search, excluding the current posting; helpful empty/error fallback; **no additional API endpoint**.
- Job detail and Apply modal use persisted `saved-job-ids` and `applied-job-ids`, not uninitialized Redux arrays. Saved state persists after reload, and applied jobs disable duplicate application controls.
- Salary labels use a single helper; unknown/zero-to-zero salary never becomes `$0-$0`.
- Job cards use accessible actual links instead of a nested pseudo-link, with keyboard focus.
- Candidate listing renders inside its existing layout, avoiding duplicate site header/footer. Failure screens show retry rather than converting temporary network errors into 404.
- Role-authenticated desktop/mobile Playwright smoke and axe checks are provided. Fixture secrets never belong in the repository.

## Local checks

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm phase6:check
node --test tests/phase1-session.test.cjs tests/phase2-wizard-static.test.cjs tests/phase3-assets.test.cjs tests/phase4-checkout.test.cjs
pnpm typecheck
pnpm lint
pnpm build
```

For local Playwright without an external frontend, first build and then run `pnpm exec playwright install chromium` followed by `pnpm test:e2e` (the config starts Next on port 3005). This requires an accessible staging backend in frontend configuration. Do not mistake an empty UI with unreachable APIs for success.

## Secure staging browser run

Staging must use an **isolated** seeded seeker and recruiter company, each with approved test data. Set these values in environment secrets, not in files or Git:

```text
PHASE6_WEB_URL=https://staging-web.example.com
PHASE6_E2E_SEEKER_EMAIL=<isolated test seeker>
PHASE6_E2E_SEEKER_PASSWORD=<isolated password>
PHASE6_E2E_RECRUITER_EMAIL=<isolated test recruiter>
PHASE6_E2E_RECRUITER_PASSWORD=<isolated password>
PHASE6_E2E_PUBLIC_JOB_ID=<real public staging job>
PHASE6_E2E_SAVED_JOB_ID=<job already saved by test seeker>
PHASE6_E2E_APPLIED_JOB_ID=<job already applied to by test seeker>
```

Then execute `pnpm exec playwright test --reporter=list` in desktop and mobile Chromium. The `workflow_dispatch` CI staging job **refuses to start** if required fixtures are missing. Other Playwright tests can skip in local development; **skipped cases do not count toward release acceptance**.

## Manual QA that requires real external systems

- Fresh seeker and recruiter sign-up, verification, session reload/direct links, password reset and 30-minute session stability.
- Create and publish first job under Free quota; validate exact failing fields; edit saved draft; archive; verify search and count agreement.
- Upload seeker photo/PDF/DOCX, company logo and job banner through real R2 and inspect private access denied to outsiders.
- Stripe test checkout, webhook-verified highlighted badge (seeker/recruiter), cancellation, repeat checkout, refund and entitlement reversal.
- Team invite email, available upgrade plans, seat restrictions, invitation role authorization and removal.
- ATS review/shortlist/reject/offer, interview creation/rescheduling/time zones, follower alerts and legacy notification redirects.
- Test on mobile with keyboard, reduced motion, empty/error/loading UI, no duplicate shells, no inaccessible controls.

Use backend `qa/phase6-regression-matrix.json` as the definitive 37-ID checklist. Store fresh evidence with actual staging deployment SHAs and use the **backend** evidence gate before production release. No frontend-only test overrides that gate.

## Deployment / rollback

Ensure the deployed frontend references the matching backend SHA and configured HTTPS API/R2 media origins. Deploy together with workers and verify all routes and content-security/CORS settings. Preserve prior frontend release artifact so rollback is immediate; invalidate outdated CDN/Next caches, verify `/job`, `/candidates`, job details and recruiter/seeker private pages after rollback.

**Status:** Source-level changes are implemented. Production readiness is conditional on full dependency-based builds and live integration evidence. Do not enable real payments solely because offline tests pass.
