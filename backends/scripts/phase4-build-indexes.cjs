#!/usr/bin/env node
/** Explicit, additive index rollout; NEVER drops old indexes or changes documents. */
require("dotenv").config();
const mongoose = require("mongoose");
const models = [
  "../dist/domains/Company/company.model.js",
  "../dist/domains/Company/company.member.model.js",
  "../dist/domains/Jobs/job.model.js",
  "../dist/domains/Applications/application.model.js",
  "../dist/domains/Interviews/interviews.model.js",
  "../dist/domains/Seeker/seeker.model.js",
  "../dist/domains/SavedJobs/savedsearch.model.js",
];
const apply = process.argv.includes("--apply");
(async () => {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL required; never run against an unspecified database");
  if (apply && process.env.PHASE4_CONFIRM_INDEXES !== "YES")
    throw new Error("Set PHASE4_CONFIRM_INDEXES=YES to explicitly approve index creation");
  await mongoose.connect(process.env.DATABASE_URL);
  for (const file of models) {
    const model = require(file).default;
    const definitions = model.schema.indexes().map(([keys, options]) => ({ keys, options }));
    console.log(JSON.stringify({ model: model.modelName, action: apply ? "createIndexes" : "preview", definitions }));
    if (apply) await model.createIndexes();
  }
  console.log(apply ? "Indexes created/verified without dropping existing indexes" : "Preview only; rerun with --apply after backup and preflight");
})().catch(err => { console.error(err); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect(); });
