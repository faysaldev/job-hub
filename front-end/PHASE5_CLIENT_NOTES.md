# JobHub Phase 5 frontend: Stripe billing and sponsored placements

Apply these files **after Phase 1–4 frontend changes**. This ZIP includes only Phase 5 additions/changes; do not replace your entire project with it. **Files to delete: NONE.** The backend Phase 5 ZIP must also be applied.

## New/updated pages and components

- `/recruiter/billing`: current plan, usage/limits, active job capacity, team seats, available credits, published plan catalog, verified paid invoices, sponsored purchase history, Stripe Checkout and owner-only Customer Portal.
- `/admin/plans`: platform-admin-only plan manager: draft/create/duplicate/edit/publish/hide, visible historical versions, validation and status messaging.
- Sponsor actions in `/recruiter/jobs`: 7-day credit, 7-day $15, or 30-day $39 sponsorship. Credits require an active eligible paid subscription. Backend checks the job deadline covers the entire promotion.
- Public job search and reusable JobCard show the **Sponsored** label for active paid placements, with backend-controlled ranking and expiry. No misleading permanent paid rank.
- Uses existing RTK Query / Redux store. All new recruiter billing operations reuse **one POST** `/billing/actions` endpoint. Billing dashboard retrieves plan, quota, invoices and promotions in one round-trip.
- Loading placeholders, request retries, role checks, disabled buttons and toast messages are included. Private invoice/checkout URLs never use user-supplied destinations.

## Required checks before production

```bash
cd front-end
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

Ensure `NEXT_PUBLIC_BASE_URL` points to your Phase 5 backend and that Phase 1 auth refresh/cookies still work. Configure backend `FRONTEND_URL` to the exact HTTPS frontend origin. Ensure the Stripe Customer Portal is configured to allow cancellations, invoices, and payment methods **but not arbitrary plan switching**; see `backends/PHASE5_RELEASE.md`.

Manually verify Free/Starter/Growth/Business/Enterprise cards, checkout-return pending notices (no immediate paid benefits), refresh after real test webhook, quota errors, sponsored badges, historic invoices, accessibility/keyboard controls and all mobile breakpoints. Check non-owner access and admin-only routes. Real UI/browser tests and Stripe staging payment tests have not been executed in this code-only environment.
