import Stripe from "stripe";
import mongoose from "mongoose";
import BillingPlan, { IBillingPlan, PlanLimits } from "./billing.plan.model";
import BillingAccount from "./billing.account.model";
import BillingInvoice from "./billing.invoice.model";
import CreditGrant from "./billing.credit.model";
import JobPromotion from "./billing.promotion.model";
import Company from "../Company/company.model";
import Job from "../Jobs/job.model";
import { companyForActor, jobForActor } from "../Company/company.access";
import { AppError } from "../../lib/errors";
import { assertId } from "../../lib/query";
import { currentEntitlement, freeEntitlement, getUsage } from "./billing.entitlements";
import { assertPaymentsEnabled } from "../Stripe/payment.policy";

const stripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) throw new AppError("Billing is not configured", 503);
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};
const origin = () => {
  const value = (process.env.FRONTEND_URL || "").split(",")[0].trim().replace(/\/$/, "");
  if (!value.startsWith("https://") && !(process.env.NODE_ENV !== "production" && value.startsWith("http://localhost")))
    throw new AppError("A secure FRONTEND_URL is required", 503);
  return value;
};
const snapshot = (plan: IBillingPlan) => ({
  key: plan.key, version: plan.version, name: plan.name, priceCents: plan.priceCents as number,
  currency: "usd" as const, limits: JSON.parse(JSON.stringify(plan.limits)) as PlanLimits,
});
const accessible = (plan: IBillingPlan) => plan.isCurrent && plan.published && !plan.enterprise &&
  Number.isSafeInteger(plan.priceCents) && Number(plan.priceCents) > 0;
const asId = (value: string) => new mongoose.Types.ObjectId(assertId(value));

export const listPublicPlans = async () => {
  const plans = await BillingPlan.find({ isCurrent: true, published: true })
    .select("key version name description priceCents currency limits features enterprise")
    .sort({ priceCents: 1 }).lean();
  if (!plans.some(plan => plan.key === "free")) plans.unshift({ ...freeEntitlement(), _id: undefined,
    description: "Get started with your first vacancy", enterprise: false, features: [] } as any);
  return plans;
};
export const billingDashboard = async (actorId: string) => {
  const { company, teamRole } = await companyForActor(actorId, "view");
  // Teammates can see shared capacity; financial history remains private to the
  // owner and company admins, including externally hosted invoice URLs.
  const mayViewFinances = teamRole === "owner" || teamRole === "admin";
  const [{ entitlement, account, paid }, usage, invoices, promotions] = await Promise.all([
    currentEntitlement(String(company._id)), getUsage(company),
    mayViewFinances ? BillingInvoice.find({ companyId: company._id }).select("amountPaidCents currency invoiceUrl paidAt periodEnd planKey planVersion")
      .sort({ paidAt: -1 }).limit(30).lean() : Promise.resolve([]),
    mayViewFinances ? JobPromotion.find({ companyId: company._id }).select("jobId durationDays source status startsAt endsAt priceCents")
      .sort({ createdAt: -1 }).limit(30).lean() : Promise.resolve([]),
  ]);
  return { company: { id: company._id, name: company.companyName }, teamRole, plan: entitlement,
    subscription: { status: mayViewFinances ? (account?.stripeStatus || "free") : (paid ? "active" : "free"),
      paidThrough: mayViewFinances ? (account?.paidThrough || null) : null,
      cancelAtPeriodEnd: mayViewFinances ? (account?.cancelAtPeriodEnd || false) : false, paid },
    usage: { ...usage, limits: entitlement.limits, quotaOverage: Math.max(0, usage.activeJobs - entitlement.limits.activeJobs) }, invoices,
    promotions: promotions.map(p => ({ ...p, status: p.status === "active" && p.endsAt && p.endsAt <= new Date() ? "expired" : p.status })) };
};

const getOrCreateCustomer = async (company: { _id: any; companyName?: string; userId: any }, actorEmail: string) => {
  const existing = await BillingAccount.findOne({ companyId: company._id });
  if (existing?.stripeCustomerId) return existing.stripeCustomerId;
  const customer = await stripe().customers.create({ email: actorEmail,
    name: company.companyName || undefined,
    metadata: { company_id: String(company._id) } }, { idempotencyKey: `jh:company-customer:${company._id}` });
  await BillingAccount.updateOne({ companyId: company._id },
    { $setOnInsert: { companyId: company._id }, $set: { stripeCustomerId: customer.id } }, { upsert: true });
  return customer.id;
};

