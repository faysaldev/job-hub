# JobHub Phase 2 — Frontend Patch (apply after Phase 1)

## Install order

1. Take a backup of the Phase 1 frontend and backend folders.
2. Overlay the paths from `JobHub_Phase2_Frontend_Updated_Files.zip` onto the corresponding paths in the **same repository root**. Only files that differ from the Phase 1 source (or are new) are in this archive. Do **not** delete the existing source tree.
3. Overlay the backend ZIP before starting the new frontend because the homepage now calls `/api/v1/generals/discovery`.
4. Set a real public `NEXT_PUBLIC_SITE_URL` (e.g., `https://jobs.example.com`). For server-rendered metadata, optionally set `API_INTERNAL_URL` to the reachable backend origin; it must resolve to the same API deployment as `NEXT_PUBLIC_BASE_URL`.
5. Install the project lockfile dependencies (network access required) and run the verification commands below.

## Commands

Run these from `front-end/`:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm dev
```

If using npm, use the actual lockfile/package manager policy of your project; the provided archive does not rewrite dependencies or lockfiles.

## Changed UI foundations

- `app/globals.css`: semantic navy/neutral design tokens, shared controls and workspace geometry, consistent focus indicators, accessible reduced-motion behavior.
- `src/components/common/Header.tsx`, `Footer.tsx`, `src/components/layout/WorkspaceShell.tsx`, recruiter/candidate layouts: consistent public/workspace navigation and responsive mobile drawer; auth guards wait for redux-persist rehydration.
- New feedback components: `Skeleton`, `PageLoading`, `TableLoading`, `MessagesLoading`, `WorkspaceLoading`, `ErrorState`, `EmptyState`, `RouteError`.
- New route-level `loading.tsx` and `error.tsx` boundaries, global fallback and not-found page. Existing route-specific loading/data handling is retained where appropriate.
- Homepage and public auth/about/contact pages are rewritten to remove placeholder endorsements, invented office details and unsupported success metrics.
- Jobs, companies, candidate listings and applications: keyboard, skeleton and retryable failure-state improvements. Search is debounced on the company directory.
- Metadata now targets real `/api/v1/job/:id` and `/api/v1/recruiter-company/:id` endpoints. Private/account pages are no-indexed; public robots, sitemap and social-image routes added.
- Privacy/terms pages have been replaced with transparent **draft copy that requires business and legal approval** prior to production launch. Do not deploy them as final legal policies.

## API request map

| Screen/use | Phase 2 frontend request | Note |
| --- | --- | --- |
| Home discovery | `GET /api/v1/generals/discovery` | One public request; top six live job cards + category statistics. |
| Job search and pagination | `GET /api/v1/job` | Canonical; old backend `/job/search` still works. |
| Company directory | `GET /api/v1/recruiter-company/all` | Debounced search query. |
| Candidate directory | `GET /api/v1/job-seekers/all` | Existing endpoint. |
| Global header (signed in only) | `GET /api/v1/generals/header-stats` | Skip when signed out; no duplicate saved/applied-ID reads. |
| Dynamic job metadata | `GET /api/v1/job/:id` | Server-side, public, no forwarded cookies. |
| Dynamic company metadata | `GET /api/v1/recruiter-company/:id` | Server-side, public, no forwarded cookies. |

## Deployment checks

- Mobile 320/375/768px; desktop 1024/1440px for candidate/recruiter/public paths; verify no horizontal scroll and mobile navigation works.
- Keyboard-only navigation: tab order, focus visibility, modal controls, form labels, Enter-to-open job card, Escape-to-close navigation.
- New/empty/error/loading/success states across jobs, profiles, messaging, interviews, saved jobs, recruiter CRUD, and candidate applications.
- Browser sign-in/sign-out, rehydrated refresh tokens, and protected route redirects after reloading.
- OpenGraph, `robots.txt`, `sitemap.xml`, and live metadata with the deployed API and DNS origin.
- Validate actual organization contact details, legal policies and user-visible marketing text with the operator.

## Verification actually performed in this delivery

- Syntax parsing of `.ts` and `.tsx` files with the available TypeScript compiler API.
- Repository-relative import checks and ZIP integrity checks.
- A live TypeScript typecheck, Next.js build, ESLint run, and browser E2E test **could not be completed in this isolated environment** without project dependencies/network and configured MongoDB/Redis/Stripe/email services. Do not treat these patches as production-certified until the deployment checks pass.

## Deletions and schema changes

- No files should be deleted for Phase 2.
- No database migration needed for Phase 2.
- Cloudinary, Stripe, Redis and Phase 1 security logic remain in place.
