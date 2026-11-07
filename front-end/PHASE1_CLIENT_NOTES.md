# JobHub Phase 1 — frontend overlay notes

- Existing page design remains unchanged. Only security-related session, payment and application behavior are patched.
- The Redux provider hosts `AuthSessionProvider` so access tokens rotate automatically; RTK Query also retries a failed authorized call once after rotating the HttpOnly cookie.
- Socket.IO reconnects with fresh access tokens and rejoins authorized conversations. Logging out requests server-side session revocation and clears client cached API data.
- The job application form no longer accepts a client-selected price. It uses server-priced optional checkout. An old demonstration modal now points at the actual application API rather than falsely announcing success.
- The Stripe success page displays paid/active status only when verified through the payment-details API. Candidate and recruiter lists show paid highlights only when a verified backend flag is present.

## Installation and verification

From `front-end`: `corepack enable && pnpm install --frozen-lockfile && pnpm exec tsc --noEmit && pnpm run lint && pnpm run build`.

Configure `NEXT_PUBLIC_BASE_URL` for the backend (including Socket.IO on the same HTTP host/port). Keep `NEXT_PUBLIC_API_URL` aligned. With different-site HTTPS domains, set the backend `AUTH_COOKIE_SAME_SITE=none`; locally `lax` works on different ports of localhost. Test login, refresh, auth state after reload, multiple tabs, and logout.

### Compatibility

**New refresh-cookie sessions mean existing users must sign in again after deploying Phase 1.** Do not deploy this frontend against the old backend; stage and cut over both together. No frontend API routes were removed, and no R2 migration or Phase 2 visual refresh has been included.
