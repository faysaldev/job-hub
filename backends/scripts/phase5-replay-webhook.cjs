#!/usr/bin/env node
/** Operator-only: replay a known failed event after fixing configuration. */
require('dotenv').config();
const mongoose=require('mongoose');
const Stripe=require('stripe');
const {processStripeEvent}=require('../dist/domains/Billing/billing.webhook.js');
const key=process.argv.find(a=>a.startsWith('--event='))?.split('=')[1];
(async()=>{
  if(!process.env.STRIPE_SECRET_KEY||!process.env.DATABASE_URL||!key||!/^evt_[A-Za-z0-9]+$/.test(key))throw new Error('STRIPE_SECRET_KEY, DATABASE_URL and --event=evt_... required');
  if(process.env.PHASE5_CONFIRM_REPLAY!=='YES')throw new Error('Set PHASE5_CONFIRM_REPLAY=YES to approve webhook replay');
  await mongoose.connect(process.env.DATABASE_URL);
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
  const event=await stripe.events.retrieve(key);
  await processStripeEvent(event);
  console.log('Replay processed',event.id,event.type);
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>mongoose.disconnect());
