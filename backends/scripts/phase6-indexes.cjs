#!/usr/bin/env node
/** Preview by default; --apply requires PHASE6_INDEXES_APPROVED=YES. Never drops indexes. */
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('node:path');
const models = [
  'User/user.model', 'Company/company.model', 'Company/company.member.model', 'Jobs/job.model',
  'Applications/application.model', 'Interviews/interviews.model', 'Generals/contact.model',
  'Billing/billing.account.model', 'Billing/billing.invoice.model', 'Billing/billing.webhook.model',
  'Operations/operations.audit.model', 'Operations/operations.report.model',
];
const apply = process.argv.includes('--apply');
(async () => {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');
  if (apply && process.env.PHASE6_INDEXES_APPROVED !== 'YES') throw new Error('Set PHASE6_INDEXES_APPROVED=YES to apply');
  await mongoose.connect(process.env.DATABASE_URL);
  for (const name of models) {
    const model = require(path.resolve(__dirname, '../dist/domains', `${name}.js`)).default;
    const indexes = model.schema.indexes().map(([keys, options]) => ({ keys, unique: !!options.unique, sparse: !!options.sparse }));
    console.log(JSON.stringify({ model: model.modelName, mode: apply ? 'apply' : 'preview', indexes }));
    if (apply) await model.createIndexes();
  }
})().catch(error => { console.error('Index preflight failed:', error.message); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
