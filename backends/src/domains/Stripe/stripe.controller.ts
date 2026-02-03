import { Request, Response } from "express";
import Stripe from "stripe";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { asyncHandler } from "../../lib/errorsHandle";
import { AppError } from "../../lib/errors";
import { ProtectedRequest } from "../../types/protected-request";

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Create a Stripe checkout session
const createCheckoutSession = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { price, title, job_id } = req.body;
  const user_id = req.user?._id;

  // Sanitize metadata to ensure no undefined values
  const metadata: Record<string, string> = {};
  if (job_id) metadata.job_id = String(job_id);
  if (user_id) metadata.user_id = String(user_id);

  if (!price || !title) {
    throw new AppError("Price and title are required", httpStatus.BAD_REQUEST);
  }

  if (typeof price !== "number" || price <= 0) {
    throw new AppError("Price must be a positive number", httpStatus.BAD_REQUEST);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: title,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:3000/applied-successfully?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3000/cancel`,
    metadata: metadata,
  });

  res.status(httpStatus.OK).json(
    response({
      message: "Checkout session created successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {
        sessionId: session.id,
        checkoutUrl: session.url,
      },
    })
  );
});

// Get payment details by session ID
const getPaymentDetails = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    throw new AppError("Session ID is required", httpStatus.BAD_REQUEST);
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const paymentDetails = {
      sessionId: session.id,
      status: session.payment_status,
      paymentIntent: session.payment_intent,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
      customerEmail: session.customer_details?.email,
      metadata: session.metadata,
      completed: session.payment_status === "paid",
    };

    res.status(httpStatus.OK).json(
      response({
        message: "Payment details retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: paymentDetails,
      })
    );
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError && error.code === "resource_missing") {
      throw new AppError("Payment session not found", httpStatus.NOT_FOUND);
    }
    throw error;
  }
});

const stripeController = {
  createCheckoutSession,
  getPaymentDetails,
};

export default stripeController;
