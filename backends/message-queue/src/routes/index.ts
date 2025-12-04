import { Router } from "express";
import conversationsRoutes from "../domains/Conversations/conversations.route";
import messageRoutes from "../domains/Messages/message.route";

// Initialize the router
const router = Router();

router.use("/conversations", conversationsRoutes);
router.use("/messages", messageRoutes);

export default router;
