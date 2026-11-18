# JobHub Phase 1 — frontend deployment and verification

These changes include registration/verification/reset UI, access-token-in-memory restoration from the backend's HttpOnly refresh cookie, shared refresh coordination, and new account-settings pages. All account operations use **existing** APIs; no additional HTTP endpoints are necessary.

## Install

Extract this archive into the original project root, preserving the `front-end/` directory structure, and deploy it **together with the Phase 1 backend archive**.

- Configure `NEXT_PUBLIC_BASE_URL` to the **origin of the backend** (without `/api/v1`), for example `https://api.example.com`.
- Use HTTPS for frontend and backend in production. Ensure `FRONTEND_URL` on the backend matches the browser origin exactly and `AUTH_COOKIE_SAME_SITE` fits the actual deployment topology. Some browsers disallow third-party cookies; using an API under the same registrable domain as the site is safer.
- Migrating from the previous Redux-persist state intentionally removes stored JWTs. Users with old sessions should recover through their HttpOnly refresh cookie, or sign in again if no valid refresh cookie remains.
- Both `/job-seeker/settings` and `/recruiter/settings` support editable name/phone, password change, and soft account disable. Email is read-only because secure email change + re-verification is not implemented by the existing API. Existing notification/privacy/alert links are reused.

## Validate locally

```sh
npm install
npm run typecheck
npm run lint
npm run build
npm run phase1:session-test
```

Also run the backend's Phase 1 smoke test against an isolated staging deployment and verify both roles in a real browser: register, verify, login, reset, refresh, reload, direct URL, logout, password change and deletion. Keep a tab open for at least 30 minutes and confirm the session remains valid without false logout. Check the cookie is `HttpOnly`, `Secure` (HTTPS), and matches the configured `SameSite` policy; access JWTs should not be present in localStorage.

## Limits of the supplied package

Only changed/new files are included. This package has passed offline source-parse/import checks and focused refresh tests; full Next.js/TypeScript builds and remote integration tests still must run in your dependency-enabled CI and deployment environment.
