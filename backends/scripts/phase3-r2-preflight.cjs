#!/usr/bin/env node
/** Read-only R2 deployment diagnostic. Does not upload files or log credentials. */
const { S3Client, HeadBucketCommand, GetBucketCorsCommand } = require("@aws-sdk/client-s3");
const required = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_PUBLIC_BUCKET", "R2_PRIVATE_BUCKET", "R2_PUBLIC_BASE_URL"];
const missing = required.filter(name => !process.env[name]?.trim());
if (missing.length) { console.error(`Missing R2 environment variables: ${missing.join(", ")}`); process.exit(2); }
const publicBucket = process.env.R2_PUBLIC_BUCKET;
const privateBucket = process.env.R2_PRIVATE_BUCKET;
if (publicBucket === privateBucket) { console.error("Public and private R2 buckets MUST differ"); process.exit(2); }
let domain;
try {
  domain = new URL(process.env.R2_PUBLIC_BASE_URL);
  if (domain.protocol !== "https:" || domain.username || domain.password || domain.search || domain.hash)
    throw Error("Invalid public domain");
} catch { console.error("R2_PUBLIC_BASE_URL must be a clean HTTPS URL"); process.exit(2); }
const client = new S3Client({ region: "auto", endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  forcePathStyle: true, requestChecksumCalculation: "WHEN_REQUIRED", responseChecksumValidation: "WHEN_REQUIRED",
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY } });
(async () => {
  let errors = 0;
  for (const bucket of [publicBucket, privateBucket]) {
    try { await client.send(new HeadBucketCommand({ Bucket: bucket })); console.log(`PASS R2 bucket reachable: ${bucket}`); }
    catch (error) { errors++; console.error(`FAIL R2 bucket ${bucket}: ${error.name || "access error"}. Verify credentials and bucket name.`); }
  }
  for (const bucket of [publicBucket, privateBucket]) {
    try {
      const result = await client.send(new GetBucketCorsCommand({ Bucket: bucket }));
      const allowed = result.CORSRules || [];
      console.log(`${bucket}: ${allowed.length} CORS rule(s)`);
      if (bucket === publicBucket && !allowed.some(rule =>
        rule.AllowedMethods?.includes("PUT") && rule.AllowedHeaders?.some(header => header === "*" || ["content-type", "if-none-match"].includes(header.toLowerCase()))))
        console.warn("WARN Public bucket may lack PUT and required request-header CORS permissions for browsers.");
    } catch (error) { console.warn(`WARN CORS could not be inspected on ${bucket} (${error.name || "error"}); verify rules in Cloudflare.`); }
  }
  try {
    const check = await fetch(`${domain.origin}/_jobhub_r2_preflight_${Date.now()}`, { method: "HEAD", signal: AbortSignal.timeout(8000) });
    if (check.status >= 500) { errors++; console.error(`FAIL Media domain returned HTTP ${check.status}`); }
    else console.log(`PASS Media HTTPS host reachable (HTTP ${check.status} on missing test object)`);
  } catch (error) { errors++; console.error("FAIL Media HTTPS domain unreachable or TLS invalid"); }
  console.log("MANUAL: confirm the private bucket has NO public domain or r2.dev exposure and CORS allows your exact frontend origin.");
  if (errors) process.exitCode = 1;
})().finally(() => client.destroy());
