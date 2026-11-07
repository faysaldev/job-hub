import { Request, Response } from "express";
import Stripe from "stripe";
import { asyncHandler } from "../../lib/errorsHandle";
import { AppError } from "../../lib/errors";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
import Application from "../Applications/application.model";
import { assertId } from "../../lib/query";

const client = (): Stripe => {
  if (!process.env.STRIPE_SECRET_KEY) throw new AppError("Payments temporarily unavailable", 503);
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};
const boostPriceCents = () => {
  const value = Number(process.env.APPLICATION_BOOST_PRICE_CENTS || 0);
  if (!Number.isSafeInteger(value) || value < 50 || value > 100000) {
    throw new AppError("Application boost is not available", 503);
  }
  return value;
};
const origin = () => (process.env.FRONTEND_URL || "http://localhost:3000").split(",")[0].trim().replace(/\/$/, "");
const ok = (res: Response, message: string, data: object) => res.status(200).json(
  response({ message, data, statusCode: 200, status: "OK" }));

/** For an existing application only. Never trust a client-supplied title or price. */
export const createBoostSession = async (applicationId: string, userId: string) => {
  const price = boostPriceCents();
  const application = await Application.findOne({ _id: assertId(applicationId, "application ID"),
    applicant: userId, isWithdrawn: { $ne: true } });
  if (!application) throw new AppError("Application not found", 404);
  if (application.boostPaymentStatus === "paid") throw new AppError("Boost already purchased", 409);
  const stripe = client();
  if (application.stripeCheckoutSessionId) {
    try {
      const current = await stripe.checkout.sessions.retrieve(application.stripeCheckoutSessionId);
      if (current.status === "open" && current.url) return { sessionId: current.id, checkoutUrl: current.url };
    } catch { /* stale/expired session: permit a new checkout */ }
  }
  const session = await stripe.checkout.sessions.create({
    mode: "payment", payment_method_types: ["card"],
    line_items: [{ price_data: { currency: "usd", product_data: { name: "JobHub Application Boost" },
      unit_amount: price }, quantity: 1 }],
    success_url: `${origin()}/applied-successfully?session_id={CHECKOUT_SESSION_ID}&application_id=${application._id}`,
    cancel_url: `${origin()}/cancel`,
    client_reference_id: application._id.toString(),
    metadata: { type: "application_boost", application_id: application._id.toString(), user_id: userId },
  }, { idempotencyKey: `boost:${application._id.toString()}:${Math.floor(Date.now() / 300000)}` });
  await Application.updateOne({ _id: application._id, applicant: userId, boostPaymentStatus: { $ne: "paid" } },
    { $set: { stripeCheckoutSessionId: session.id, boostPaymentStatus: "pending", boostPriceCents: price } });
  return { sessionId: session.id, checkoutUrl: session.url };
};

const createCheckoutSession = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  // Existing applicants can retry the same payment after a failed redirect.
  const applicationId = req.body?.applicationId;
  if (typeof applicationId !== "string") throw new AppError("applicationId is required", 400);
  ok(res, "Checkout session created", await createBoostSession(applicationId, req.user!._id));
});
const getPaymentDetails = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const sessionId = req.params.sessionId;
  if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) throw new AppError("Invalid session ID", 400);
  const session = await client().checkout.sessions.retrieve(sessionId);
  if (session.metadata?.user_id !== req.user!._id && req.user!.role !== "admin") throw new AppError("Payment not found", 404);
  ok(res, "Payment details retrieved", {
    sessionId: session.id, status: session.payment_status,
    amountTotal: (session.amount_total || 0) / 100, currency: session.currency,
    completed: session.payment_status === "paid", metadata: session.metadata,
  });
});

const webhook = asyncHandler(async (req: Request, res: Response) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) throw new AppError("Stripe webhook not configured", 503);
  const signature = req.headers["stripe-signature"];
  if (typeof signature !== "string" || !Buffer.isBuffer(req.body)) throw new AppError("Invalid webhook", 400);
  let event: Stripe.Event;
  try { event = client().webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET); }
  catch { throw new AppError("Invalid Stripe signature", 400); }
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid" && session.metadata?.type === "application_boost") {
      // Never use the current global price for old checkouts. Verify the price
      // snapshotted on that application when Stripe checkout was created.
      if (session.currency !== "usd" || !Number.isSafeInteger(session.amount_total)) {
        throw new AppError("Payment currency or amount mismatch", 400);
      }
      const appId = session.metadata?.application_id;
      const userId = session.metadata?.user_id;
      if (appId && userId) {
        // Atomic and idempotent: duplicated events cannot multiply the paid amount.
        await Application.updateOne({ _id: assertId(appId), applicant: assertId(userId),
          stripeCheckoutSessionId: session.id, boostPriceCents: session.amount_total,
          boostPaymentStatus: "pending" },
          { $set: { boostPaymentStatus: "paid", paid_amount: session.amount_total / 100 } });
      }
    }
  }
  res.status(200).json({ received: true });
});
export default { createCheckoutSession, getPaymentDetails, webhook };
