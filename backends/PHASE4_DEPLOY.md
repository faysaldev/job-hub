# JobHub Phase 4: Stripe Highlights, Billing and Team Invites

This archive is an **incremental patch**. Apply Phase 1, Phase 2, and Phase 3 first, then merge only the files from this archive under `backends/`. Back up application data, use a staging database, and never publish payment credentials in source control.

## What changed

- Only **one new read endpoint**, `GET /stripe/boost-offer`, returns a server-configured price in integer USD cents and payment availability. Existing `POST /stripe/create-checkout-session` and `GET /stripe/payment-details/:sessionId` are reused. Clients never choose amounts.
- Application highlight remains Standard until a **signature-verified Stripe webhook** marks it `paid`. Retry an open checkout rather than generating a duplicate charge; a completed checkout displays **verification pending** until the webhook. Refunds and disputes revoke the paid benefit. Paid boosts sort ahead of Standard applications in recruiter review.
- Recruiter billing reuses `GET /billing/plans`, `GET /billing/dashboard`, and `POST /billing/actions`. `checkout` starts the first paid subscription, `upgrade` replaces the price of an existing paid subscription, and `portal` manages billing. The new quota is not granted by a checkout redirect; it requires the verified invoice webhook.
- Existing team API `GET/POST /recruiter-company/team`, `PATCH /recruiter-company/team/:id` reserves a seat transactionally, writes an encrypted invitation message to the mail outbox in the same transaction, expires invites after 7 days, and allows revoke/re-send. Pending invites reserve seats; Free remains one owner seat.
- Webhook invoice verification checks the server plan price and actual invoice line price, rejects older/reversed invoices, uses the existing webhook event idempotency ledger, and reverses credits/promotions on full refunds/disputes.

## Environment (staging first)

Configure these in the **backend runtime secrets** (do not put real values in `.env.example`):

```
NODE_ENV=production
DATABASE_URL=<staging-MongoDB-replica-set-URI>
FRONTEND_URL=https://staging.example.com
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
APPLICATION_BOOST_PRICE_CENTS=299
STRIPE_LIVE_PAYMENTS_ENABLED=false
MAIL_OUTBOX_KEY=<stable-strong-secret>
# Plus the working SMTP settings from Phase 1
```

`APPLICATION_BOOST_PRICE_CENTS` must be an integer between 50 and 100000; zero intentionally disables paid highlighting. Run all Stripe testing with **`sk_test_` and corresponding `whsec_`**. Only deliberately set `STRIPE_LIVE_PAYMENTS_ENABLED=true` after all acceptance checks; leaving it `false` blocks new live checkouts and upgrades. Keep old webhook signing secrets active through planned Stripe key rotations and retry periods. Use HTTPS backend/frontend origins and allowed CORS settings.

The mail outbox reuses the **Phase 1 email worker**. Invitations are marked `queued`, not `delivered`; monitor worker retries, SMTP bounces, and sent/failed outbox rows.

## Plans and database readiness

1. Deploy to staging and run `npm ci` in `backends/`.
2. Run `npm run build` and `npm run typecheck` (both must succeed before release).
3. Read-only catalog and billing readiness: `npm run phase4:plans-preflight`. This checks server price config, signed webhook key presence, and current published plans with a multi-seat paid tier; it never charges or edits anything. It exits non-zero if acceptance prerequisites are absent.
4. When paid plans are missing, preview `node scripts/phase5-seed-plans.cjs` and, **only after a backup and admin review**, run `PHASE5_CONFIRM_SEED=YES node scripts/phase5-seed-plans.cjs --apply`. The script preserves existing plans and does not overwrite customized entries. Check the current catalog to ensure at least one published higher-seat tier (Growth or Business). Starter intentionally has one total seat, so upgrading to Starter does **not** unlock team invites.
5. Review proposed unique indexes with `node scripts/phase5-indexes.cjs` and Phase 6 index scripts. Back up data and check duplicates before the guarded `--apply` commands. New model indexes in this patch include team-invite outbox lookups and paid-application priority; run `Application.createIndexes()` / `MailOutbox.createIndexes()` under your migration/index rollout if `autoIndex=false` in production.
6. **MongoDB replica-set transactions are required** for atomic seat reservation and outbox delivery. No standalone MongoDB database is supported for this operation.
7. Existing pending team invites receive an `expiresAt` on resending; quotas count only active members and non-expired invites. No existing team member, job, payment, or subscription is deleted by this patch.

## Stripe webhook configuration

Route the signed raw-body Stripe webhook to the **existing webhook URL**, registered before Express JSON parsing. Enable at least:

- `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`
- `invoice.paid`, `invoice.payment_succeeded`, `invoice.payment_failed`
- `customer.subscription.created`, `.updated`, `.deleted`
- `charge.refunded`, `charge.dispute.created`

Ensure the server can retrieve Stripe Checkout sessions, subscriptions, prices, invoices and payment intents, and can create checkout/portal sessions and subscription price changes. In Stripe Customer Portal configuration, disable unmanaged plan swapping unless an equivalent application reconciliation mechanism is deployed; the app owns plan and quota activation.

## Required staging acceptance (not possible in the offline build environment)

1. With an ordinary seeker and valid job, submit a Standard application. It must remain successful even if optional checkout is offline.
2. Set a nonzero `APPLICATION_BOOST_PRICE_CENTS`, open application modal and verify displayed price matches `GET /stripe/boost-offer`; finish Stripe **test** Checkout. Before webhook processing, paid highlight must not be shown. After verified webhook, seeker badge and recruiter priority must appear.
3. Cancel a new checkout and retry from My Applications; existing open checkouts must be reused. Exercise duplicate webhooks and a payment failure. Ensure no duplicate charge, no unearned highlight, and no duplicate application.
4. In **test mode** refund the highlight and create a dispute: the badge/priority must be revoked; delayed paid events must not regrant it.
5. Confirm Free account with one owner cannot invite another member and sees a real billing upgrade action. Purchase a published **multi-seat** paid plan, verify invoice webhook, invite recruiter/interviewer, receive email, accept with the matching verified recruiter account, test permissions, revoke invitation or membership, and confirm accurate available seats.
6. Test expired and resent invitations and simultaneous invitation requests. Check seat reservation remains atomic and that no inactive/expired member consumes permanent capacity.
7. Test paid-to-paid upgrade and invoice proration, decline/3DS-required payment, delayed and reordered webhooks, sponsor checkout/credits, full refund/dispute, and subscription cancellation/period expiry. Quotas must only change after verified invoice payment and must never remain higher after eligibility expires.
8. Audit event logs for `processed` and `failed` webhook states, Stripe event duplicates, SMTP failures, and billing reconciliation. Re-run Phases 1–3 regressions and full authenticated UI E2E on staging.

## Local offline checks

```
npm run phase4:payments-check
node scripts/phase6-source-audit.cjs
```

The frontend also has `npm run phase4:checkout-check`. Offline/source-level tests **do not** certify live Stripe, MongoDB, SMTP, browser CORS or production builds. Keep `STRIPE_LIVE_PAYMENTS_ENABLED=false` until those checks have passed.

## Rollback

Redeploy the previous backend/frontend revisions as one coordinated rollback. Keep the existing Stripe webhook accepting and idempotently processing events until all in-flight payments, refunds and disputes are reconciled; do **not** disable webhook intake while active sessions exist. No destructive schema migration is included. Preserve the new payment/invitation fields and the webhook/reversal/outbox ledger; never manually set a paid entitlement or delete recorded payment events to hide an error.
