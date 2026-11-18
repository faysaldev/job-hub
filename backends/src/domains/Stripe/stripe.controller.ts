import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import Stripe from "stripe";
import { asyncHandler } from "../../lib/errorsHandle";
import { AppError } from "../../lib/errors";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
import Application from "../Applications/application.model";
import { assertId } from "../../lib/query";
import { processStripeEvent } from "../Billing/billing.webhook";
import { assertPaymentsEnabled, boostOffer, frontendOrigin } from "./payment.policy";

const client = (): Stripe => {
  if (!process.env.STRIPE_SECRET_KEY) throw new AppError("Payments temporarily unavailable", 503);
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};
const ok = (res: Response, message: string, data: object) => res.status(200).json(
  response({ message, data, statusCode: 200, status: "OK" }));

// Single server-authoritative price read. Does not expose Stripe keys or trust client price data.
const getBoostOffer = asyncHandler(async (_req: Request, res: Response) =>
  ok(res, "Current application highlight offer", boostOffer()));

/** Create or reuse one checkout for the seeker's existing Standard application. */
export const createBoostSession = async (applicationId: string, userId: string) => {
  const offer = boostOffer();
  if (!offer.available || offer.priceCents === null) throw new AppError("Application highlight is currently unavailable. Your Standard application is still valid.", 503);
  assertPaymentsEnabled();
  const appId = assertId(applicationId, "application ID");
  const application = await Application.findOne({ _id: appId, applicant: userId, isWithdrawn: { $ne: true } });
  if (!application) throw new AppError("Application not found", 404);
  if (application.boostPaymentStatus === "paid") throw new AppError("Application is already highlighted", 409);
  if (application.boostPaymentStatus === "refunded") throw new AppError("Contact support about the reversed payment before retrying", 409);
  const stripe = client();
  if (application.stripeCheckoutSessionId) {
    // No second charge while a previous session can still complete or its webhook is pending.
    const previous = await stripe.checkout.sessions.retrieve(application.stripeCheckoutSessionId);
    if (previous.status === "open" && previous.url)
      return { status: "checkout" as const, sessionId: previous.id, checkoutUrl: previous.url };
    if (previous.status === "complete")
      return { status: "verifying" as const, sessionId: previous.id, checkoutUrl: null };
    if (previous.status !== "expired") throw new AppError("The existing payment is still being verified", 409);
  }
  const attemptId = !application.stripeCheckoutSessionId && application.boostCheckoutAttemptId ?
    application.boostCheckoutAttemptId : randomUUID();
  const chargeCents = !application.stripeCheckoutSessionId && application.boostCheckoutAttemptId && application.boostPriceCents ?
    application.boostPriceCents : offer.priceCents;
  const now = new Date();
  // Compare-and-set lease serializes concurrent tabs/workers. Never activate a benefit here.
  const leased = await Application.findOneAndUpdate({ _id: application._id, applicant: userId,
    boostPaymentStatus: { $nin: ["paid", "refunded"] },
    $or: [{ boostCheckoutLockUntil: { $exists: false } }, { boostCheckoutLockUntil: { $lte: now } }] },
  { $set: { boostCheckoutLockUntil: new Date(Date.now() + 120_000), boostCheckoutAttemptId: attemptId, boostPriceCents: chargeCents } }, { new: true });
  if (!leased) throw new AppError("Checkout is being prepared. Retry in a moment.", 409);
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment", payment_method_types: ["card"],
      line_items: [{ price_data: { currency: "usd", product_data: { name: "JobHub Application Highlight" },
        unit_amount: chargeCents }, quantity: 1 }],
      success_url: `${frontendOrigin()}/applied-successfully?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendOrigin()}/cancel?application_id=${application._id}`,
      client_reference_id: String(application._id),
      metadata: { type: "application_boost", application_id: String(application._id), user_id: userId, attempt_id: attemptId, price_cents: String(chargeCents) },
    }, { idempotencyKey: `jh:boost:${application._id}:${attemptId}` });
    await Application.updateOne({ _id: application._id, applicant: userId, boostCheckoutAttemptId: attemptId,
      boostPaymentStatus: { $nin: ["paid", "refunded"] } },
    { $set: { stripeCheckoutSessionId: session.id, boostPaymentStatus: "pending", boostPriceCents: chargeCents },
      $unset: { boostCheckoutLockUntil: "" } });
    return { status: "checkout" as const, sessionId: session.id, checkoutUrl: session.url };
  } catch (error) {
    await Application.updateOne({ _id: application._id, boostCheckoutAttemptId: attemptId },
      { $unset: { boostCheckoutLockUntil: "" } });
    throw error;
  }
};

const createCheckoutSession = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const applicationId = req.body?.applicationId;
  if (typeof applicationId !== "string") throw new AppError("applicationId is required", 400);
  ok(res, "Checkout status", await createBoostSession(applicationId, req.user!._id));
});
const getPaymentDetails = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const sessionId = req.params.sessionId;
  if (typeof sessionId !== "string" || !/^cs_(test|live)_[a-zA-Z0-9]+$/.test(sessionId)) throw new AppError("Invalid checkout session", 400);
  const application = await Application.findOne({ stripeCheckoutSessionId: sessionId, applicant: req.user!._id });
  if (!application && req.user!.role !== "admin") throw new AppError("Payment not found", 404);
  const session = await client().checkout.sessions.retrieve(sessionId);
  if (session.metadata?.type !== "application_boost" ||
    (session.metadata?.user_id !== req.user!._id && req.user!.role !== "admin")) throw new AppError("Payment not found", 404);
  const verified = application?.boostPaymentStatus === "paid" && application.paid_amount > 0;
  ok(res, "Payment status", {
    sessionId: session.id, checkoutStatus: session.status, paymentStatus: session.payment_status,
    amountTotal: (session.amount_total || 0) / 100, currency: session.currency || "usd",
    benefitStatus: application?.boostPaymentStatus || "none", benefitActivated: verified, completed: verified,
  });
});

const webhook = asyncHandler(async (req: Request, res: Response) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) throw new AppError("Stripe webhook not configured", 503);
  const signature = req.headers["stripe-signature"];
  if (typeof signature !== "string" || !Buffer.isBuffer(req.body)) throw new AppError("Invalid webhook", 400);
  let event: Stripe.Event;
  try { event = client().webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET); }
  catch { throw new AppError("Invalid Stripe signature", 400); }
  await processStripeEvent(event);
  res.status(200).json({ received: true });
});
export default { getBoostOffer, createCheckoutSession, getPaymentDetails, webhook };