export const subscribeCheckout = async (actorId: string, actorEmail: string, key: string) => {
  const { company, teamRole } = await companyForActor(actorId, "company");
  if (teamRole !== "owner") throw new AppError("Only the company owner can manage billing", 403);
  const plan = await BillingPlan.findOne({ key, isCurrent: true, published: true });
  if (!plan || !accessible(plan)) throw new AppError("This plan is unavailable for online checkout", 400);
  assertPaymentsEnabled();
  const s = stripe();
  const customerId = await getOrCreateCustomer(company, actorEmail);
  const account = await BillingAccount.findOne({ companyId: company._id });
  if (account?.stripeSubscriptionId && account.stripeStatus !== "canceled" && account.stripeStatus !== "incomplete_expired") {
    // Trust Stripe's authoritative status if an older webhook has not arrived yet.
    const existing = await s.subscriptions.retrieve(account.stripeSubscriptionId);
    if (!["canceled", "incomplete_expired"].includes(existing.status))
      throw new AppError("Manage or cancel your existing subscription in the Billing Portal before selecting another plan", 409);
  }
  const now = new Date();
  if (account?.pendingCheckoutSessionId) {
    // A Checkout session can remain payable after the DB creation lease expires.
    // Always inspect it before offering a second subscription checkout.
    const previous = await s.checkout.sessions.retrieve(account.pendingCheckoutSessionId);
    if (previous.status === "open") {
      if (account.pendingCheckoutPlanId === String(plan._id) && previous.url)
        return { checkoutUrl: previous.url, sessionId: previous.id };
      // Switching plans safely expires the previous payable session first.
      try { await s.checkout.sessions.expire(previous.id); }
      catch { throw new AppError("Another plan checkout may still be payable. Retry or contact billing support.", 409); }
    } else if (previous.status === "complete") {
      throw new AppError("Your previous checkout is being verified. Refresh billing shortly.", 409);
    }
    await BillingAccount.updateOne({ companyId: company._id, pendingCheckoutSessionId: previous.id },
      { $unset: { checkoutPendingUntil: "", pendingCheckoutSessionId: "", pendingCheckoutPlanId: "" } });
  }
  // Atomic lock prevents two browser tabs from opening simultaneous subscriptions.
  const locked = await BillingAccount.findOneAndUpdate({ companyId: company._id,
    $or: [{ checkoutPendingUntil: { $exists: false } }, { checkoutPendingUntil: { $lte: now } }] },
    { $set: { checkoutPendingUntil: new Date(Date.now() + 15 * 60_000) } }, { new: true });
  if (!locked) throw new AppError("Another checkout is in progress. Retry after it expires or use the existing checkout link.", 409);
  try {
    const checkout = await s.checkout.sessions.create({
      mode: "subscription", customer: customerId, payment_method_types: ["card"],
      line_items: [{ price_data: { currency: "usd", product_data: { name: `JobHub ${plan.name} (v${plan.version})` },
        unit_amount: plan.priceCents!, recurring: { interval: "month" } }, quantity: 1 }],
      client_reference_id: String(company._id),
      metadata: { type: "recruiter_subscription", company_id: String(company._id), plan_id: String(plan._id) },
      subscription_data: { metadata: { type: "recruiter_subscription", company_id: String(company._id), plan_id: String(plan._id) } },
      success_url: `${origin()}/recruiter/billing?checkout=returned`,
      cancel_url: `${origin()}/recruiter/billing?checkout=canceled`,
    }, { idempotencyKey: `jh:subscription:${company._id}:${plan._id}:${now.getTime()}` });
    await BillingAccount.updateOne({ companyId: company._id },
      { $set: { pendingCheckoutSessionId: checkout.id, pendingCheckoutPlanId: String(plan._id), checkoutPendingUntil: new Date(Date.now() + 15 * 60_000) } });
    return { checkoutUrl: checkout.url, sessionId: checkout.id };
  } catch (error) {
    await BillingAccount.updateOne({ companyId: company._id }, { $unset: { checkoutPendingUntil: "", pendingCheckoutSessionId: "", pendingCheckoutPlanId: "" } });
    throw error;
  }
};


/** Paid -> higher paid plan without creating a second subscription.
 * Stripe immediately invoices the proration; if a payment requires 3DS or fails,
 * error_if_incomplete keeps the previous subscription unchanged. Only invoice.paid
 * grants the new quota snapshot. */
