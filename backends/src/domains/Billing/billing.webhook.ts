import Stripe from "stripe";
import mongoose from "mongoose";
import EventRecord from "./billing.webhook.model";
import BillingAccount from "./billing.account.model";
import BillingPlan from "./billing.plan.model";
import BillingInvoice from "./billing.invoice.model";
import CreditGrant from "./billing.credit.model";
import JobPromotion from "./billing.promotion.model";
import PaymentReversal from "./billing.reversal.model";
import Application from "../Applications/application.model";
import { fulfillPromotionCheckout, snapshot } from "./billing.service";
import { AppError } from "../../lib/errors";
import { assertId } from "../../lib/query";

const s = () => new Stripe(process.env.STRIPE_SECRET_KEY!);
const id = (value: string) => new mongoose.Types.ObjectId(assertId(value));
const stripeId = (reference: unknown): string | null => typeof reference === "string" ? reference :
  typeof reference === "object" && reference !== null && "id" in reference ? String((reference as { id: string }).id) : null;
const invoiceSubId = (invoice: Stripe.Invoice): string | null => {
  const item = invoice as any;
  return stripeId(item.parent?.subscription_details?.subscription) || stripeId(item.subscription);
};

const handlePaidInvoice = async (invoice: Stripe.Invoice) => {
  if (invoice.status !== "paid" || (invoice as any).paid_out_of_band === true || invoice.amount_paid <= 0) return;
  const subscriptionId = invoiceSubId(invoice);
  if (!subscriptionId) return;
  const subscription = await s().subscriptions.retrieve(subscriptionId);
  const { company_id: companyId, plan_id: planId, type } = subscription.metadata || {};
  if (type !== "recruiter_subscription" || !companyId || !planId ||
    !mongoose.isValidObjectId(companyId) || !mongoose.isValidObjectId(planId)) return;
  const plan = await BillingPlan.findById(planId);
  if (!plan || plan.enterprise || plan.priceCents === null || !plan.priceCents) throw new AppError("Unknown subscription plan", 422);
  const paymentIntentId = stripeId((invoice as any).payment_intent) ||
    stripeId((invoice as any).payments?.data?.find((p: any) => p.payment?.type === "payment_intent")?.payment?.payment_intent);
  // Refunds/disputes can reach us before the invoice webhook. Never re-enable
  // a charged-back subscription just because Stripe delivers events out of order.
  if (paymentIntentId && await PaymentReversal.exists({ stripePaymentIntentId: paymentIntentId })) return;
  const price = subscription.items.data[0]?.price;
  if (!price || subscription.items.data.length !== 1 || subscription.items.data[0].quantity !== 1 ||
    price.unit_amount !== plan.priceCents || price.currency !== "usd" ||
    price.recurring?.interval !== "month" || invoice.currency !== "usd" ||
    invoice.amount_paid < plan.priceCents)
    throw new AppError("Stripe subscription does not match the server plan", 422);
  if (!["active", "past_due"].includes(subscription.status)) return;
  const customerId = stripeId(subscription.customer);
  if (!customerId || customerId !== stripeId(invoice.customer)) throw new AppError("Invoice customer mismatch", 422);
  // A refunded or disputed invoice must never re-grant benefits on a duplicate
  // or out-of-order Stripe webhook. The refund ledger is authoritative.
  if (await BillingInvoice.exists({ stripeInvoiceId: invoice.id, reversedAt: { $exists: true } })) return;
  const account = await BillingAccount.findOne({ companyId: id(companyId) });
  if (account?.stripeCustomerId && account.stripeCustomerId !== customerId) throw new AppError("Customer ownership mismatch", 422);
  if (account?.stripeSubscriptionId && account.stripeSubscriptionId !== subscriptionId &&
    account.stripeStatus !== "canceled" && account.stripeStatus !== "incomplete_expired")
    throw new AppError("Another subscription is attached to this company", 422);
  const rawEnd = (subscription.items.data[0] as any)?.current_period_end ||
    (invoice.lines?.data?.[0] as any)?.period?.end;
  if (!Number.isFinite(rawEnd) || rawEnd * 1000 <= Date.now())
    throw new AppError("Invoice does not cover a current subscription period", 422);
  const end = new Date(rawEnd * 1000);
  // Out-of-order older renewals must never replace a newer paid period.
  if (account?.paidThrough && account.paidThrough.getTime() > end.getTime()) return;
  const paidAt = new Date(((invoice as any).status_transitions?.paid_at || invoice.created) * 1000);
  // All side effects share an idempotent invoice ID; an event retry cannot award two grants.
  const accountChange = await BillingAccount.updateOne({ companyId: id(companyId),
    $or: [{ paidThrough: { $lte: end } }, { paidThrough: { $exists: false } }] },
    { $set: { companyId: id(companyId), stripeCustomerId: customerId, stripeSubscriptionId: subscriptionId,
      stripeStatus: subscription.status, cancelAtPeriodEnd: subscription.cancel_at_period_end,
      snapshot: snapshot(plan), paidThrough: end, lastPaidInvoiceId: invoice.id },
      $unset: { checkoutPendingUntil: "", pendingCheckoutSessionId: "" } }, { upsert: !account });
  if (!accountChange.matchedCount && !accountChange.upsertedCount) return;
  await BillingInvoice.updateOne({ stripeInvoiceId: invoice.id }, { $setOnInsert: {
    companyId: id(companyId), stripeInvoiceId: invoice.id, stripeSubscriptionId: subscriptionId,
    amountPaidCents: invoice.amount_paid || 0, currency: invoice.currency,
    stripePaymentIntentId: paymentIntentId || undefined,
    invoiceUrl: invoice.hosted_invoice_url || undefined, paidAt, periodEnd: end,
    planKey: plan.key, planVersion: plan.version,
  } }, { upsert: true });
  if (plan.limits.monthlyCredits > 0) await CreditGrant.updateOne({ stripeInvoiceId: invoice.id }, { $setOnInsert: {
    companyId: id(companyId), stripeInvoiceId: invoice.id, total: plan.limits.monthlyCredits,
    remaining: plan.limits.monthlyCredits, expiresAt: end,
  } }, { upsert: true });
};

