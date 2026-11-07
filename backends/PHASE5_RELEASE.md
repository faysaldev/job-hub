# JobHub Phase 5: subscription billing and sponsored hiring

This change set is designed to overlay **Phases 1, 2, 3, and 4**. The ZIP includes only Phase 5 additions/changes and retains Stripe, MongoDB, Redis, R2 and Socket.IO. **Do not deploy based on a static review alone**: run the full staging checks below.

## Features delivered

- Free, Starter, Growth, Business, Enterprise **versioned plans** and an admin plan manager (`/admin/plans`). New plans are unpublished until approved. Editing a published plan creates an unpublished next version; existing paid accounts continue on their paid plan snapshot.
- Company-level entitlement enforcement: active/scheduled job slots, reserved team invitations/seats and monthly 7-day sponsorship credits. Company-row write locks serialize concurrent quota decisions in MongoDB transactions.
- Server-priced subscription Checkout, owner-only billing management via Stripe Customer Portal, payment history, usage dashboard (`/recruiter/billing`), and clearly marked time-bounded sponsored job search results. One unified recruiter action endpoint handles subscription checkout, portal, and sponsorship purchase.
- Signed Stripe webhook at the **existing** `/api/v1/stripe/webhook`, idempotent event handling, unique invoice and credit-grant IDs, payment reversal tombstones, and webhook replay tooling. A browser redirect has **no entitlement effect**.
- Backward-compatible existing job, application, company team, and candidate boost routes. No Cloudflare R2, Redis, Socket.IO, or email integration has been removed.

## Operational requirements

1. **Back up** the production database. Take a pre-release snapshot and verify restoration in a separate environment.
2. **MongoDB replica set required**, including MongoDB Atlas. Transactions are necessary for quota locks, credits, sponsorship activation, and plan publication. Standalone MongoDB will not meet Phase 5 requirements.
3. Verify `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `FRONTEND_URL` in the backend environment. In production, `FRONTEND_URL` must be an HTTPS address. Never commit actual API keys. Existing auth, R2 and Redis variables remain required as configured in previous phases.
4. Use the **same Stripe environment** (all test or all live) for secret key, webhook signing secret, and Stripe Customer Portal. Never mix test/live credentials.
5. Enable Stripe webhook delivery to `POST https://<api-host>/api/v1/stripe/webhook`. The backend mounts `express.raw()` **before** JSON parsing; preserve that middleware order. Subscribe at minimum to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded`, and `charge.dispute.created`. The handler also understands `invoice.payment_succeeded` for compatible events.
6. In the **Stripe Customer Portal configuration**, permit managing payment methods, invoices and cancel-at-period-end. **Disable direct subscription-price or plan switching**: this application does not implement proration/portal-initiated price changes. To change plans, cancel the old subscription, wait until entitlement expires, and purchase the new server-defined plan.
7. Seed the catalog **after** backend build and **before** making the new frontend live. Seeding is additive; it does not overwrite customized catalog versions. New companies get Free automatically even if seeding is delayed. Existing companies' pre-Phase5 published jobs may exceed Free limits: they stay readable/manageable, but additional jobs/invites are disallowed until under limits or upgraded.
8. Run Phase 5 index preflight after backup, then the index apply. Examine any unique-index conflicts before proceeding. New `BillingPaymentReversal`, `BillingAccount`, `BillingInvoice`, `BillingCreditGrant`, `BillingStripeEvent`, `BillingPlan`, and `JobPromotion` collections are created as needed.
9. Run reconciliation in **preview** and review the output before using `--apply`. The command repairs job sponsorship expiration values from the promotion ledger; it never charges anyone.
10. Roll out backend first, then frontend. Stripe webhooks and indexes need to be configured before enabling paid checkout. Monitor the `BillingStripeEvent` collection for failed events and use the replay CLI only after investigating the cause.

## Install and build, backend (PowerShell or bash)

From `backends`:

```bash
pnpm install --frozen-lockfile
pnpm exec tsc -p tsconfig.json --noEmit
pnpm build
pnpm phase5:static-check
pnpm phase5:seed
pnpm phase5:indexes
pnpm phase5:reconcile
```

After confirming the preview output and backup, explicitly approve applying the changes:

```bash
PHASE5_CONFIRM_SEED=YES pnpm phase5:seed --apply
PHASE5_CONFIRM_INDEXES=YES pnpm phase5:indexes --apply
```

On Windows PowerShell, use `$env:PHASE5_CONFIRM_SEED="YES"` and `$env:PHASE5_CONFIRM_INDEXES="YES"` before running the `pnpm` commands, or configure these in the **operator's local environment**. Never use these approval values in normal application runtime.

