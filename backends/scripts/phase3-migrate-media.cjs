#!/usr/bin/env node
/*
 * Safe, opt-in Cloudinary -> R2 data migration. Dry run by default; never
 * deletes Cloudinary objects or rewrites remote third-party resume URLs.
 * Run AFTER `pnpm build` and a verified database backup.
 */
const path = require("node:path");
const crypto = require("node:crypto");
require("dotenv").config({ path: path.resolve(__dirname, "../.env"), quiet: true });
const apply = process.argv.includes("--apply");
const limitFlag = process.argv.find((flag) => flag.startsWith("--limit="));
const maxRows = Number(limitFlag?.split("=")[1] || 25);
if (!Number.isSafeInteger(maxRows) || maxRows < 1 || maxRows > 2000) {
  console.error("Use --limit=1..2000"); process.exit(2);
}
if (apply && process.env.PHASE3_MIGRATION_APPROVED !== "yes") {
  console.error("Applying migrations requires PHASE3_MIGRATION_APPROVED=yes after backup and staging rehearsal");
  process.exit(2);
}
const mongoose = require("mongoose");
const Asset = require("../dist/domains/Asset/asset.model").default;
const User = require("../dist/domains/User/user.model").default;
const Company = require("../dist/domains/Company/company.model").default;
const Seeker = require("../dist/domains/Seeker/seeker.model").default;
const Application = require("../dist/domains/Applications/application.model").default;
const storage = require("../dist/domains/Asset/asset.storage");
const legacyFilter = /^https:\/\/res\.cloudinary\.com\//;
const types = {
  "image/jpeg": ["jpg", "avatar"], "image/png": ["png", "avatar"], "image/webp": ["webp", "avatar"],
  "application/pdf": ["pdf", "resume"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx", "resume"],
};
const getRows = async () => {
  const queries = [
    { collection: User, field: "image", kind: "avatar", ownerField: "_id" },
    { collection: Company, field: "companyLogo", kind: "company-logo", ownerField: "userId" },
    { collection: Seeker, field: "resume.resumeLink", kind: "resume", ownerField: "userId" },
    { collection: Application, field: "resume_url", kind: "resume", ownerField: "applicant" },
  ];
  const work = [];
  for (const q of queries) {
    if (work.length >= maxRows) break;
    const docs = await q.collection.find({ [q.field]: { $regex: "^https://res\\.cloudinary\\.com/" } })
      .select(`${q.field} ${q.ownerField}`).limit(maxRows - work.length).lean();
    for (const doc of docs) {
      const originalUrl = q.field.split(".").reduce((value, part) => value?.[part], doc);
      if (typeof originalUrl === "string" && legacyFilter.test(originalUrl)) {
        work.push({ ...q, id: doc._id.toString(), userId: String(doc[q.ownerField]), originalUrl });
      }
    }
  }
  return work;
};
const download = async (originalUrl, maximum) => {
  const uri = new URL(originalUrl);
  // Prevent SSRF and redirect-to-private-network attacks even if DB content is malicious.
  if (uri.protocol !== "https:" || uri.hostname !== "res.cloudinary.com" || uri.username || uri.password || uri.port) {
    throw new Error("Source is not an approved Cloudinary host");
  }
  const reply = await fetch(uri.toString(), { redirect: "error", signal: AbortSignal.timeout(15000) });
  if (!reply.ok || !reply.body) throw new Error(`Cloudinary returned ${reply.status}`);
  const type = (reply.headers.get("content-type") || "").split(";")[0].toLowerCase();
  if (!types[type]) throw new Error(`Unsupported remote content type: ${type}`);
  if (Number(reply.headers.get("content-length") || 0) > maximum) throw new Error("File exceeds limit");
  const reader = reply.body.getReader();
  let total = 0;
  const chunks = [];
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > maximum) throw new Error("File exceeds limit");
      chunks.push(Buffer.from(value));
    }
  } finally { await reader.cancel().catch(() => {}); }
  const buffer = Buffer.concat(chunks);
  if (!buffer.length) throw new Error("Empty file");
  const valid = type === "image/jpeg" ? buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])) :
    type === "image/png" ? buffer.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex")) :
    type === "image/webp" ? buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP" :
    type === "application/pdf" ? buffer.toString("ascii", 0, 5) === "%PDF-" :
    buffer.toString("hex", 0, 4) === "504b0304";
  if (!valid) throw new Error("Source signature mismatch");
  return { buffer, type, extension: types[type][0] };
};
const migrateOne = async (record) => {
  const maximum = record.kind === "resume" ? 10_000_000 : 5_000_000;
  const { buffer, type, extension } = await download(record.originalUrl, maximum);
  const bucket = storage.bucketFor(record.kind);
  const key = `${record.kind}/${record.userId}/${crypto.randomUUID()}.${extension}`;
  await storage.putBuffer(bucket, key, type, buffer);
  let asset;
  try {
    const meta = await storage.head(bucket, key);
    if (meta.ContentLength !== buffer.length) throw new Error("R2 verification failed");
    asset = await Asset.create({ owner: record.userId, kind: record.kind, status: "ready",
      visibility: record.kind === "resume" ? "private" : "public", bucket, key,
      fileName: `migrated-${record.id}.${extension}`, mimeType: type, size: buffer.length,
      legacyUrl: record.originalUrl });
    const newValue = record.kind === "resume" ? `asset:${asset._id}` : storage.publicAssetUrl(key);
    const outcome = await record.collection.updateOne({ _id: record.id, [record.field]: record.originalUrl },
      { $set: { [record.field]: newValue } });
    if (outcome.modifiedCount !== 1) throw new Error("Record changed while migrating; unchanged source preserved");
    return { id: record.id, type: record.kind, newValue };
  } catch (error) {
    if (asset) await Asset.deleteOne({ _id: asset._id }).catch(() => undefined);
    await storage.remove(bucket, key).catch(() => undefined);
    throw error;
  }
};
(async () => {
  await mongoose.connect(process.env.DATABASE_URL, { serverSelectionTimeoutMS: 15000 });
  try {
    const rows = await getRows();
    console.log(`Mode: ${apply ? "APPLY" : "DRY RUN"}; Cloudinary references found: ${rows.length}; limit: ${maxRows}`);
    if (!apply) { rows.forEach(({ collection, field, id }) => console.log(`Would migrate ${collection.modelName}.${field} ${id}`)); return; }
    let ok = 0, failed = 0;
    for (const row of rows) {
      try { const result = await migrateOne(row); console.log("MIGRATED", result.type, result.id); ok++; }
      catch (error) { console.error("SKIPPED", row.kind, row.id, error.message); failed++; }
    }
    console.log({ ok, failed, untouchedCloudinaryObjects: true });
    if (failed) process.exitCode = 1;
  } finally { await mongoose.disconnect(); }
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
