# Phase 3 API contracts (additive; existing job, user, company and payment routes remain)

All three new endpoints use the **existing** `Authorization: Bearer <access-token>` mechanism, including automatic refresh, and use the existing envelope `{code, status, message, data}`. No additional API was created for each file purpose. `Content-Type: application/json` on POST requests.

| Operation | Method/path | Request | `data` response |
| --- | --- | --- | --- |
| Create upload permit | `POST /api/v1/assets/uploads` | `{kind, fileName, mimeType, size}` | `{assetId,uploadUrl,method:"PUT",headers:{"Content-Type":type,"If-None-Match":"*"},expiresIn:90}` |
| Confirm direct upload | `POST /api/v1/assets/uploads/:id/complete` | No body | `{assetId,url,publicId,kind,fileName,mimeType,size}` |
| Open private document | `GET /api/v1/assets/:id/access` | None | `{url,expiresIn:60}` |
| Legacy image fallback | `POST /api/v1/assets/upload` | multipart `file` | Same completion `data` |

Accepted `kind` values: `avatar`, `company-logo`, `resume`, `attachment`. Images: PNG/JPEG/WebP, <= 5 MB. Resumes: PDF/DOCX <= 10 MB. Attachments: PNG/JPEG/WebP/PDF/DOCX <= 10 MB. Unsupported files are rejected. Only seekers may create `resume`, and only recruiters may create `company-logo`. User avatars and conversation attachments require authentication.

## Upload sequence

1. Call `POST /assets/uploads` with exact file MIME/type and size.
2. `PUT` file bytes **to the returned R2 URL**, copying the returned headers exactly; **do not send the application's bearer token or cookies to R2**. The URL expires after 90 seconds. Retry with a new permit if expired.
3. Call `POST /assets/uploads/:id/complete`; server checks R2 HEAD, exact size/MIME and first-byte signature, then changes status `pending` -> `ready`.
4. Save `data.url` to company/user profile or attach the private `asset:ID` reference to a seeker profile or application. Chat message `message:send` accepts `attachments: [assetId]` (up to 3) with text optional.
5. Open a private reference with `GET /assets/:id/access`; recruiter access requires an existing, non-withdrawn job application they own, and chat attachment access requires membership **and** the asset's presence on a message in that conversation. The signed read URL expires after 60 seconds. Never store this URL as a permanent database reference.

Public URLs have UUID-based immutable paths. Private object keys and bucket names are not exposed by the application response. HTTP validation/expiration/authorization errors use the existing error handler.

## Compatibility

- Existing `/api/v1/assets/upload` stays available for old image clients, now R2-backed.
- Existing `/users/update` multipart avatar support remains; new frontend uses JSON + direct R2.
- Existing `seeker.resume.resumeLink` and `application.resume_url` accept legacy HTTPS URLs or `asset:<24-hex-object-id>`; migrate legacy Cloudinary references in controlled batches.
- Stripe, Redis, user auth, job search routes, and Socket.IO event names remain unchanged.
- Existing profile and application fields are unchanged. Chat message responses now **also** include an optional `attachments[]` collection.
