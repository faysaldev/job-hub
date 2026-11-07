#!/usr/bin/env node
/* Apply only additive indexes. NEVER drop existing indexes or alter documents. */
require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const names = ["Asset/asset", "Jobs/job", "Company/company", "Seeker/seeker",
  "Applications/application", "SavedJobs/savedjob", "Messages/message", "Conversations/conversations"];
(async () => {
  if (process.env.PHASE3_INDEXES_APPROVED !== "yes") throw Error("Set PHASE3_INDEXES_APPROVED=yes after reviewing existing index state");
  await mongoose.connect(process.env.DATABASE_URL, { serverSelectionTimeoutMS: 15000 });
  try {
    for (const name of names) {
      const file = name.split("/")[1] + ".model";
      const model = require(`../dist/domains/${name.split("/")[0]}/${file}`).default;
      const indexes = await model.createIndexes();
      console.log(`${model.modelName}:`, indexes);
    }
  } finally { await mongoose.disconnect(); }
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
