/** Applies only the indexes introduced by Phase 1; run after backups and preflight.
 * Usage: node scripts/phase1-build-indexes.cjs */
require("dotenv").config();
const mongoose = require("mongoose");
(async () => {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  await mongoose.connect(process.env.DATABASE_URL, { serverSelectionTimeoutMS: 10000 });
  const db = mongoose.connection.db;
  const indexes = [
    ["authsessions", { expiresAt: 1 }, { expireAfterSeconds: 0 }],
    ["authsessions", { userId: 1, revokedAt: 1, createdAt: -1 }, {}],
    ["applications", { job_id: 1, applicant: 1 }, { unique: true }],
    ["applications", { applicant: 1, createdAt: -1 }, {}],
    ["applications", { job_id: 1, status: 1, createdAt: -1 }, {}],
    ["applications", { stripeCheckoutSessionId: 1 }, { sparse: true }],
    ["savedjobs", { userId: 1, jobId: 1 }, { unique: true }],
    ["jobs", { author: 1, isDeleted: 1, createdAt: -1 }, {}],
    ["jobs", { isActive: 1, isDeleted: 1, createdAt: -1 }, {}],
    ["jobs", { category: 1, type: 1, locationType: 1 }, {}],
  ];
  for (const [name, fields, opts] of indexes) {
    console.log(`Creating/checking ${name} index ${JSON.stringify(fields)}`);
    await db.collection(name).createIndex(fields, opts);
  }
  await mongoose.disconnect();
  console.log("Phase 1 index creation finished");
})().catch((error) => { console.error(error.message); process.exitCode = 1;
  mongoose.disconnect().catch(() => {}); });
