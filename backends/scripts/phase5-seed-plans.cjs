#!/usr/bin/env node
/** Additive, idempotent catalog seed. Does not overwrite customized plans. */
require('dotenv').config();
const mongoose = require('mongoose');
const Plan = require('../dist/domains/Billing/billing.plan.model.js').default;
const write = process.argv.includes('--apply');
const definitions = [
  { key:'free', name:'Free', description:'Start hiring with one published opportunity', priceCents:0,
    limits:{activeJobs:1,teamSeats:1,monthlyCredits:0},features:['Public company careers page'],enterprise:false },
  { key:'starter', name:'Starter',description:'Core recruitment for small teams',priceCents:1900,
    limits:{activeJobs:5,teamSeats:1,monthlyCredits:0},features:['Applicant tracking','Interview scheduling'],enterprise:false },
  { key:'growth',name:'Growth',description:'Collaborative hiring for growing companies',priceCents:5900,
    limits:{activeJobs:20,teamSeats:3,monthlyCredits:1},features:['Team access','1 sponsored placement credit / paid month'],enterprise:false },
  { key:'business',name:'Business',description:'More vacancies, teammates and reach',priceCents:14900,
    limits:{activeJobs:75,teamSeats:10,monthlyCredits:5},features:['Advanced team collaboration','5 sponsored placement credits / paid month'],enterprise:false },
  { key:'enterprise',name:'Enterprise',description:'Custom contract and tailored capacity',priceCents:null,
    limits:{activeJobs:100000,teamSeats:100000,monthlyCredits:0},features:['Dedicated contract and onboarding'],enterprise:true },
];
(async()=>{
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  if (write && process.env.PHASE5_CONFIRM_SEED !== 'YES') throw new Error('Set PHASE5_CONFIRM_SEED=YES before --apply');
  await mongoose.connect(process.env.DATABASE_URL);
  for(const plan of definitions){
    const present = await Plan.exists({key:plan.key});
    console.log(JSON.stringify({key:plan.key,action:present?'preserve existing':write?'insert v1':'would insert v1'}));
    if(write && !present) await Plan.create({...plan,version:1,currency:'usd',isCurrent:true,published:true});
  }
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>mongoose.disconnect());
