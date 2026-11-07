# Phase 4 additive API contracts

All endpoints below are under the preexisting `/api/v1` mount and use the existing response envelope (`{code,status,message,data}`). Existing response shapes and prior routes remain supported. Authentication uses the Phase 1 bearer/session system.

| Method | Endpoint | Allowed caller | Purpose |
|---|---|---|---|
| GET | `/recruiter-company/team` | recruiter | own company, team and email-addressed pending invites |
| POST | `/recruiter-company/team` | company owner/admin | `{email,role:admin\|recruiter\|interviewer}`; admin role invitations owner only |
| PATCH | `/recruiter-company/team/:id` | invitee or owner/admin | `{action:accept}` or `{action:role,role}` or `{action:remove}` |
| POST | `/recruiter-company/verification-request` | owner/admin | request platform review of completed profile |
| PATCH | `/recruiter-company/:id/verification` | platform admin | `{status:verified\|rejected,reason?}` |
| GET | `/recruiter-company/careers/:slug` | public | published career page and up to 50 open jobs |
| GET | `/job/mine?status=&page=&limit=` | owner/admin/recruiter member | company job drafts/active/closed listing with pagination |
| POST | `/job` | owner/admin/recruiter member | existing job creation, now supports `status:draft\|scheduled\|published`, optional `publishAt` |
| PUT | `/job/:id` | same | update details/status with merged-data publish validation |
| PATCH | `/applications/:id` | recruiter member or applicant (action-based) | single ATS command endpoint |
| PATCH | `/interviews/:id/scorecard` | assigned company interviewer | validated scorecard, private to recruiters |
| POST | `/interviews` | owner/admin/recruiter member | existing route optionally accepts `interviewer` id of active company teammate |
| GET/POST | `/saved-jobs/searches` | seeker | saved searches/alert preferences (max 30) |
| PATCH/DELETE | `/saved-jobs/searches/:id` | owner seeker | update or delete one saved search |

ATS command body:
- `{action:"stage",status:"under_review"|"shortlisted"|"interview"|"hired"|"rejected",note?:string}`
- `{action:"note",text:string}` (internal only)
- `{action:"offer",salary:number,currency:"USD",message?:string,expiresAt:ISODate}` (ISO4217 3-letter uppercase currency; not limited to USD)
- `{action:"offer-response",decision:"accepted"|"declined"}` (applicant only, while not expired)

Data model additions (no destructive rename): `Company.careers*` + verification; `CompanyMember` new collection; `Job.companyId`, status/dates; `Application.stageHistory`, internalNotes, offer; `Interview.scorecard`; `Seeker.privacy/preferences`; `SavedSearch` new collection. Private resumes remain R2 asset references and require authorization.

Performance and safety: company-scoped indexed reads; bounded page sizes; only one ATS mutations endpoint for notes, offers and stage changes; saved searches extend existing saved-jobs resource; webhook and Stripe endpoint architecture unchanged. Scheduler is NOT a public API.
