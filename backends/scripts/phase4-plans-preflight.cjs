#!/usr/bin/env node
/* Read-only Phase 4 readiness audit. No customer, charge, or catalog writes. */
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const planPath = path.resolve(__dirname,'../dist/domains/Billing/billing.plan.model.js');

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  if (!fs.existsSync(planPath)) throw new Error('Build the backend first: npm run build');
  const key = process.env.STRIPE_SECRET_KEY || '';
  const mode = /^(sk|rk)_test_/.test(key) ? 'test' : /^(sk|rk)_live_/.test(key) ? 'live' : 'unconfigured';
  const allowLive = process.env.STRIPE_LIVE_PAYMENTS_ENABLED === 'true';
  const priceCents = Number(process.env.APPLICATION_BOOST_PRICE_CENTS || '0');
  const validPrice = Number.isSafeInteger(priceCents) && priceCents >= 50 && priceCents <= 100000;
  const usablePayments = mode === 'test' || (mode === 'live' && allowLive);
  const origin = (process.env.FRONTEND_URL || '').split(',')[0].trim();
  const originReady = origin.startsWith('https://') || (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost'));
  const checks = {
    stripeMode: mode, liveChargesEnabled: mode === 'live' && allowLive, frontendOriginConfigured: originReady,
    signedWebhooksConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    boostPriceCents: validPrice ? priceCents : null,
    boostReady: usablePayments && originReady && !!process.env.STRIPE_WEBHOOK_SECRET && validPrice,
  };
  await mongoose.connect(process.env.DATABASE_URL, { serverSelectionTimeoutMS: 5000 });
  const Plan = require(planPath).default;
  const plans = await Plan.find({ isCurrent: true, published: true }).select('key version name priceCents limits enterprise').lean();
  const duplicates = await Plan.aggregate([{$match:{isCurrent:true,published:true}},
    {$group:{_id:'$key',count:{$sum:1}}},{$match:{count:{$gt:1}}}]);
  const active = plans.filter(p => p.key !== 'free' && !p.enterprise && Number.isInteger(p.priceCents) && p.priceCents > 0);
  const seatUpgrade = active.some(p => p.limits?.teamSeats > 1);
  console.log(JSON.stringify({ checks, publishedPlans: plans.map(p=>({
    key:p.key,version:p.version,priceCents:p.priceCents,teamSeats:p.limits?.teamSeats,activeJobs:p.limits?.activeJobs,
  })), seatsUpgradeAvailable:seatUpgrade, duplicatePublishedKeys:duplicates },null,2));
  if (!checks.boostReady || !seatUpgrade || duplicates.length) {
    process.exitCode = 2;
    console.error('Phase 4 not ready: configure Stripe test mode and publish at least one multi-seat paid plan.');
  }
}
main().catch(err=>{ console.error('Phase 4 preflight failed:', err.message);process.exitCode=1; })
  .finally(async()=>{await mongoose.disconnect();});
