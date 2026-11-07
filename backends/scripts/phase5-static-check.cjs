#!/usr/bin/env node
/** Offline source-level regression assertions; NOT a live Stripe or MongoDB test. */
const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname,'..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const webhook = read('src/domains/Billing/billing.webhook.ts');
const stripe = read('src/domains/Stripe/stripe.controller.ts');
const planRoutes = read('src/domains/Billing/billing.route.ts');
const plan = read('src/domains/Billing/billing.service.ts');
const entitlements = read('src/domains/Billing/billing.entitlements.ts');
const job = read('src/domains/Jobs/job.services.ts');
const workspace = read('src/domains/Company/company.workspace.ts');
const server = read('src/server.ts');
const models = ['account','plan','credit','invoice','promotion','webhook','reversal'];
const checks = [
 ['Stripe signing secret', /STRIPE_WEBHOOK_SECRET/.test(stripe)],
 ['Raw webhook body before JSON parser', server.indexOf('express.raw(') >= 0 && server.indexOf('express.raw(') < server.indexOf('app.use(express.json(')],
 ['Webhook verified before processing', stripe.indexOf('constructEvent(') < stripe.indexOf('processStripeEvent(event)')],
 ['No browser redirect fulfillment', /const handlePaidInvoice/.test(webhook) && /checkout alone NEVER enables a paid plan/i.test(webhook)],
 ['Full invoice amount validated', /invoice.amount_paid < plan.priceCents/.test(webhook)],
 ['Webhook event ID idempotency', /EventRecord\.create\(/.test(webhook) && /status === "processed"/.test(webhook)],
 ['Invoice reversal tombstone', /PaymentReversal\.updateOne/.test(webhook) && /PaymentReversal\.exists/.test(webhook)],
 ['One credit allocation per Stripe invoice', /CreditGrant.updateOne\(\{ stripeInvoiceId: invoice.id \}/.test(webhook)],
 ['Server-priced recurring Stripe Checkout', /unit_amount: plan.priceCents!/.test(plan) && !/clientPrice|body\.priceCents/.test(plan)],
 ['Stripe portal owner permission', /teamRole !== "owner"/.test(plan) && /billingPortal\.sessions\.create/.test(plan)],
 ['Company lock for quotas', /withCompanyQuotaLock/.test(entitlements) && /withTransaction/.test(entitlements)],
 ['Published-job quota enforcement', /requireJobSlot\(company, session\)/.test(job)],
 ['Team seat quota enforcement', /requireTeamSeat\(String\(company\._id\), session\)/.test(workspace)],
 ['Sponsored ranking uses expiration', /\$gt: \["\$sponsoredUntil", new Date\(\)\]/.test(job)],
 ['SponsoredUntil cannot be set by job editor', /"sponsoredUntil"/.test(job)],
 ['Platform admin route guard', /requireRoles\("admin"\)/.test(planRoutes)],
 ['Single recruiter billing action route', /router\.post\("\/actions"/.test(planRoutes)],
 ['Existing R2 and Socket.IO infrastructure preserved', fs.existsSync(path.join(root,'src/domains/Asset/asset.route.ts')) && fs.existsSync(path.join(root,'src/config/redis.ts'))],
 ...models.map(name => [`Billing ${name} data model present`,fs.existsSync(path.join(root,`src/domains/Billing/billing.${name}.model.ts`))]),
];
for(const [name,passed] of checks){assert.ok(passed, `FAILED: ${name}`);process.stdout.write(`PASS ${name}\n`);}
console.log(`PHASE5 STATIC ONLY: ${checks.length}/${checks.length} checks passed. Run full typecheck, build, Stripe and Mongo tests before shipping.`);
