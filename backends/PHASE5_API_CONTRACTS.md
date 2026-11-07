# Phase 5 compact API contracts

Existing authentication (Phase 1), job/ATS (Phase 4), private R2 (Phase 3) and Stripe boost endpoints remain unchanged. All JSON responses use the established `{ code, status, message, data }` envelope. Request bodies are Zod-validated. The backend is authoritative for all prices and limits.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/v1/billing/plans` | Public | Current published version of each plan including Free fallback; no private billing data |
| `GET` | `/api/v1/billing/dashboard` | Authenticated recruiter role + company membership | One response with effective plan, usage, credit balance, current subscription status; invoices/purchases only for company owners/admins |
| `POST` | `/api/v1/billing/actions` | Authenticated recruiter + company permission | Unified action: `checkout`, `portal` or `sponsor`. Owner-only for `checkout`/`portal` |
| `GET` | `/api/v1/billing/admin/plans` | Platform admin | Up to 300 plan versions, newest first within key |
| `POST` | `/api/v1/billing/admin/plans` | Platform admin | Create unpublished version 1 of a unique key |
| `PATCH` | `/api/v1/billing/admin/plans/:id` | Platform admin | `edit`, `duplicate`, `publish`, `hide`; published edits fork a draft next version |
| `POST` | `/api/v1/stripe/webhook` | Stripe signature required | **Existing signed raw-body endpoint**. Idempotent subscription and sponsorship fulfillment, including refunds/disputes |

## Examples

```json
{"action":"checkout","planKey":"growth"}
```

```json
{"action":"portal"}
```

```json
{"action":"sponsor","jobId":"0123456789abcdef01234567","durationDays":7,"payment":"credit","requestId":"92d34739-b66a-4a85-ad8e-caa31cd8b7c9"}
```

```json
{"action":"sponsor","jobId":"0123456789abcdef01234567","durationDays":30,"payment":"stripe","requestId":"fe47fbb7-64d3-4bd2-992a-3184714bbda2"}
```

```json
{"action":"edit","changes":{"priceCents":5900,"limits":{"activeJobs":20,"teamSeats":3,"monthlyCredits":1}}}
```

```json
{"action":"publish"}
```

```json
{"action":"hide"}
```

```json
{"action":"duplicate","newKey":"regional-growth","newName":"Regional Growth"}
```

The backend never accepts `priceCents`, `currency`, plan limits or credit allocations from recruiter checkout/promotion actions; it reads them from the server-published catalog and fixed promotion configuration. GET `/billing/dashboard` returns one consolidated response instead of separately fetching plans, quota, invoices and sponsorship records. Existing `GET /job` and `/job/search` share the canonical search implementation, which sorts active sponsored jobs first and includes `isSponsored` and `sponsoredUntil` as explicitly labeled fields. The listing endpoints preserve pagination shape.

A successful Stripe browser redirect is informational only. Subscription benefits are enabled solely by invoice-paid event verification and valid paid-through time. Promotion purchases are enabled solely by signed paid Checkout events or an atomic debit of an already-earned credit.
