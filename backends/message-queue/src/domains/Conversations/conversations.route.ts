import express from "express";
import conversationRoute from "./conversations.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

// Create a new conversation
router.post("/", authMiddleware, conversationRoute.createConversation);

// Get user's conversations
router.get("/", authMiddleware, conversationRoute.getUserConversations);

// Delete a conversation
router.delete(
  "/:conversationId",
  authMiddleware,
  conversationRoute.deleteConversation
);

export default router;
