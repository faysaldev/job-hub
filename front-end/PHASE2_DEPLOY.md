# JobHub Phase 2 - Frontend Deployment & Acceptance

Apply this frontend ZIP **after** the original project and Phase 1 frontend patch. Only new/changed Phase 2 files are included, with paths relative to the repository root (`front-end/`). Deploy at the same release revision as the Phase 2 backend.

## Changes included

- Job Create/Edit wizard: native mouse-accessible subcategory select, native deadline calendar input, local end-of-day UTC conversion, individual skill chips, full review of responsibilities/benefits, field-specific API errors, draft save, and immediate/scheduled publication.
- Public search: `locationType=remote` for the Remote filter, real category/subcategory counts from the existing `/job` response, application count filters, server-side pagination, and usable loading/error states.
- Recruiter jobs workspace: new draft action, persisted edit, close/reopen, confirmed soft Archive, quota/overage messaging, clear status labels and timestamps, and action confirmations.
- Recruiter dashboard and billing: distinguish reserved slots, open jobs, total historical published listings and scheduled listings. Display meaningful errors instead of silently showing inconsistent or blank values.
- RTK Query invalidation: job changes refresh relevant job, analytics, and billing data without new API endpoints.

## Install and verify

```
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm build
pnpm phase2:check
```

**E2E browser sign-off:** Test a fresh recruiter with 0 listings publishing the first listing; save a draft and reload; edit public listing without unpublishing; publish staged changes; check Remote and salary/category filters; close, reopen, archive; and compare the homepage subset, `/job`, recruiter dashboard, and billing totals. Test keyboard/mouse input for subcategory selection and date handling in UTC-12 and UTC+14 browsers where possible.

**Important:** Phase 2 did not change the auth endpoints, user settings, Stripe, or media upload flows. Preserve Phase 1 patches; Phase 3 and Phase 4 address media and payments respectively. The offline packaging environment lacked frontend project dependencies, so runtime production build and browser E2E checks are still required.
