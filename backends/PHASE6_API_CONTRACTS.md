# Phase 6 API contracts — compact operations interface

Base: `/api/v1/operations` (existing `/api/v1` prefix). Response envelope is existing `{ status, statusCode, message, data }`. No previous Phase 1–5 route is removed.

| Method/path | Permission | Input and expected output |
| --- | --- | --- |
| `POST /reports` | Authenticated seeker/recruiter | `{targetKind:"job"\|"company"\|"user",targetId:ObjectId,category:"spam"\|"fraud"\|"harassment"\|"misleading"\|"other", description:15–2000 chars}` -> `{_id,status}`. Duplicate open reports from same account rejected. |
| `GET /recruiter/analytics` | Recruiter; company membership checked | `{companyId,generatedAt,windowDays,totals,funnel,applicationsPerDay,caveat}` scoped to authorized company; no raw candidate PII. |
| `GET /overview` | Platform admin | `{generatedAt,totals,attention,last30Days,applicationsPerDay}`. Payment total is recorded paid USD invoices excluding known reversals, not recognized revenue. |
| `GET /records` | Platform admin | Query `kind=companies\|jobs\|users\|reports\|support\|subscriptions\|invoices\|stripe-events\|audit`, optional `status`,`search`, `page=1..10000`,`limit=1..50`. Returns `{kind,records,pagination}` with projections per collection. |
| `POST /actions` | Platform admin; rate limited | Strict action discriminator, see actions below. Never permits client-supplied collection/field/update selectors. |

`POST /actions` body variants:

```
{"action":"verify-company","companyId":"<24-char ObjectId>","decision":"verified|rejected","reason":"..."}
{"action":"moderate-job","jobId":"<24-char ObjectId>","decision":"blocked|restored","reason":"..."}
{"action":"user-access","userId":"<24-char ObjectId>","decision":"suspend|restore","reason":"..."}
{"action":"review-report","reportId":"<24-char ObjectId>","decision":"reviewing|resolved|dismissed","reason":"..."}
{"action":"support","contactId":"<24-char ObjectId>","decision":"open|in_progress|resolved","reason":"..."}
{"action":"reconcile-invoice","invoiceId":"<24-char ObjectId>"}
{"action":"retry-stripe-event","eventId":"evt_<Stripe event id>"}
```

Notes:
- Invoice reconciliation retrieves Stripe's recorded status/amount/currency and **does not rewrite local financial records**. Stripe webhook replay fetches the canonical event from Stripe's authenticated API and uses the Phase 5 idempotent processor, never trusts a client-supplied event payload.
- Company verification also keeps the Phase 4 route `PATCH /api/v1/recruiter-company/:id/verification`; it now shares the audited transactional implementation.
- Existing `/api/v1/billing/admin/plans` endpoints remain the only way to edit/version plans; Phase 6 does not introduce duplicate plan endpoints.
- `GET /readyz`: 200 only when MongoDB ping succeeds, else 503; Redis is shown as a degraded optional dependency. `GET /healthz` returns 200 for process liveness. Avoid putting these on a publicly indexed page.
- Security: access token required, suspended accounts denied, admin required for operation lists/actions, recruiter analytics checks company membership server-side, page limits fixed, inputs validated and failed mutations do not write audit records.
