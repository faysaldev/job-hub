#!/usr/bin/env node
/** Phase 4 read-only data preflight. Requires DATABASE_URL and installed dependencies. */
require("dotenv").config();
const mongoose = require("mongoose");
const fail = (name, data) => { console.error(`[FAIL] ${name}`, JSON.stringify(data)); process.exitCode = 2; };
(async () => {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  await mongoose.connect(process.env.DATABASE_URL);
  const db = mongoose.connection.db;
  const [careers, memberships, jobCount, orphaned, scheduled] = await Promise.all([
    db.collection("companies").aggregate([{ $match: { careersSlug: { $type: "string" } } },
      { $group: { _id: "$careersSlug", count: { $sum: 1 } } }, { $match: { count: { $gt: 1 } } }, { $limit: 10 }]).toArray(),
    db.collection("companymembers").aggregate([{ $match: { status: "active", userId: { $exists: true } } },
      { $group: { _id: "$userId", count: { $sum: 1 } } }, { $match: { count: { $gt: 1 } } }, { $limit: 10 }]).toArray(),
    db.collection("jobs").countDocuments(),
    db.collection("jobs").countDocuments({ author: { $exists: false } }),
    db.collection("jobs").countDocuments({ status: "scheduled", $or: [
      { publishAt: { $exists: false } }, { applicationDeadline: { $exists: false } }] }),
  ]);
  if (careers.length) fail("Duplicate careers slugs", careers);
  if (memberships.length) fail("Multiple active team memberships", memberships);
  if (orphaned) fail("Jobs without author", { count: orphaned });
  if (scheduled) fail("Invalid scheduled jobs", { count: scheduled });
  console.log(JSON.stringify({ mode: "read-only", jobs: jobCount, duplicateCareerSlugs: careers.length,
    duplicateActiveMemberships: memberships.length, missingJobAuthors: orphaned, invalidSchedules: scheduled,
    result: process.exitCode ? "REVIEW REQUIRED" : "PASS" }, null, 2));
})().catch(err => { console.error(err); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect(); });