For sponsor discrepancy repair, **review preview first**:

```bash
PHASE5_CONFIRM_RECONCILE=YES pnpm phase5:reconcile --apply
```

For a specifically identified failed Stripe event (after investigating the failure):

```bash
PHASE5_CONFIRM_REPLAY=YES pnpm phase5:replay --event=evt_EXAMPLE
```

The `--apply` scripts and replay require credentials, valid prebuilt `dist/` files, and authorized operator access. All scripts are dry-run by default except replay (which requires an explicit approval flag).

## Install and build, frontend

From `front-end`:

```bash
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

Verify that the frontend points to the deployed backend through the already configured `NEXT_PUBLIC_BASE_URL` and that authentication cookies and CORS work across deployed origins.

## Essential staging acceptance tests (must pass before release)

1. **Free account**: a recruiter company can publish one job; attempting a second concurrent published/scheduled listing is rejected. Two simultaneous publish operations from separate clients must not both succeed. Drafts remain savable. Old pre-existing jobs are not deleted.
2. **Team quotas**: a Free company cannot invite a second seat (owner occupies seat 1). Upgrade through **test-mode Checkout**, verify one signed invoice event, then confirm that new seats and jobs unlock only after payment. Two concurrent invites at the limit must not both succeed.
3. **Paid Checkout**: manually visit a success redirect without completing payment; confirm the plan stays Free. A valid, signed paid invoice grants the exact plan snapshot. An altered client-side price or plan ID must be rejected (there is no accepted amount/price in the Checkout request).
4. **Webhook replay/order**: deliver the same `invoice.paid` twice and verify there is only one invoice ledger and one monthly credit grant. Deliver invoice/webhook events out of order; verify no duplicate benefits, expired access, or free renewals. Configure a webhook secret mismatch and verify HTTP 400.
5. **Lifecycle**: verify renewal grants one new credit allocation, invoice-payment failure does not grant a new period, cancel-at-period-end does not extend access, and expiry falls back to Free. Test immediate cancellation, disputes, and full refunds. Check reversal prevents a late invoice from re-granting the plan.
6. **Portal**: the owner can launch Stripe Customer Portal. Non-owner cannot launch checkout, portal or see private invoice URLs. Portal cannot change the subscription plan directly.
7. **Sponsor**: verify a paid 7-day/30-day promotion is created only after verified payment; promotion credits cannot be reused after spending; an expired/closed job cannot consume credits; repeated webhooks do not produce duplicate sponsored placements. Refunded sponsored charges must remove the paid listing position.
8. **Search**: sponsored results display the **Sponsored** label and sort ahead of organic listings while active. After expiration they immediately sort organically even without a scheduled job; no `sponsoredUntil` is accepted in job POST/PUT payloads. Validate search paging/filtering and Redis behavior before and after cache invalidation.
9. **Admin**: only platform `admin` accounts may create/duplicate/publish/hide plan versions. Publishing v2 does not change an existing paid v1 snapshot. Editing an already published plan must produce an unpublished new version.
10. **Regression**: candidate login, resumes via private R2, company workspace, applicant stages, interviews, messaging, Socket.IO notifications, Stripe legacy candidate boosts, and mobile layouts still work. Run real browser tests with separate company/candidate accounts and network throttling.

## Rollback and limitations

- **Before** enabling payments, rollback consists of restoring previous application deployments and disabling new billing routes or Stripe Checkout in production. Keep the newly created billing collections for investigation.
- **After** charging customers, never roll back only the application binaries while continuing to accept Stripe webhooks: configure a safe maintenance mode, reconcile paid orders, and preserve immutable payment records first. Stripe customer and subscription cancellations/refunds happen on Stripe, not by deleting MongoDB documents.
- Sponsor validity is computed from `sponsoredUntil` when searching; a periodic background reconciliation is recommended to repair interrupted deployments or manual data changes. Any older unsupported legacy sponsorship records should be reviewed before enabling broad reconciliation.
- Enterprise is **custom-contract only**; no automated invoice contract flow is built for it. Free is not a Stripe subscription. Billing prices are illustrative defaults and require commercial/legal review.
- For refunds/disputes Stripe may omit a direct payment-intent reference on some invoice payloads; compare ledger entries and Stripe dashboard during reconciliation. Promotion chargebacks can require manual follow-up if Stripe reports events without a payment-intent ID.
- Source-only checks do **not** prove a production deployment. Full TypeScript/Next builds, Stripe test clocks, integration tests, multi-instance quotas, and browser E2E tests must be completed in the target environment.

No existing files are scheduled for deletion in Phase 5.
