import { Router } from "express";
import applicationRoutes from "../domains/Applications/application.route";
import stripeRoutes from "../domains/Stripe/stripe.route";

// Initialize the router
const router = Router();

router.use("/applications", applicationRoutes);
router.use("/stripe", stripeRoutes);

export default router;
