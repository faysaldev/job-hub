#!/usr/bin/env node
/**
 * Read-only by default. Repair only *unambiguous* legacy issues after backup:
 * - Echnical Project Manager -> Technical Project Manager
 * - Both salary bounds 0 -> unspecified (unset), never invent an amount.
 * Other suspicious text (e.g. Vecgtor) is flagged for human review, not guessed.
 * --apply requires PHASE6_DATA_FIX_APPROVED=YES and a verified backup receipt.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { mkdirSync, openSync, writeSync, closeSync, writeFileSync } = require('node:fs');
const { verifyReceipt } = require('./phase6-backup-integrity.cjs');
const path = require('node:path');
const apply = process.argv.includes('--apply');
const allowed = process.env.PHASE6_DATA_FIX_APPROVED === 'YES';
const auditDir = path.resolve(process.env.PHASE6_AUDIT_DIR || './phase6-audit');
if (!process.env.DATABASE_URL) { console.error('DATABASE_URL required'); process.exit(2); }
if (apply && (!allowed || !process.env.PHASE6_BACKUP_RECEIPT)) {
  console.error('Apply refused. Require PHASE6_DATA_FIX_APPROVED=YES and PHASE6_BACKUP_RECEIPT pointing at a completed backup manifest.');
  process.exit(2);
}
const run = async () => {
  if (apply) {
    // Never modify production data against a missing or corrupted backup.
    const verified = await verifyReceipt(process.env.PHASE6_BACKUP_RECEIPT);
    console.log(`Verified backup before repair: ${verified.bytes} bytes; sha256=${verified.checksum}`);
  }
  mkdirSync(auditDir, { recursive: true, mode: 0o700 });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(auditDir, `job-data-${stamp}.jsonl`);
  const fd = openSync(reportPath, 'wx', 0o600);
  const counts = { reviewed: 0, oldTitle: 0, zeroSalary: 0, reviewNeeded: 0, changed: 0, skippedConcurrent: 0 };
  await mongoose.connect(process.env.DATABASE_URL, { serverSelectionTimeoutMS: 10000 });
  try {
    const jobs = mongoose.connection.db.collection('jobs');
    const filter = { $or: [
      { title: 'Echnical Project Manager' },
      { title: /Vecgtor/i },
      { salaryMin: 0, salaryMax: 0 },
      { salaryMin: { $lt: 0 } }, { salaryMax: { $lt: 0 } },
    ] };
    for await (const job of jobs.find(filter, { projection: { _id: 1, title: 1, salaryMin: 1, salaryMax: 1 } })) {
      counts.reviewed++;
      const changes = { $set: {}, $unset: {} };
      const notes = [];
      if (job.title === 'Echnical Project Manager') { changes.$set.title = 'Technical Project Manager'; counts.oldTitle++; }
      if (job.salaryMin === 0 && job.salaryMax === 0) {
        changes.$unset.salaryMin = ''; changes.$unset.salaryMax = ''; counts.zeroSalary++;
      }
      if (/Vecgtor/i.test(job.title || '') || (Number(job.salaryMin) < 0 || Number(job.salaryMax) < 0)) {
        notes.push('Manual review required; no safe automatic replacement'); counts.reviewNeeded++;
      }
      const record = { jobId: String(job._id), before: { title: job.title, salaryMin: job.salaryMin, salaryMax: job.salaryMax },
        proposed: { ...changes }, notes, mode: apply ? 'apply' : 'dry-run' };
      writeSync(fd, JSON.stringify(record) + '\n');
      if (apply && (Object.keys(changes.$set).length || Object.keys(changes.$unset).length)) {
        const update = {};
        if (Object.keys(changes.$set).length) update.$set = changes.$set;
        if (Object.keys(changes.$unset).length) update.$unset = changes.$unset;
        // A concurrent recruiter edit must win; do not overwrite their changes.
        const where = { _id: job._id, title: job.title,
          ...(job.salaryMin !== undefined ? { salaryMin: job.salaryMin } : { salaryMin: { $exists: false } }),
          ...(job.salaryMax !== undefined ? { salaryMax: job.salaryMax } : { salaryMax: { $exists: false } }) };
        const result = await jobs.updateOne(where, update);
        if (result.modifiedCount) counts.changed++;
        else counts.skippedConcurrent++;
      }
    }
  } finally {
    closeSync(fd);
    await mongoose.disconnect();
  }
  const summary = { ...counts, auditFile: reportPath, mode: apply ? 'apply' : 'dry-run',
    note: 'Keep this access-controlled audit for rollback. Manually approve brand-name corrections.' };
  writeFileSync(`${reportPath}.summary.json`, JSON.stringify(summary, null, 2), { mode: 0o600, flag: 'wx' });
  console.log(JSON.stringify(summary, null, 2));
  if (apply && counts.changed) console.warn('Public discovery caches can remain stale for up to 30 seconds; invalidate Redis jobhub:search:version after approved changes.');
};
run().catch(error => { console.error('Job data audit failed:', error.message); process.exitCode = 1; });