export const upgradeSubscription = async (actorId: string, key: string) => {
  const { company, teamRole } = await companyForActor(actorId, "company");
  if (teamRole !== "owner") throw new AppError("Only the company owner can change plans", 403);
  assertPaymentsEnabled();
  const desired = await BillingPlan.findOne({ key, isCurrent: true, published: true });
  if (!desired || !accessible(desired)) throw new AppError("This plan is unavailable for upgrades", 400);
  const { entitlement, account, paid } = await currentEntitlement(String(company._id));
  if (!paid || !account?.stripeSubscriptionId || !account.stripeCustomerId)
    throw new AppError("Start a paid subscription using checkout first", 409);
  if (desired.priceCents! <= entitlement.priceCents)
    throw new AppError("Select a higher-priced plan for an immediate upgrade. For downgrades, contact billing support.", 400);
  const s = stripe();
  const current = await s.subscriptions.retrieve(account.stripeSubscriptionId);
  if (current.customer !== account.stripeCustomerId || current.status !== "active" ||
    current.items.data.length !== 1 || !current.items.data[0]?.id)
    throw new AppError("The existing subscription cannot be upgraded automatically. Contact billing support.", 409);
  if (current.cancel_at_period_end) throw new AppError("Restore the canceled subscription in Stripe before upgrading.", 409);
  const now = new Date();
  const hold = await BillingAccount.findOneAndUpdate({ companyId: company._id,
    $or: [{ checkoutPendingUntil: { $exists: false } }, { checkoutPendingUntil: { $lte: now } }] },
    { $set: { checkoutPendingUntil: new Date(Date.now() + 90_000) } }, { new: true });
  if (!hold) throw new AppError("Another billing change is in progress. Please retry shortly.", 409);
  try {
    // One versioned Stripe price per published plan. Never accept a client price.
    const price = await s.prices.create({ currency: "usd", unit_amount: desired.priceCents!,
      recurring: { interval: "month" }, product_data: { name: `JobHub ${desired.name} (v${desired.version})` } },
      { idempotencyKey: `jh:plan-price:${desired._id}` });
    const updated = await s.subscriptions.update(current.id, {
      items: [{ id: current.items.data[0].id, price: price.id, quantity: 1 }],
      metadata: { type: "recruiter_subscription", company_id: String(company._id), plan_id: String(desired._id) },
      payment_behavior: "error_if_incomplete", proration_behavior: "always_invoice",
    }, { idempotencyKey: `jh:upgrade:${company._id}:${desired._id}:${now.getTime()}` });
    if (updated.status !== "active") throw new AppError("Stripe has not confirmed the upgraded subscription", 409);
    return { status: "verifying", message: "Upgrade submitted. Capacity updates after Stripe invoice verification." };
  } catch (error) {
    if (error instanceof AppError) throw error;
    const message = (error as any)?.code === "card_declined" || (error as any)?.statusCode === 402 ?
      "The payment method could not complete the upgrade. Update it in Stripe Billing and retry." :
      "Unable to upgrade the subscription. The existing plan remains unchanged.";
    console.error("Subscription upgrade failed", error instanceof Error ? error.message : "Unknown error");
    throw new AppError(message, 409);
  } finally {
    await BillingAccount.updateOne({ companyId: company._id }, { $unset: { checkoutPendingUntil: "" } });
  }
};

export const portalSession = async (actorId: string) => {
  const { company, teamRole } = await companyForActor(actorId, "company");
  if (teamRole !== "owner") throw new AppError("Only the company owner can manage billing", 403);
  const account = await BillingAccount.findOne({ companyId: company._id });
  if (!account?.stripeCustomerId) throw new AppError("No billing account found", 404);
  // Subscription plan upgrades are intentionally disabled in the Stripe Portal configuration;
  // manage payment methods, invoices and cancellations in Stripe.
  const result = await stripe().billingPortal.sessions.create({ customer: account.stripeCustomerId,
    return_url: `${origin()}/recruiter/billing` });
  return { portalUrl: result.url };
};

