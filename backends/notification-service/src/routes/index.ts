import { Router } from "express";
import notificationRoutes from "../domains/Notifications/notifications.route";
// Initialize the router
const router = Router();

router.use("/notifications", notificationRoutes);

export default router;
