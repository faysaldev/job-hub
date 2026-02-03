import { Router } from "express";
import stripeController from "./stripe.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Create a new Stripe checkout session
router.post(
  "/create-checkout-session",
  authMiddleware,
  stripeController.createCheckoutSession
);

// Get payment details by session ID
router.get(
  "/payment-details/:sessionId",
  authMiddleware,
  stripeController.getPaymentDetails
);

export default router;
