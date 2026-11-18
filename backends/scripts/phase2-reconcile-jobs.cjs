#!/usr/bin/env node
/**
 * Non-destructive quota reconciliation; default is read-only. Creates an audit
 * report; --apply only annotates missing legacy status on open listings, after
 * a backup and an explicit --acknowledge flag. Never changes a company's plan,
 * archives a listing or alters publication state of modern jobs.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('node:fs');
const path = require('node:path');
const apply = process.argv.includes('--apply');
if (apply && !process.argv.includes('--acknowledge')) {
  console.error('Refusing to write: use --apply --acknowledge after backing up MongoDB');
  process.exit(2);
}
const url = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
if (!url) { console.error('Provide the deployed MONGODB_URI (or MONGO_URI)'); process.exit(2); }
const fallbackFreeLimit = Number(process.env.PHASE2_FREE_JOB_LIMIT || 1);
async function main() {
  await mongoose.connect(url, { serverSelectionTimeoutMS: 10000 });
  const db = mongoose.connection.db;
  if (!db) throw new Error('MongoDB connection unavailable');
  const companies = db.collection('companies');
  const jobs = db.collection('jobs');
  const paid = db.collection('billingaccounts');
  const freePlan = await db.collection('billingplans').findOne({ key: 'free', isCurrent: true, published: true });
  const freeLimit = Number.isFinite(freePlan?.limits?.activeJobs) ? freePlan.limits.activeJobs : fallbackFreeLimit;
  const now = new Date();
  const report = [];
  let tagged = 0;
  for await (const company of companies.find({}, { projection: { _id: 1, userId: 1, companyName: 1 } })) {
    const criteria = { $or: [{ companyId: company._id }, { author: company.userId }],
      isDeleted: { $ne: true }, 'moderation.status': { $ne: 'blocked' },
      applicationDeadline: { $gt: now } };
    const slot = { ...criteria, $and: [{ $or: [
      { status: 'scheduled' }, { status: 'published', isActive: true }, { status: null, isActive: true },
    ] }] };
    const [count, totalPublished, legacy, account] = await Promise.all([
      jobs.countDocuments(slot), jobs.countDocuments({ ...criteria, status: { $in: ['published', null] } }),
      jobs.countDocuments({ ...criteria, status: null, isActive: true }),
      paid.findOne({ companyId: company._id }, { projection: { snapshot: 1, paidThrough: 1, stripeStatus: 1 } }),
    ]);
    const paidActive = account?.snapshot && account?.paidThrough > now && ['active','past_due'].includes(account.stripeStatus);
    const limit = paidActive ? account.snapshot.limits.activeJobs : freeLimit;
    if (legacy || count > limit) report.push({ companyId: String(company._id), name: company.companyName,
      quotaUsed: count, quotaLimit: limit, overage: Math.max(0, count - limit), publishedUnexpired: totalPublished, legacyPublishedWithoutStatus: legacy,
      action: count > limit ? 'Grandfather existing jobs; prohibit new reservations until below limit' : 'No quota correction required' });
    if (apply && legacy) {
      // Only normalize explicit legacy jobs. Status and visibility do not change.
      const result = await jobs.updateMany({ ...criteria, status: null, isActive: true }, { $set: { status: 'published' } });
      tagged += result.modifiedCount;
    }
  }
  const output = path.resolve(process.cwd(), `phase2-reconciliation-${new Date().toISOString().replace(/[:.]/g,'-')}.json`);
  fs.writeFileSync(output, JSON.stringify({ mode: apply ? 'apply' : 'dry-run', generatedAt: now.toISOString(), freePlanCapacity: freeLimit,
    note: 'Existing over-limit jobs remain published. No jobs are removed. Review overages with customer support.', tagged, companies: report }, null, 2));
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', affectedCompanies: report.length, legacyTagged: tagged, auditFile: output }));
}
main().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