const handleCheckout = async (session: Stripe.Checkout.Session) => {
  if (session.mode === "payment" && session.payment_status === "paid") {
    if (session.metadata?.type === "job_promotion") return fulfillPromotionCheckout(session);
    if (session.metadata?.type === "application_boost") {
      const appId = session.metadata.application_id, userId = session.metadata.user_id;
      if (!appId || !userId || !mongoose.isValidObjectId(appId) || !mongoose.isValidObjectId(userId) ||
        session.currency !== "usd" || !Number.isSafeInteger(session.amount_total)) return;
      await Application.updateOne({ _id: id(appId), applicant: id(userId), stripeCheckoutSessionId: session.id,
        boostPriceCents: session.amount_total, boostPaymentStatus: "pending" },
        { $set: { boostPaymentStatus: "paid", paid_amount: (session.amount_total || 0)/100 } });
    }
  }
  if (session.mode === "subscription" && session.metadata?.type === "recruiter_subscription") {
    const companyId = session.metadata.company_id;
    if (!companyId || !mongoose.isValidObjectId(companyId)) return;
    const customer = stripeId(session.customer);
    if (!customer) return;
    const subscriptionId = stripeId(session.subscription);
    await BillingAccount.updateOne({ companyId: id(companyId), pendingCheckoutSessionId: session.id,
      $or: [{ stripeCustomerId: customer }, { stripeCustomerId: { $exists: false } }] },
      { $set: { stripeCustomerId: customer, ...(subscriptionId ? { stripeSubscriptionId: subscriptionId,
          stripeStatus: "incomplete" } : {}) },
        $unset: { checkoutPendingUntil: "", pendingCheckoutSessionId: "" } });
    // Checkout alone NEVER enables a paid plan; only verified invoice.paid does.
  }
};

const handleSubscription = async (source: Stripe.Subscription) => {
  const companyId = source.metadata?.company_id;
  if (!companyId || !mongoose.isValidObjectId(companyId)) return;
  const account = await BillingAccount.findOne({ companyId: id(companyId), stripeSubscriptionId: source.id });
  if (!account) return;
  // Always retrieve Stripe's current status: webhook ordering is not guaranteed.
  const latest = await s().subscriptions.retrieve(source.id);
  const customer = stripeId(latest.customer);
  if (account.stripeCustomerId !== customer) throw new AppError("Subscription customer mismatch", 422);
  await BillingAccount.updateOne({ _id: account._id, stripeSubscriptionId: source.id },
    { $set: { stripeStatus: latest.status, cancelAtPeriodEnd: latest.cancel_at_period_end } });
};

const handleFailure = async (invoice: Stripe.Invoice) => {
  const subscription = invoiceSubId(invoice);
  if (!subscription) return;
  await BillingAccount.updateOne({ stripeSubscriptionId: subscription,
    stripeCustomerId: stripeId(invoice.customer) }, { $set: { stripeStatus: "past_due" } });
  // Access remains bounded by paidThrough; a failed invoice never grants a fresh period.
};

