import { Request, Response } from "express";
import Stripe from "stripe";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { handleError } from "../../lib/errorsHandle";
import { ProtectedRequest } from "../../types/protected-request";

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Create a Stripe checkout session
const createCheckoutSession = async (req: ProtectedRequest, res: Response) => {
  try {
    const { price, title, job_id } = req.body;
    const user_id = req.user?._id;

    // Sanitize metadata to ensure no undefined values (Stripe requires string | number | boolean | null)
    const metadata: Record<string, string> = {};
    if (job_id) metadata.job_id = String(job_id);
    if (user_id) metadata.user_id = String(user_id);

    // Validate required fields
    if (!price || !title) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Price and title are required",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    // Validate price is a positive number
    if (typeof price !== "number" || price <= 0) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Price must be a positive number",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
            },
            unit_amount: Math.round(price * 100), // Stripe uses cents, so multiply by 100
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
  } catch (error) {
    const handledError = handleError(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      })
    );
  }
};

// Get payment details by session ID
const getPaymentDetails = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    // Validate session ID is provided
    if (!sessionId) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Session ID is required",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Get payment status and other relevant details
    const paymentDetails = {
      sessionId: session.id,
      status: session.payment_status, // paid, unpaid, or no_payment_required
      paymentIntent: session.payment_intent,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents to dollars
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
    const handledError = handleError(error);

    // If the error is due to invalid session ID
    if (
      error instanceof Stripe.errors.StripeError &&
      error.code === "resource_missing"
    ) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Payment session not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      })
    );
  }
};

const stripeController = {
  createCheckoutSession,
  getPaymentDetails,
};

export default stripeController;
