# JobHub Phase 5 changed-files manifest

Apply this ZIP on top of the completed Phase 1–4 project; retain every other existing file.
Area: `backends`
Added/modified source files: **29**
- New: **20**
- Modified: **9**
- Files to delete: **NONE**

## Included paths

- `backends/.env.example` — MODIFIED
- `backends/PHASE5_API_CONTRACTS.md` — NEW
- `backends/PHASE5_RELEASE.md` — NEW
- `backends/package.json` — MODIFIED
- `backends/scripts/phase5-indexes.cjs` — NEW
- `backends/scripts/phase5-reconcile.cjs` — NEW
- `backends/scripts/phase5-replay-webhook.cjs` — NEW
- `backends/scripts/phase5-seed-plans.cjs` — NEW
- `backends/scripts/phase5-static-check.cjs` — NEW
- `backends/src/domains/Billing/billing.account.model.ts` — NEW
- `backends/src/domains/Billing/billing.admin.ts` — NEW
- `backends/src/domains/Billing/billing.controller.ts` — NEW
- `backends/src/domains/Billing/billing.credit.model.ts` — NEW
- `backends/src/domains/Billing/billing.entitlements.ts` — NEW
- `backends/src/domains/Billing/billing.invoice.model.ts` — NEW
- `backends/src/domains/Billing/billing.plan.model.ts` — NEW
- `backends/src/domains/Billing/billing.promotion.model.ts` — NEW
- `backends/src/domains/Billing/billing.reversal.model.ts` — NEW
- `backends/src/domains/Billing/billing.route.ts` — NEW
- `backends/src/domains/Billing/billing.service.ts` — NEW
- `backends/src/domains/Billing/billing.webhook.model.ts` — NEW
- `backends/src/domains/Billing/billing.webhook.ts` — NEW
- `backends/src/domains/Company/company.model.ts` — MODIFIED
- `backends/src/domains/Company/company.workspace.ts` — MODIFIED
- `backends/src/domains/Generals/general.services.ts` — MODIFIED
- `backends/src/domains/Jobs/job.model.ts` — MODIFIED
- `backends/src/domains/Jobs/job.services.ts` — MODIFIED
- `backends/src/domains/Stripe/stripe.controller.ts` — MODIFIED
- `backends/src/routes/index.ts` — MODIFIED

## Verification

Source syntax and local import checks passed; the bundled backend static security checks passed.
Full TypeScript compilation, Next.js production build, live Stripe webhook billing, MongoDB transactions and browser E2E tests are NOT verified in this environment.
See the included release notes to complete staging validation before production.
