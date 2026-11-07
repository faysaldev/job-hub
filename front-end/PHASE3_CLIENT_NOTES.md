# Phase 3 frontend changes

**Overlay these changed frontend files on Phase 1 + Phase 2.** Do not replace the full project, delete the previous design system, or remove any Stripe/Redis-related integration.

## Upload and privacy

- `assetsApi.uploadFile` uses the same mutation name as before. New requests pass `{ file, kind }`; old `FormData(file)` avatar calls remain supported.
- One shared flow requests a signed R2 PUT, sends the browser's file bytes directly to R2 (no API authorization header on this cross-origin request), confirms via API, and returns the old `data.url` envelope. The backend alone owns R2 credentials.
- Company logo, user avatar, seeker profile resume, job-application resume and chat attachments use the same mutation.
- `SecureAssetLink` handles `asset:<24hex>` private document references, requests a 60-second signed URL via the existing authenticated API client, and opens it. Public pages do not display seeker resumes.
- Messaging uses existing Socket.IO `message:send` with optional `attachments: [assetId]`; no extra messaging REST endpoints.
- New recruiter inbox routes to the same secured conversations implementation as candidate inbox.

## Required environment

Set `NEXT_PUBLIC_R2_PUBLIC_BASE_URL=https://media.example.com` matching the **public** R2 bucket's HTTPS custom domain and rebuild the frontend. This variable is *not* an R2 API key or private bucket. Keep the current `NEXT_PUBLIC_BASE_URL` pointing at Express.

## QA checklist

Test logo/avatar replacement and page refresh; resume private access as applicant, authorized recruiter and unauthorized recruiter; PDF/DOCX size limits; chat attachments to existing conversations; invalid/expired permits; old Cloudinary image compatibility; mobile browser CORS and popup behavior; every affected screen's loading/error/empty states. Run `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`, then browser E2E testing with the backend and both R2 buckets configured.
