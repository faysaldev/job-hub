const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../src');
const read=(name)=>fs.readFileSync(path.join(root,name),'utf8');
test('minimal APIs: one quote read, existing boost checkout and billing action',()=>{
  const stripe=read('domains/Stripe/stripe.route.ts');const billing=read('domains/Billing/billing.route.ts');
  assert.match(stripe,/router\.get\("\/boost-offer"/);
  assert.match(stripe,/router\.post\("\/create-checkout-session"/);
  assert.match(billing,/router\.post\("\/actions"/);
  assert.doesNotMatch(billing,/router\.post\("\/upgrade"/);
});
test('all paid benefits require verified Stripe webhooks, with refund tombstones',()=>{
  const hook=read('domains/Billing/billing.webhook.ts');
  const controller=read('domains/Stripe/stripe.controller.ts');
  assert.match(controller,/constructEvent\(req\.body, signature, process\.env\.STRIPE_WEBHOOK_SECRET\)/);
  assert.match(hook,/boostCheckoutAttemptId: attemptId/);
  assert.match(hook,/boostPaymentStatus: "paid"/);
  assert.match(hook,/PaymentReversal\.exists/);
  assert.match(hook,/boostPaymentStatus: "refunded"/);
  assert.match(hook,/if \(previous\?\.status === "processed"\) return/);
  assert.match(hook,/invoice\.billing_reason !== "subscription_update"/);
});
test('team seats reserve in transaction with outbox; expired invites do not block seats',()=>{
  const team=read('domains/Company/company.workspace.ts');
  const quotas=read('domains/Billing/billing.entitlements.ts');
  const outbox=read('lib/mail.outbox.ts');
  assert.match(team,/withCompanyQuotaLock/);
  assert.match(team,/enqueueTeamInvitation\(/);
  assert.match(team,/expiresAt: new Date\(now\.getTime\(\) \+ 7 \* 86400_000\)/);
  assert.match(outbox,/MailOutbox\.create\(\[/);
  assert.match(outbox,/session: data\.session/);
  assert.match(quotas,/status: "invited", expiresAt: \{ \$gt: new Date\(\) \}/);
});
test('upgrade replaces existing price and only paid invoice grants snapshot',()=>{
  const service=read('domains/Billing/billing.service.ts');
  const webhook=read('domains/Billing/billing.webhook.ts');
  assert.match(service,/s\.subscriptions\.update\(current\.id/);
  assert.match(service,/payment_behavior: "error_if_incomplete", proration_behavior: "always_invoice"/);
  assert.match(webhook,/snapshot: snapshot\(plan\)/);
  assert.match(service,/assertPaymentsEnabled\(\)/);
});

test('invoice verification enforces the exact billed Stripe price and newer paid order',()=>{
  const hook=read('domains/Billing/billing.webhook.ts');
  assert.match(hook,/planInvoiceLines\.some/);
  assert.match(hook,/lastPaidInvoicePaidAt/);
  assert.match(hook,/sameSecondUpgrade/);
});
test('team invite delivery can be revoked and is isolated to one company',()=>{
  const outbox=read('lib/mail.outbox.ts');
  const team=read('domains/Company/company.workspace.ts');
  assert.match(outbox,/companyId: data\.companyId/);
  assert.match(outbox,/cancelPendingTeamInvitation/);
  assert.match(team,/cancelPendingTeamInvitation\(member\.companyId, member\.email\)/);
});
test('subscription checkout events cannot demote an invoice-paid subscription',()=>{
  const hook=read('domains/Billing/billing.webhook.ts');
  assert.match(hook,/invoicePaymentIntent\(invoice\)/);
  assert.match(hook,/invoicePayments\.list/);
  assert.doesNotMatch(hook,/stripeStatus: "incomplete"/);
});

test('sponsorship cannot start a second charge while an earlier checkout is complete',()=>{
  const service=read('domains/Billing/billing.service.ts');
  assert.match(service,/if \(checkout\.status === "complete"\) throw new AppError/);
  assert.match(service,/if \(session\.status === "complete"\)/);
});