export const sponsor = async (actorId: string, body: { jobId: string; durationDays: 7|30; payment: "credit"|"stripe"; requestId: string }) => {
  const { job, company } = await jobForActor(body.jobId, actorId, "jobs");
  if (job.status !== "published" || !job.isActive || job.applicationDeadline.getTime() <= Date.now())
    throw new AppError("Only an open, published job can be sponsored", 400);
  if (job.applicationDeadline.getTime() < Date.now() + body.durationDays * 86400_000)
    throw new AppError(`Extend the job application deadline to cover the entire ${body.durationDays}-day promotion before purchasing`, 400);
  const original = await JobPromotion.findOne({ companyId: company._id, requestId: body.requestId });
  if (original) {
    if (original.status === "active") return { status: "active", promotionId: original._id };
    if (original.stripeCheckoutSessionId && original.status === "pending") {
      const session = await stripe().checkout.sessions.retrieve(original.stripeCheckoutSessionId);
      if (session.status === "open" && session.url)
        return { status: "pending", checkoutUrl: session.url, promotionId: original._id };
      if (session.status === "complete")
        throw new AppError("This sponsorship payment is being verified. Refresh billing before retrying.", 409);
      await JobPromotion.updateOne({ _id: original._id, status: "pending" }, { $set: { status: "failed" } });
      throw new AppError("This sponsorship checkout expired. Start a new promotion request.", 409);
    }
    throw new AppError("This promotion request is already being processed", 409);
  }
  const pending = await JobPromotion.findOne({ jobId: job._id, status: "pending",
    createdAt: { $gt: new Date(Date.now() - 30*60_000) } }).sort({ createdAt: -1 });
  if (pending?.stripeCheckoutSessionId) {
    const checkout = await stripe().checkout.sessions.retrieve(pending.stripeCheckoutSessionId);
    if (checkout.status === "open" && checkout.url) return { status: "pending",
      checkoutUrl: checkout.url, promotionId: pending._id };
    if (checkout.status === "complete") throw new AppError(
      "A sponsorship payment has completed and is awaiting verification. Refresh billing rather than paying again.", 409);
    await JobPromotion.updateOne({ _id: pending._id, status: "pending" }, { $set: { status: "failed" } });
  } else if (pending) throw new AppError("A promotion checkout is being created. Retry in a moment.", 409);
  const { entitlement, paid } = await currentEntitlement(String(company._id));
  if (body.payment === "credit" && (!paid || entitlement.limits.monthlyCredits === 0 || body.durationDays !== 7))
    throw new AppError("A paid plan promotion credit covers one 7-day featured placement", 403);
  if (job.sponsoredUntil && job.sponsoredUntil.getTime() > Date.now())
    throw new AppError("This job is already sponsored. Start another promotion when the current one expires.", 409);
  const priceCents = body.payment === "credit" ? 0 : body.durationDays === 7 ? 1500 : 3900;
  const promotion = await JobPromotion.create({ companyId: company._id, jobId: job._id,
    requestId: body.requestId, source: body.payment, durationDays: body.durationDays, priceCents, status: "pending" });
  if (body.payment === "credit") {
    const dbSession = await mongoose.startSession();
    try {
      await dbSession.withTransaction(async () => {
        const grant = await CreditGrant.findOneAndUpdate({ companyId: company._id, remaining: { $gt: 0 },
          expiresAt: { $gt: new Date() } }, { $inc: { remaining: -1 } },
          { new: true, sort: { expiresAt: 1 }, session: dbSession });
        if (!grant) throw new AppError("No available promotion credits", 403);
        const startsAt = new Date();
        const endsAt = new Date(startsAt.getTime() + 7*86400_000);
        await JobPromotion.updateOne({ _id: promotion._id, status: "pending" }, { $set: {
          creditGrantId: grant._id, status: "active", startsAt, endsAt } }, { session: dbSession });
        const changed = await Job.updateOne({ _id: job._id, isActive: true,
          isDeleted: { $ne: true }, status: "published", applicationDeadline: { $gt: startsAt } },
          { $max: { sponsoredUntil: endsAt } }, { session: dbSession });
        if (changed.matchedCount !== 1) throw new AppError("This job is no longer open for sponsorship", 409);
      });
      try { const redis = (await import("../../config/redis")).default; await redis.incr("jobhub:search:version"); } catch { /* optional cache */ }
      return { status: "active", promotionId: promotion._id };
    } catch (error) {
      await JobPromotion.updateOne({ _id: promotion._id, status: "pending" }, { $set: { status: "failed" } });
      throw error;
    } finally { await dbSession.endSession(); }
  }
  try {
    assertPaymentsEnabled();
    const session = await stripe().checkout.sessions.create({ mode: "payment", payment_method_types: ["card"],
      line_items: [{ price_data: { currency: "usd", product_data: { name: `JobHub Sponsored Job — ${body.durationDays} days` }, unit_amount: priceCents }, quantity: 1 }],
      client_reference_id: String(promotion._id),
      metadata: { type: "job_promotion", promotion_id: String(promotion._id), company_id: String(company._id), job_id: String(job._id) },
      success_url: `${origin()}/recruiter/billing?promotion=returned`,
      cancel_url: `${origin()}/recruiter/billing?promotion=canceled`,
    }, { idempotencyKey: `jh:promotion:${promotion._id}` });
    await JobPromotion.updateOne({ _id: promotion._id, status: "pending" }, { $set: { stripeCheckoutSessionId: session.id } });
    return { status: "pending", checkoutUrl: session.url, promotionId: promotion._id };
  } catch (error) {
    await JobPromotion.updateOne({ _id: promotion._id }, { $set: { status: "failed" } });
    throw error;
  }
};

