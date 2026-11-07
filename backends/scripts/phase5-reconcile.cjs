#!/usr/bin/env node
/** Preview or repair active sponsoredUntil values from the verified promotion ledger.
 * Only touches jobs that already have Phase 5 JobPromotion records. */
require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('../dist/domains/Jobs/job.model.js').default;
const Promotion = require('../dist/domains/Billing/billing.promotion.model.js').default;
const apply = process.argv.includes('--apply');
(async () => {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');
  if (apply && process.env.PHASE5_CONFIRM_RECONCILE !== 'YES')
    throw new Error('Set PHASE5_CONFIRM_RECONCILE=YES before --apply');
  await mongoose.connect(process.env.DATABASE_URL);
  const now = new Date();
  const groups = await Promotion.aggregate([
    { $match: { status: 'active', endsAt: { $gt: now } } },
    { $group: { _id: '$jobId', lastEnd: { $max: '$endsAt' } } },
  ]);
  const want = new Map(groups.map(x => [String(x._id), x.lastEnd]));
  // Include jobs with old/incorrect values even when no promotion is still active.
  const known = await Promotion.distinct('jobId');
  let mismatched = 0;
  for (const jobId of known) {
    const doc = await Job.findById(jobId).select('sponsoredUntil').lean();
    if (!doc) continue;
    const current = doc.sponsoredUntil ? new Date(doc.sponsoredUntil).getTime() : 0;
    const desired = want.get(String(jobId));
    if (current === (desired ? desired.getTime() : 0)) continue;
    mismatched++;
    console.log(JSON.stringify({ jobId: String(jobId), current: doc.sponsoredUntil || null,
      desired: desired || null, action: apply ? 'repair' : 'preview' }));
    if (apply) await Job.updateOne({ _id: jobId }, desired ?
      { $set: { sponsoredUntil: desired } } : { $unset: { sponsoredUntil: '' } });
  }
  if (apply && mismatched) {
    try {
      const Redis = require('ioredis');
      const redis = new Redis(process.env.REDIS_URL || {
        host: process.env.REDIS_HOST || 'localhost', port: Number(process.env.REDIS_PORT || 6379),
        lazyConnect: false, connectTimeout: 2500, maxRetriesPerRequest: 0,
      });
      try { await redis.incr('jobhub:search:version'); }
      finally { redis.disconnect(); }
    } catch (error) { console.error('Redis invalidation skipped; cached search expires within 60 seconds:', error.message); }
  }
  console.log(JSON.stringify({ checkedJobs: known.length, mismatched, applied: apply }));
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => mongoose.disconnect());
