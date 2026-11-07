/** Read-only preflight for adding unique indexes to an existing database.
 * Usage: node scripts/phase1-data-preflight.cjs (run after pg? no; MongoDB only). */
require("dotenv").config();
const mongoose = require("mongoose");
const collections = [
  ["applications", { job_id: "$job_id", applicant: "$applicant" }],
  ["savedjobs", { userId: "$userId", jobId: "$jobId" }],
];
(async () => {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  await mongoose.connect(process.env.DATABASE_URL, { serverSelectionTimeoutMS: 10000 });
  let failures = 0;
  for (const [collection, id] of collections) {
    const exists = await mongoose.connection.db.listCollections({ name: collection }).toArray();
    if (!exists.length) { console.log(`${collection}: collection does not yet exist`); continue; }
    const duplicates = await mongoose.connection.db.collection(collection).aggregate([
      { $group: { _id: id, count: { $sum: 1 }, sampleIds: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } },
      { $limit: 20 },
      { $project: { sampleIds: { $slice: ["$sampleIds", 5] }, count: 1 } },
    ], { maxTimeMS: 30000 }).toArray();
    if (duplicates.length) {
      failures++;
      console.error(`${collection}: found ${duplicates.length} duplicate group(s). Reconcile after backup, before building unique indexes.`);
      console.error(JSON.stringify(duplicates, null, 2));
    } else console.log(`${collection}: no duplicate pairs in preflight`);
  }
  await mongoose.disconnect();
  if (failures) process.exitCode = 1;
})().catch((error) => { console.error(error.message); process.exitCode = 1;
  mongoose.disconnect().catch(() => {}); });
