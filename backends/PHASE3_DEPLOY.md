# JobHub Phase 3 - R2, profiles, logos, resumes, and job banners

This is an **incremental patch over the Phase 1 + Phase 2 source**. Overlay the contents of the backend ZIP at the repository root. It does not contain credentials, node_modules, or a full codebase. No new public API route is introduced.

## Changes

- The existing `POST /assets/uploads` -> signed R2 `PUT` -> `POST /assets/uploads/:id/complete` flow now supports `job-banner`, with company-scoped ownership. `GET /assets/:id/access` remains the authorized private-read mechanism.
- Shared upload rules: public avatars/logos/banners accept JPEG/PNG/WebP up to **5 MB**; private PDF/DOCX resumes up to **10 MB**; document ZIP structure is checked for DOCX. Server confirms stored byte count, MIME and signature before a file is usable.
- `Job.bannerUrl` is an **optional** field; job create/edit/review and public search/home/company discovery project it. Published and staged draft jobs retain images. A ready banner from another company cannot be attached.
- Private resume URLs are stored as `asset:<objectId>`. The owner and recruiters who are authorized to access the relevant application can obtain a **60-second signed download URL**. Never expose the private bucket directly on a public custom domain.
- Multipart legacy `/assets/upload` is preserved for compatibility; new UIs upload directly to R2. Keep the existing `Asset.expiresAt` TTL index and `Asset.companyId` index; allow Mongoose to create indexes in a controlled maintenance window.

## Cloudflare configuration (required before production)

1. Configure **two separate buckets**: `R2_PUBLIC_BUCKET` for avatars/logos/banners, `R2_PRIVATE_BUCKET` for resumes/attachments. Never attach an `r2.dev` or custom public domain to the private bucket.
2. `R2_PUBLIC_BASE_URL` must be an HTTPS custom domain pointing to the public bucket. Configure a restricted R2 API token with object read/write permissions for both buckets (plus bucket metadata permissions if using the preflight script).
3. Add bucket CORS allowing **exact frontend origin(s)**, `PUT`, headers `Content-Type` and `If-None-Match` (or explicitly `*`) and optionally exposing `ETag`. Avoid wildcard origins on public production websites. Cloudflare dashboard JSON example (adjust origin):

```json
{
  "rules": [
    { "allowed": { "origins": ["https://jobhub.faysaldev.com"],
      "methods": ["PUT", "GET", "HEAD"],
      "headers": ["Content-Type", "If-None-Match"] },
      "expose_headers": ["ETag"], "max_age_seconds": 3600 }
  ]
}
```

4. Validate that public media URLs return images over HTTPS and that private objects cannot be downloaded anonymously. Do not log signed URLs, JWTs, credentials, or document contents.
5. Enable R2 object retention/cleanup procedures for orphaned uploads; Mongo's pending-asset TTL removes database records but **does not remove orphaned R2 objects**. Add malware scanning to your organization security workflow before broad public document intake; header/ZIP checks are *not* anti-malware scanning.

## Verification commands

```bash
cd backends
npm install
npm run phase1:auth-check
npm run phase2:check
npm run phase3:check
npm run phase6:source-audit
npm run typecheck
npm run build
# Only on a properly configured staging/deployment environment:
npm run phase3:r2-preflight
```

### Manual staging acceptance tests

- Fresh seeker: upload a valid JPEG/PNG/WebP photo, preview it, save profile, reload, and see it persisted. Retry wrong MIME, empty file, >5 MB, wrong file bytes, offline browser, and forbidden CORS.
- With a simulated R2 failure, profile text changes still save and the photo can be retried without losing those changes.
- Recruiter: upload and save a company logo. Confirm it appears on the company page and job listings after reload.
- Company job creator: upload a banner, save a draft, publish, edit and view the banner on home/search, company careers page, and job detail. Verify a different company cannot attach the banner (403).
- Seeker: upload PDF and DOCX resumes. Confirm invalid ZIP/DOCX, `.txt`, oversized, or renamed files are rejected clearly. Save profile and fetch a signed private URL using auth. Unrelated recruiter, anonymous visitor, and recruiter without application access must be denied.
- Confirm R2 presigned PUTs are content-type-bound and non-overwriting, and the signed URL cannot be replayed to overwrite a ready object during its 90-second TTL.

The supplied automated tests are offline/mocked and do not prove the deployed MongoDB, R2, browser CORS, TLS domain, malware scanning, or full frontend production build. Treat all live acceptance checks as blocking before launch.
