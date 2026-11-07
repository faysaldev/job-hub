#!/usr/bin/env node
/**
 * Explicit opt-in, integration smoke test. Creates two tiny test objects.
 * Run only against a configured staging environment with dedicated test accounts.
 * Requires Node 20+ built-in fetch; never prints bearer tokens or signed URLs.
 */
if (process.env.PHASE3_LIVE_TEST_APPROVED !== "yes") {
  console.error("Set PHASE3_LIVE_TEST_APPROVED=yes to create test objects in R2 staging");
  process.exit(2);
}
const base = (process.env.TEST_API_BASE || "").replace(/\/+$/, "");
const seeker = process.env.TEST_SEEKER_TOKEN || "";
const recruiter = process.env.TEST_RECRUITER_TOKEN || "";
if (!/^https?:\/\//.test(base) || !seeker || !recruiter) {
  console.error("Provide TEST_API_BASE (ending /api/v1), TEST_SEEKER_TOKEN and TEST_RECRUITER_TOKEN");
  process.exit(2);
}
const pdf = Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<<>>\n%%EOF\n");
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==", "base64");
const authRequest = async (path, token, method = "GET", body) => {
  const headers = { Authorization: `Bearer ${token}` };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const result = await fetch(`${base}${path}`, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  const json = await result.json().catch(() => ({}));
  return { code: result.status, data: json?.data, message: json?.message || "Unexpected response" };
};
const required = (ok, message) => { if (!ok) throw Error(message); };
const upload = async (kind, name, mimeType, buffer) => {
  const init = await authRequest("/assets/uploads", seeker, "POST", { kind, fileName: name, mimeType, size: buffer.length });
  required(init.code === 201 && init.data?.uploadUrl && init.data?.assetId, `Upload initiate failed: ${init.code}: ${init.message}`);
  // No Authorization header is forwarded to signed storage requests.
  const sent = await fetch(init.data.uploadUrl, { method: "PUT", headers: init.data.headers, body: buffer });
  required(sent.ok, `Signed PUT failed: ${sent.status}`);
  const done = await authRequest(`/assets/uploads/${init.data.assetId}/complete`, seeker, "POST");
  required(done.code === 200 && done.data?.url, `Upload confirmation failed: ${done.code}: ${done.message}`);
  return done.data;
};
(async () => {
  console.log("PHASE 3 R2 staging integration smoke (test-only files will remain; cleanup via R2 lifecycle policy)");
  const cv = await upload("resume", "phase3-smoke.pdf", "application/pdf", pdf);
  required(/^asset:[a-f0-9]{24}$/i.test(cv.url), "Private upload exposed a public URL");
  const id = cv.url.slice(6);
  const mine = await authRequest(`/assets/${id}/access`, seeker);
  required(mine.code === 200 && mine.data?.expiresIn <= 60, "Owner cannot request temporary download");
  const signedDownload = await fetch(mine.data.url);
  required(signedDownload.ok && Buffer.from(await signedDownload.arrayBuffer()).equals(pdf), "Private signed read failed");
  console.log("PASS owner can upload and download private PDF");
  const other = await authRequest(`/assets/${id}/access`, recruiter);
  required([403, 404].includes(other.code), `Unrelated recruiter could read private resume (${other.code})`);
  const anonymous = await fetch(`${base}/assets/${id}/access`);
  required([401, 403].includes(anonymous.status), `Anonymous user could read private resume (${anonymous.status})`);
  console.log("PASS unrelated recruiter + anonymous viewer denied");
  const avatar = await upload("avatar", "phase3-smoke.png", "image/png", png);
  required(avatar.url.startsWith("https://") && !avatar.url.includes("asset:"), "Public avatar URL is invalid");
  console.log("PASS public PNG direct upload + confirmation", avatar.assetId);
  console.log("PASS Phase 3 limited live smoke. Full cross-user workflows, frontend CORS and malware scanning require separate tests.");
})().catch((error) => { console.error("FAIL", error.message); process.exitCode = 1; });
