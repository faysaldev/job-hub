# Phase 3 — Changed/new files only

This ZIP must be overlaid on the completed **Phase 1 and Phase 2** JobHub repository. **Frontend direct R2 uploads, secure private links, resume/company/profile/chat integrations, private messaging, and public image configuration.**

New files (excluding this manifest): **2**. Modified files: **18**. Files to delete: **0**.

## File manifest

| Status | Path |
|---|---|
| MODIFIED | `front-end/.env.example` |
| NEW | `front-end/PHASE3_CLIENT_NOTES.md` |
| MODIFIED | `front-end/app/(recruiter)/recruiter/messages/page.tsx` |
| MODIFIED | `front-end/next.config.ts` |
| MODIFIED | `front-end/src/Page/Candidates/CandidateDetailsPage.tsx` |
| MODIFIED | `front-end/src/Page/JobSeeker/JobSeeker.tsx` |
| MODIFIED | `front-end/src/Page/PrivacyPolicy/PrivacyPolicyPage.tsx` |
| MODIFIED | `front-end/src/Page/Recruiter/MessagesPage.tsx` |
| MODIFIED | `front-end/src/components/JobSeeker/AppliedJobs.tsx` |
| MODIFIED | `front-end/src/components/JobSeeker/JobSeeker/Resumeportfoliosection.tsx` |
| MODIFIED | `front-end/src/components/JobSeeker/JobSeekerMessages.tsx` |
| MODIFIED | `front-end/src/components/JobSeeker/JobSeekerProfile.tsx` |
| MODIFIED | `front-end/src/components/Recruiter/ApplicantsList.tsx` |
| MODIFIED | `front-end/src/components/Recruiter/CompanyProfile.tsx` |
| NEW | `front-end/src/components/assets/SecureAssetLink.tsx` |
| MODIFIED | `front-end/src/components/jobs/ApplyJobModal.tsx` |
| MODIFIED | `front-end/src/components/layout/WorkspaceShell.tsx` |
| MODIFIED | `front-end/src/hooks/useSocket.ts` |
| MODIFIED | `front-end/src/redux/features/assets/assetsApi.ts` |
| MODIFIED | `front-end/src/redux/features/user/userApi.ts` |

## Deleted paths

**NONE**

## Deployment conditions

- See `front-end/PHASE3_CLIENT_NOTES.md` for R2 public hostname and browser QA.
- Run `pnpm install --frozen-lockfile`, `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build` and E2E tests before deployment.
- Do not expose private storage credentials in `NEXT_PUBLIC_*`.

## Offline verification performed

- TypeScript/TSX parser check: **287 parsed files, 0 syntax parse errors**.
- Local import resolver check: **723 imports, 0 missing paths**.
- Backend Phase 3 source guardrails: **15/15 pass**.
- Phase 3 CLI Node syntax checks: **pass**.
- **Not** verified: full Next.js/backend compilation, deployed R2, Redis and MongoDB operations, browser CORS, Stripe E2E, external services. Run all release checks with dependencies/services configured.
