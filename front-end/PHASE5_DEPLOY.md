# JobHub Phase 5 - Frontend release notes

Apply after the frontend Phase 1-4 patches. Overlay this ZIP into the `front-end/` root only.

- ATS renders `allowedTransitions` returned by backend; it uses the existing application patch API for stage changes/notes and existing interview routes for scheduling.
- Candidate profiles show company-scoped Save/Shortlist actions. Message is offered only where backend confirms an application and contact permission. This does not grant access to private resumes.
- Seeker company pages show Follow/Unfollow, backed by the existing saved-jobs API namespace; follow state persists across reloads.
- Recruiter interview schedule supports IANA time zone, meeting URL changes, re-assignment, completion and cancellation. Seeker interview page includes an actual preparation checklist and calendar time-zone information.
- Old notification links are remapped and the legacy route redirects without adding API calls.

In CI: `npm ci`, `npm run typecheck`, `npm run lint`, `npm run build`, Playwright authenticated E2E tests, responsive/accessibility checks. See backend deployment notes for real MongoDB scheduler, index and permission testing.

The browser cannot infer the correct business time zone for every recruiter. **Choose the intended IANA time zone explicitly** when scheduling; UTC is the safe default and must not be treated as your local zone unless it is.