/** Reverse benefits for a full refund or disputed charge; the event is signature-verified upstream. */
const reversePayment = async (paymentIntentId: string) => {
  await PaymentReversal.updateOne({ stripePaymentIntentId: paymentIntentId },
    { $setOnInsert: { stripePaymentIntentId: paymentIntentId, observedAt: new Date() } }, { upsert: true });
  const invoice = await BillingInvoice.findOne({ stripePaymentIntentId: paymentIntentId });
  if (invoice && !invoice.get("reversedAt")) {
    await BillingInvoice.updateOne({ _id: invoice._id, reversedAt: { $exists: false } }, { $set: { reversedAt: new Date() } });
    const grant = await CreditGrant.findOneAndUpdate({ stripeInvoiceId: invoice.get("stripeInvoiceId") },
      { $set: { remaining: 0, expiresAt: new Date() } }, { new: true });
    if (grant) {
      const activeCreditPromos = await JobPromotion.find({ creditGrantId: grant._id, status: "active" });
      for (const promo of activeCreditPromos) {
        await JobPromotion.updateOne({ _id: promo._id, status: "active" }, { $set: { status: "reversed" } });
      }
      // Recompute all affected jobs below, alongside refunded direct sponsorships.
      for (const promo of activeCreditPromos) {
        const remaining = await JobPromotion.find({ jobId: promo.jobId, status: "active", endsAt: { $gt: new Date() } })
          .sort({ endsAt: -1 }).limit(1).lean();
        const Job = (await import("../Jobs/job.model")).default;
        await Job.updateOne({ _id: promo.jobId }, remaining[0]?.endsAt ?
          { $set: { sponsoredUntil: remaining[0].endsAt } } : { $unset: { sponsoredUntil: "" } });
      }
      if (activeCreditPromos.length) try {
        const redis = (await import("../../config/redis")).default;
        await redis.incr("jobhub:search:version");
      } catch { /* cache TTL bounds stale results */ }
    }
    // A reversal of a previous period must not disable a newer successfully paid period.
    await BillingAccount.updateOne({ companyId: invoice.get("companyId"),
      lastPaidInvoiceId: invoice.get("stripeInvoiceId") },
      { $set: { stripeStatus: "unpaid", paidThrough: new Date() } });
  }
  const sessions = await s().checkout.sessions.list({ payment_intent: paymentIntentId, limit: 5 });
  for (const checkout of sessions.data) {
    if (checkout.metadata?.type !== "job_promotion") continue;
    const affected = await JobPromotion.findOneAndUpdate({ stripeCheckoutSessionId: checkout.id,
      status: "active" }, { $set: { status: "reversed" } }, { new: true });
    if (!affected) continue;
    const stillActive = await JobPromotion.find({ jobId: affected.jobId, status: "active",
      endsAt: { $gt: new Date() } }).sort({ endsAt: -1 }).limit(1).lean();
    const Job = (await import("../Jobs/job.model")).default;
    await Job.updateOne({ _id: affected.jobId }, stillActive[0]?.endsAt ?
      { $set: { sponsoredUntil: stillActive[0].endsAt } } : { $unset: { sponsoredUntil: "" } });
    try { const redis = (await import("../../config/redis")).default; await redis.incr("jobhub:search:version"); }
    catch { /* cache TTL protects availability */ }
  }
};

export const processStripeEvent = async (event: Stripe.Event) => {
  const now = new Date();
  const leaseUntil = new Date(Date.now() + 5 * 60_000);
  try {
    await EventRecord.create({ _id: event.id, type: event.type, status: "processing", lockedUntil: leaseUntil });
  } catch (error: any) {
    if (error?.code !== 11000) throw error;
    const previous = await EventRecord.findById(event.id);
    if (previous?.status === "processed") return;
    if (previous?.status === "processing" && previous.lockedUntil && previous.lockedUntil > now)
      throw new AppError("Stripe event is already being processed; retry delivery", 503);
    const claimed = await EventRecord.findOneAndUpdate({ _id: event.id, $or: [
      { status: "failed" }, { lockedUntil: { $lte: now } }] },
      { $set: { status: "processing", lockedUntil: leaseUntil, lastError: "" }, $inc: { attempts: 1 } }, { new: true });
    if (!claimed) throw new AppError("Stripe event locked, retry delivery", 503);
  }
  try {
    if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type))
      await handleCheckout(event.data.object as Stripe.Checkout.Session);
    else if (["invoice.paid", "invoice.payment_succeeded"].includes(event.type))
      await handlePaidInvoice(event.data.object as Stripe.Invoice);
    else if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      if (charge.refunded && charge.amount_refunded >= charge.amount) {
        const pi = stripeId(charge.payment_intent);
        if (pi) await reversePayment(pi);
      }
    } else if (event.type === "charge.dispute.created") {
      const dispute = event.data.object as Stripe.Dispute;
      const pi = stripeId(dispute.payment_intent);
      if (pi) await reversePayment(pi);
    }
    else if (event.type === "invoice.payment_failed")
      await handleFailure(event.data.object as Stripe.Invoice);
    else if (["customer.subscription.updated", "customer.subscription.deleted", "customer.subscription.created"].includes(event.type))
      await handleSubscription(event.data.object as Stripe.Subscription);
    await EventRecord.updateOne({ _id: event.id, status: "processing" },
      { $set: { status: "processed", processedAt: new Date() }, $unset: { lockedUntil: "", lastError: "" } });
  } catch (error) {
    await EventRecord.updateOne({ _id: event.id, status: "processing" },
      { $set: { status: "failed", lastError: error instanceof Error ? error.message.slice(0, 500) : "Unknown event error" },
        $unset: { lockedUntil: "" } });
    throw error;
  }
};
