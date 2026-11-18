# JobHub Phase 3 frontend - updated files only

Apply on top of Phase 1 and Phase 2. Extract the ZIP at the repository root, preserving the `front-end/` prefix. The API paths are unchanged: asset initiate, signed PUT, confirm, and authorized access.

Changes: client file-type/size/signature preflight, specific upload errors, profile text save independent from photo, company-logo preview/retry, optional company-authorized job banner in create/edit/review, and banner display in home, search, company careers, and job detail pages. The resume picker states accepted PDF/DOCX formats and uses signed access for managed private files.

```bash
cd front-end
npm install
npm run phase1:session-test
npm run phase2:check
npm run phase3:check
npm run typecheck
npm run build
```

The frontend needs to reach the API over the configured `NEXT_PUBLIC_API_URL`. Your **Cloudflare R2 CORS** must include the exact deployed browser origin and allow `Content-Type` and `If-None-Match` on presigned `PUT` requests. Storage GETs for private documents are short-lived signed downloads, *not* public files. There is no frontend R2 key or secret. Test all uploads in a fresh authenticated browser session before deploying.

No full-browser E2E or live R2 upload was run in the artifact environment; only static and mocked local tests were available. Production release requires authentic end-to-end and build verification.
