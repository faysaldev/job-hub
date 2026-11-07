import { Router } from "express";
import controller from "./stripe.controller";
import { authMiddleware, requireRoles } from "../../middlewares/auth.middleware";
const router = Router();
router.post("/create-checkout-session", authMiddleware, requireRoles("seeker"), controller.createCheckoutSession);
router.get("/payment-details/:sessionId", authMiddleware, controller.getPaymentDetails);
// /webhook is mounted with express.raw BEFORE express.json() in server.ts.
export default router;
