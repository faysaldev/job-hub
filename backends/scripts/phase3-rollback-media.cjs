#!/usr/bin/env node
/* Restore Cloudinary DB references without deleting anything from either bucket. */
const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env"), quiet: true });
const apply = process.argv.includes("--apply");
const limitFlag = process.argv.find((v) => v.startsWith("--limit="));
const maxRows = Number(limitFlag?.split("=")[1] || 25);
if (!Number.isSafeInteger(maxRows) || maxRows < 1 || maxRows > 2000) {
  console.error("Use --limit=1..2000"); process.exit(2);
}
if (apply && process.env.PHASE3_ROLLBACK_APPROVED !== "yes") {
  console.error("Restore requires PHASE3_ROLLBACK_APPROVED=yes and a database backup"); process.exit(2);
}
const mongoose = require("mongoose");
const Asset = require("../dist/domains/Asset/asset.model").default;
const User = require("../dist/domains/User/user.model").default;
const Company = require("../dist/domains/Company/company.model").default;
const Seeker = require("../dist/domains/Seeker/seeker.model").default;
const Application = require("../dist/domains/Applications/application.model").default;
const storage = require("../dist/domains/Asset/asset.storage");
(async () => {
  if (!process.env.DATABASE_URL) throw Error("DATABASE_URL is required");
  await mongoose.connect(process.env.DATABASE_URL, { serverSelectionTimeoutMS: 15000 });
  try {
    // Fetch immutable storage keys, and use compare-and-swap on current DB value.
    const assets = await Asset.find({ legacyUrl: { $regex: "^https://res\\.cloudinary\\.com/" }, status: "ready" })
      .select("+key +legacyUrl").limit(maxRows).lean();
    let restored = 0, skipped = 0;
    for (const asset of assets) {
      const current = asset.kind === "resume" ? `asset:${asset._id}` : storage.publicAssetUrl(asset.key);
      const substitutions = asset.kind === "avatar" ? [
        [User, { _id: asset.owner, image: current }, "image"],
      ] : asset.kind === "company-logo" ? [
        [Company, { userId: asset.owner, companyLogo: current }, "companyLogo"],
      ] : asset.kind === "resume" ? [
        [Seeker, { userId: asset.owner, "resume.resumeLink": current }, "resume.resumeLink"],
        [Application, { applicant: asset.owner, resume_url: current }, "resume_url"],
      ] : [];
      let count = 0;
      for (const [Model, match, field] of substitutions) {
        if (apply) {
          const result = await Model.updateOne(match, { $set: { [field]: asset.legacyUrl } });
          count += result.modifiedCount;
        } else count += await Model.countDocuments(match);
      }
      if (count) { console.log(apply ? "RESTORED" : "WOULD RESTORE", asset.kind, asset._id.toString(), count); restored += count; }
      else { console.log("SKIPPED (DB value changed)", asset.kind, asset._id.toString()); skipped++; }
    }
    console.log({ mode: apply ? "APPLY" : "DRY RUN", restored, skipped, r2ObjectsDeleted: false, cloudinaryObjectsDeleted: false });
  } finally { await mongoose.disconnect(); }
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
