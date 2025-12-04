import express from "express";
import {
  createMessage,
  editMessage,
  deleteMessage,
  getAllMessages,
  markMessageAsRead,
} from "./message.controller";

const router = express.Router();

// Create a new message
router.post("/", createMessage);

// Get all messages in a conversation
router.get("/conversation/:conversationId", getAllMessages);

// Edit a message
router.put("/:messageId", editMessage);

// Delete a message
router.delete("/:messageId", deleteMessage);

// Mark message as read
router.patch("/:messageId/read", markMessageAsRead);

export default router;