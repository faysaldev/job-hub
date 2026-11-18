# JobHub Phase 5 - Backend release notes

Apply only after Phase 1, Phase 2, Phase 3 and Phase 4 patches. This ZIP overlays paths **relative to the `backends/` root** and contains only Phase 5 additions/changes.

## API (minimal additions)

Existing routes reused: `PATCH /api/v1/applications/:applicationId` (stage/note/offer), `POST /api/v1/interviews`, `GET /api/v1/interviews/my`, `PATCH /api/v1/interviews/:interviewId/reschedule`, `PUT /api/v1/interviews/:interviewId/status`, `POST /api/v1/conversations`.

Four small routes were added to two existing modules:
- `GET /api/v1/job-seekers/:id/engagement` (recruiter + active company permissions, no private resume)
- `PATCH /api/v1/job-seekers/:id/engagement` with `{ "action": "save" | "shortlist" | "remove" }`
- `GET /api/v1/saved-jobs/companies` (authenticated seeker, followed employer IDs)
- `PATCH /api/v1/saved-jobs/companies/:companyId` with `{ "following": true | false }`

A **talent shortlist** is a company-scoped bookmark, not a stage change for a job application. To change a job applicant's stage, use the existing ATS endpoint.

## Rollout

1. Deploy to isolated staging with a backup and matching frontend. Run `npm ci`, `npm run typecheck`, `npm run build`; fix any compile failures before releasing. This workspace did not have installed npm dependencies, so builds must be performed in CI.
2. Roll out additive Mongo indexes for company candidate bookmarks, employer follows, notification dedupe keys and interview slots. First check for duplicates. After the build, `PHASE5_BUILD_INDEXES=1 node scripts/phase5-hiring-indexes.cjs`; the script only calls `createIndexes` and never deletes existing data.
3. Continue running the existing private `phase4:scheduler` every five minutes. It now checks followed employers in addition to publishing due jobs and saved-search alerts. Do not expose this worker as an HTTP endpoint.
4. Use IANA time zones (`UTC`, `Asia/Dhaka`, `America/New_York`). Clients send a calendar date, HH:mm start/end and `timeZone`. The backend stores UTC `startAt/endAt` and the original local wall clock. Missing `timeZone` defaults to UTC for older clients; legacy interviews remain readable.
5. Check the `notifications` unique sparse dedupe index and verify Socket.IO notification re-fetch/reconnect. Follow alerts are persisted in-app. This patch does not add a separate email campaign or background delivery service.

## Must-pass staged acceptance

- Recruiter with an active company can shortlist/reject an applicant; no unavailable action is displayed. Each transition has an appended stage history record. A non-member and revoked member get 403; seeker cannot mutate ATS notes.
- Recruiter can save/shortlist/remove a **public + searchable** candidate into a company-scoped talent list; a private/unsearchable candidate remains inaccessible. Existing application + `allowContact` are needed for candidate-profile messaging.
- Authorized recruiter starts an existing-application conversation; a revoked team member and candidate with disabled direct contact cannot start a new one. Prior threads are not returned before authorization.
- Recruiter schedules a real application with an active interviewer; invalid time zones, invalid/ambiguous DST times and overlapping assigned slots are rejected. Reschedule, reassign, finish and cancel; seeker sees changes without scorecards.
- Follow/unfollow survives logout; publishing a new approved job causes one deduplicated in-app alert via the scheduler; private/unapproved jobs never trigger alerts.
- Legacy `/recruiter/applications` notification opens the working applicants page. No outside URL or `javascript:` is allowed by frontend link sanitization.

## Verification limits

Offline: existing Phase 1-4 regression suites, source import/parse scan and Phase 5 focused runtime/source tests. **Not demonstrated** in this environment: npm production builds, real MongoDB transaction/race handling, live Socket.IO messages, actual scheduler deployment, email delivery, authenticated browser E2E or live interviewer calendars. Do not claim production completion until all staging gates pass.
