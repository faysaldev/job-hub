# JobHub Phase 4 frontend patch

Apply after **Phase 1, 2 and 3**. Merge this archive beneath `front-end/` while keeping unrelated existing files. Deploy the matching Phase 4 backend before enabling paid user actions.

## Updated flows

- Application form fetches the exact USD highlight quote from `GET /stripe/boost-offer` and shows a clear unavailable state when billing is not configured.
- Completing a Stripe Checkout **redirect is not proof of payment**. The return screen polls existing backend payment details and shows `Highlighted` only after the signed webhook has saved the entitlement. Standard applications remain valid after canceled or failed optional payments; My Applications offers a checkout retry.
- Recruiter Billing fetches the currently published catalog and can start a first subscription or request a paid-to-paid upgrade using the existing `/billing/actions` endpoint. Free remains one seat. Team capacity/upgrade links come from the existing team response; expiration and resend controls are included.

## Verification

```
npm ci
npm run typecheck
npm run lint
npm run build
npm run phase4:checkout-check
```

Then test in a staging browser with `sk_test_` Stripe credentials and the backend deployed with signed test webhooks: fresh seeker application, boost price, checkout, verified badge, canceled checkout/retry; Free team limit, published paid plan upgrade, actual invite email, acceptance by correct recruiter account, role permissions, and removal/expiration. Run the previous Phase 1–3 regression suites as well. Do not claim live payment readiness before the backend's `PHASE4_DEPLOY.md` acceptance list is satisfied.
