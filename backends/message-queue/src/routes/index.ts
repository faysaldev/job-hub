import { Router } from "express";
import conversationsRoutes from "../domains/Conversations/conversations.route";
import messageRoutes from "../domains/Conversations/conversations.route";

// Initialize the router
const router = Router();

router.use("/conversations", conversationsRoutes);
router.use("/messages", messageRoutes);
export default router;
