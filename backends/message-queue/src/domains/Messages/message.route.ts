import express from "express";
import messageRoutes from "./message.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

// Create a new message
router.post("/", authMiddleware, messageRoutes.createMessage);

// Get all messages in a conversation
router.get(
  "/conversation/:conversationId",
  authMiddleware,
  messageRoutes.getAllMessages
);

// Edit a message
router.put("/:messageId", authMiddleware, messageRoutes.editMessage);

// Delete a message
router.delete("/:messageId", authMiddleware, messageRoutes.deleteMessage);

// Mark message as read
router.patch(
  "/:messageId/read",
  authMiddleware,
  messageRoutes.markMessageAsRead
);

export default router;
