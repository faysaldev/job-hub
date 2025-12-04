import express from "express";
import conversationRoute from "./conversations.controller";

const router = express.Router();

// Create a new conversation
router.post("/", conversationRoute.createConversation);

// Get user's conversations
router.get("/", conversationRoute.getUserConversations);

// Delete a conversation
router.delete("/:conversationId", conversationRoute.deleteConversation);

export default router;
