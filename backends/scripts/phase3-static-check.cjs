#!/usr/bin/env node
/* Dependency-free, source-level guardrails only. NOT a replacement for tests. */
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const get = (file) => fs.readFileSync(path.resolve(root, file), "utf8");
const tests = [
  ["R2 client, no Cloudinary SDK", () => get("src/domains/Asset/asset.storage.ts").includes("@aws-sdk/client-s3") && !get("package.json").includes('"cloudinary"')],
  ["Distinct public/private R2 buckets", () => get("src/domains/Asset/asset.storage.ts").includes("publicBucket === privateBucket")],
  ["Private key not selected by default", () => get("src/domains/Asset/asset.model.ts").includes("select: false")],
  ["Upload signed, immutable, bounded TTL", () => get("src/domains/Asset/asset.storage.ts").includes('IfNoneMatch: "*"') && get("src/domains/Asset/asset.storage.ts").includes("expiresIn: 90")],
  ["Upload confirmed by R2 object size, MIME and magic", () => ["await head(", "firstBytes(", "matchesSignature(", "ContentLength", "ContentType"].every((t) => get("src/domains/Asset/asset.services.ts").includes(t))],
  ["Private read endpoint requires auth", () => get("src/domains/Asset/asset.route.ts").includes("router.use(authMiddleware)") && get("src/domains/Asset/asset.route.ts").includes('router.get("/:id/access"')],
  ["Resume authorization checks job ownership", () => get("src/domains/Asset/asset.services.ts").includes("Application.distinct") && get("src/domains/Asset/asset.services.ts").includes("author: actorId")],
  ["Message authorization checks membership and reference", () => get("src/domains/Asset/asset.services.ts").includes("Conversation.exists") && get("src/domains/Asset/asset.services.ts").includes('"attachments.assetId"')],
  ["Optional Socket.IO Redis adapter with verified session", () => get("src/config/socketio.ts").includes("SOCKET_REDIS_ADAPTER") && get("src/config/socketio.ts").includes("verifyAccess")],
  ["Migrations require opt-in", () => get("scripts/phase3-migrate-media.cjs").includes('PHASE3_MIGRATION_APPROVED !== "yes"')],
  ["Migrations keep Cloudinary files", () => get("scripts/phase3-migrate-media.cjs").includes("untouchedCloudinaryObjects: true")],
  ["Rollback requires opt-in and CAS", () => get("scripts/phase3-rollback-media.cjs").includes('PHASE3_ROLLBACK_APPROVED !== "yes"') && get("scripts/phase3-rollback-media.cjs").includes("await Model.updateOne(match")],
  ["Index builder cannot drop indexes", () => !/\.dropIndexes?\s*\(/.test(get("scripts/phase3-build-indexes.cjs"))],
  ["No Redis KEYS scan in search cache", () => !/redis\.(?:keys|scan)\s*\(/.test(get("src/domains/Jobs/job.services.ts"))],
  ["Applications verify uploaded resumes", () => get("src/domains/Applications/application.services.ts").includes("await assertOwnedResume")],
];
let passed = 0;
for (const [name, run] of tests) {
  const okay = Boolean(run());
  console.log(`${okay ? "PASS" : "FAIL"} ${name}`);
  if (okay) passed++;
}
console.log(`${passed}/${tests.length} static checks passed (source checks, not integration tests)`);
if (passed !== tests.length) process.exitCode = 1;
