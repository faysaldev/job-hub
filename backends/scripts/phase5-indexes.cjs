#!/usr/bin/env node
/** Indexes only; preview by default. Back up DB and validate unique keys before apply. */
require('dotenv').config();
const mongoose=require('mongoose');
const models=[
  '../dist/domains/Billing/billing.plan.model.js',
  '../dist/domains/Billing/billing.account.model.js',
  '../dist/domains/Billing/billing.invoice.model.js',
  '../dist/domains/Billing/billing.credit.model.js',
  '../dist/domains/Billing/billing.promotion.model.js',
  '../dist/domains/Billing/billing.webhook.model.js',
  '../dist/domains/Billing/billing.reversal.model.js',
  '../dist/domains/Jobs/job.model.js',
  '../dist/domains/Company/company.model.js',
];
const apply=process.argv.includes('--apply');
(async()=>{
  if(!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');
  if(apply && process.env.PHASE5_CONFIRM_INDEXES!=='YES') throw new Error('Set PHASE5_CONFIRM_INDEXES=YES before --apply');
  await mongoose.connect(process.env.DATABASE_URL);
  for(const file of models){const Model=require(file).default;
    const indexes=Model.schema.indexes().map(([keys,options])=>({keys,options}));
    console.log(JSON.stringify({model:Model.modelName,mode:apply?'apply':'preview',indexes}));
    if(apply) await Model.createIndexes();}
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>mongoose.disconnect());
