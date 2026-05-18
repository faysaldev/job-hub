import express from "express";
import conversationRoute from "./conversations.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

/**
 * POST /conversations  — Create a new conversation (REST)
 * DELETE /conversations/:id — Delete a conversation (REST)
 *
 * GET /conversations is handled via Socket.IO (conversations:get event).
 */
router.post("/", authMiddleware, conversationRoute.createConversation);

router.delete(
  "/:conversationId",
  authMiddleware,
  conversationRoute.deleteConversation,
);

export default router;
