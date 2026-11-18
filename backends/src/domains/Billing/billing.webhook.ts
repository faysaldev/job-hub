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

/** Newer Stripe API versions place payment associations in InvoicePayment records.
 * Persist their PaymentIntent so a subsequent refund/dispute can reliably reverse access. */
const invoicePaymentIntent = async (invoice: Stripe.Invoice): Promise<string> => {
  const item = invoice as any;
  const embedded = stripeId(item.payment_intent) ||
    stripeId(item.payments?.data?.find((p: any) => p.payment?.type === "payment_intent")?.payment?.payment_intent);
  if (embedded) return embedded;
  const payments = await s().invoicePayments.list({ invoice: invoice.id, limit: 20 });
  const id = payments.data.map((p: any) =>
    p.payment?.type === "payment_intent" ? stripeId(p.payment.payment_intent) : null).find(Boolean);
  if (!id) throw new AppError("Stripe invoice has no verifiable payment intent", 422);
  return id;
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
  const paymentIntentId = await invoicePaymentIntent(invoice);
  // Refunds/disputes can reach us before the invoice webhook. Never re-enable
  // a charged-back subscription just because Stripe delivers events out of order.
  if (paymentIntentId && await PaymentReversal.exists({ stripePaymentIntentId: paymentIntentId })) return;
  const price = subscription.items.data[0]?.price;
  if (!price || subscription.items.data.length !== 1 || subscription.items.data[0].quantity !== 1 ||
    price.unit_amount !== plan.priceCents || price.currency !== "usd" ||
    price.recurring?.interval !== "month" || invoice.currency !== "usd" ||
    (invoice.billing_reason !== "subscription_update" && invoice.amount_paid < plan.priceCents))
    throw new AppError("Stripe subscription does not match the server plan", 422);
  if (!["active", "past_due"].includes(subscription.status)) return;
  const planInvoiceLines = invoice.lines?.has_more ? (await s().invoices.listLineItems(invoice.id, { limit: 100 })).data : (invoice.lines?.data || []);
  if (!planInvoiceLines.some((line: any) => line.amount > 0 &&
    stripeId(line.pricing?.price_details?.price) === price.id ||
    line.amount > 0 && stripeId(line.price) === price.id)) return;
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
  // Stripe timestamps use whole seconds. An immediate higher-price upgrade can
  // share a timestamp with the initial checkout; never discard that invoice.
  const sameSecondUpgrade = !!account?.lastPaidInvoicePaidAt &&
    account.lastPaidInvoicePaidAt.getTime() === paidAt.getTime() &&
    plan.priceCents > (account.snapshot?.priceCents || 0);
  if (account?.lastPaidInvoicePaidAt && paidAt <= account.lastPaidInvoicePaidAt &&
      account.lastPaidInvoiceId !== invoice.id && !sameSecondUpgrade) return;
  // All side effects share an idempotent invoice ID; an event retry cannot award two grants.
  const accountChange = await BillingAccount.updateOne({ companyId: id(companyId),
    $or: [{ paidThrough: { $lt: end } }, { paidThrough: { $exists: false } },
      { paidThrough: { $lte: end }, lastPaidInvoicePaidAt: { $exists: false } },
      { paidThrough: { $lte: end }, lastPaidInvoicePaidAt: { $lt: paidAt } },
      { paidThrough: { $lte: end }, lastPaidInvoicePaidAt: paidAt,
        "snapshot.priceCents": { $lt: plan.priceCents } }] },
    { $set: { companyId: id(companyId), stripeCustomerId: customerId, stripeSubscriptionId: subscriptionId,
      stripeStatus: subscription.status, cancelAtPeriodEnd: subscription.cancel_at_period_end,
      snapshot: snapshot(plan), paidThrough: end, lastPaidInvoiceId: invoice.id, lastPaidInvoicePaidAt: paidAt },
      $unset: { checkoutPendingUntil: "", pendingCheckoutSessionId: "", pendingCheckoutPlanId: "" } }, { upsert: !account });
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
      const { application_id: appId, user_id: userId, attempt_id: attemptId, price_cents: snapshot } = session.metadata;
      const amount = session.amount_total;
      if (!appId || !userId || !attemptId || !mongoose.isValidObjectId(appId) || !mongoose.isValidObjectId(userId) ||
        session.client_reference_id !== appId || session.currency !== "usd" ||
        !Number.isSafeInteger(amount) || !amount || Number(snapshot) !== amount) return;
      const intent = stripeId(session.payment_intent);
      if (!intent || await PaymentReversal.exists({ stripePaymentIntentId: intent })) return;
      // The attempt is reserved before Stripe creates its session: allows recovery
      // from an API crash before the session ID was written to MongoDB.
      await Application.updateOne({ _id: id(appId), applicant: id(userId), boostCheckoutAttemptId: attemptId,
        boostPriceCents: amount, boostPaymentStatus: { $nin: ["paid", "refunded"] } },
        { $set: { stripeCheckoutSessionId: session.id, boostPaymentStatus: "paid",
          boostPaymentIntentId: intent, boostPriority: 1, paid_amount: amount / 100 },
          $unset: { boostCheckoutLockUntil: "" } });
    }
  }
  if (session.mode === "subscription" && session.metadata?.type === "recruiter_subscription") {
    const companyId = session.metadata.company_id;
    if (!companyId || !mongoose.isValidObjectId(companyId)) return;
    const customer = stripeId(session.customer);
    if (!customer) return;
    const subscriptionId = stripeId(session.subscription);
    await BillingAccount.updateOne({ companyId: id(companyId), pendingCheckoutSessionId: session.id,
      pendingCheckoutPlanId: session.metadata.plan_id,
      $or: [{ stripeCustomerId: customer }, { stripeCustomerId: { $exists: false } }] },
      { $set: { stripeCustomerId: customer, ...(subscriptionId ? { stripeSubscriptionId: subscriptionId } : {}) },
        $unset: { checkoutPendingUntil: "", pendingCheckoutSessionId: "", pendingCheckoutPlanId: "" } });
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
    if (checkout.metadata?.type === "application_boost") {
      const appId = checkout.metadata.application_id;
      if (appId && mongoose.isValidObjectId(appId)) {
        await Application.updateOne({ _id: id(appId), stripeCheckoutSessionId: checkout.id,
          boostPaymentStatus: { $in: ["paid", "pending"] } },
          { $set: { boostPaymentStatus: "refunded", boostPriority: 0, paid_amount: 0 } });
      }
      continue;
    }
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
    else if (event.type === "checkout.session.expired") {
      const checkout = event.data.object as Stripe.Checkout.Session;
      if (checkout.metadata?.type === "application_boost" && checkout.metadata.application_id &&
        mongoose.isValidObjectId(checkout.metadata.application_id))
        await Application.updateOne({ _id: id(checkout.metadata.application_id), stripeCheckoutSessionId: checkout.id,
          boostPaymentStatus: "pending" }, { $set: { boostPaymentStatus: "none" } });
    }
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
