import express from "express";
import messageRoutes from "./message.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

/**
 * DELETE /messages/:messageId
 * Hard-delete a message. Send/edit/read are all handled via Socket.IO.
 */
router.delete("/:messageId", authMiddleware, messageRoutes.deleteMessage);

export default router;
