import express from "express";
import messageRoutes from "./message.controller";

const router = express.Router();

// Create a new message
router.post("/", messageRoutes.createMessage);

// Get all messages in a conversation
router.get("/conversation/:conversationId", messageRoutes.getAllMessages);

// Edit a message
router.put("/:messageId", messageRoutes.editMessage);

// Delete a message
router.delete("/:messageId", messageRoutes.deleteMessage);

// Mark message as read
router.patch("/:messageId/read", messageRoutes.markMessageAsRead);

export default router;