/** Idempotent fulfillment; repairable by replaying active promotions into the job's sponsoredUntil. */
export const activatePromotion = async (promotionId: string) => {
  const session = await mongoose.startSession();
  let activated = false;
  try {
    await session.withTransaction(async () => {
      const promotion = await JobPromotion.findOne({ _id: asId(promotionId), status: "pending" }).session(session);
      if (!promotion) return;
      const job = await Job.findOne({ _id: promotion.jobId, isDeleted: { $ne: true }, status: "published",
        isActive: true, applicationDeadline: { $gt: new Date() } }).session(session);
      if (!job) throw new AppError("Paid sponsorship job is no longer open; refund or reactivate the job before fulfillment", 409);
      const startsAt = new Date();
      const endsAt = new Date(startsAt.getTime() + promotion.durationDays*86400_000);
      if (job.applicationDeadline.getTime() < endsAt.getTime())
        throw new AppError("The job deadline no longer covers the paid promotion. Extend the deadline or refund the payment.", 409);
      await JobPromotion.updateOne({ _id: promotion._id, status: "pending" },
        { $set: { status: "active", startsAt, endsAt } }, { session });
      await Job.updateOne({ _id: job._id }, { $max: { sponsoredUntil: endsAt } }, { session });
      activated = true;
    }, { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } });
  } finally { await session.endSession(); }
  if (activated) {
    try { const redis = (await import("../../config/redis")).default; await redis.incr("jobhub:search:version"); } catch { /* optional cache */ }
  }
  return activated;
};

/** Hook for Stripe event handling. Only Stripe-verified fields activate sponsorship. */
export const fulfillPromotionCheckout = async (session: Stripe.Checkout.Session) => {
  if (session.mode !== "payment" || session.payment_status !== "paid" || session.currency !== "usd") return;
  const id = session.metadata?.promotion_id;
  const companyId = session.metadata?.company_id;
  const jobId = session.metadata?.job_id;
  if (!id || !mongoose.Types.ObjectId.isValid(id) ||
    !companyId || !mongoose.Types.ObjectId.isValid(companyId) ||
    !jobId || !mongoose.Types.ObjectId.isValid(jobId)) return;
  // Recover even if the API crashed after creating Checkout but before persisting
  // the session ID. The signed event's server-authored metadata identifies the order.
  const promo = await JobPromotion.findOneAndUpdate({ _id: id, status: "pending",
    companyId: asId(session.metadata!.company_id || ""), jobId: asId(session.metadata!.job_id || ""),
    $or: [{ stripeCheckoutSessionId: session.id }, { stripeCheckoutSessionId: { $exists: false } }] },
    { $set: { stripeCheckoutSessionId: session.id } }, { new: true });
  if (!promo || promo.source !== "stripe" || session.amount_total !== promo.priceCents) return;
  await activatePromotion(id);
};

export const normalizePlan = (key: string) => key.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
export const assertPlanWrite = (plan: { key: string; name: string; description?: string; priceCents?: number|null; limits: PlanLimits; enterprise?: boolean }) => {
  if (!/^[a-z][a-z0-9-]{1,39}$/.test(plan.key)) throw new AppError("Invalid plan key", 400);
  if (plan.key === "free" && plan.priceCents !== 0) throw new AppError("The Free plan must be free", 400);
  if (plan.enterprise && plan.priceCents !== null) throw new AppError("Enterprise uses custom pricing", 400);
  if (!plan.enterprise && (plan.priceCents === null || !Number.isSafeInteger(plan.priceCents) || plan.priceCents! < 0))
    throw new AppError("A monthly price in cents is required", 400);
};
export { snapshot };
