import { Request, Response } from "express";
import {
  createMessageService,
  editMessageService,
  deleteMessageService,
  getAllMessagesService,
  markMessageAsReadService,
} from "./message.services";

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId, senderId, receiverId, content, messageType, attachments } = req.body;

    const message = await createMessageService({
      conversationId,
      senderId,
      receiverId,
      content,
      messageType,
      attachments,
    });

    res.status(201).json({
      success: true,
      message: "Message created successfully",
      data: message,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const editMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const updatedMessage = await editMessageService(messageId, content);

    res.status(200).json({
      success: true,
      message: "Message updated successfully",
      data: updatedMessage,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    await deleteMessageService(messageId);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const messages = await getAllMessagesService(conversationId, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });

    res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: messages,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body; // The user who read the message

    const updatedMessage = await markMessageAsReadService(messageId, userId);

    res.status(200).json({
      success: true,
      message: "Message marked as read successfully",
      data: updatedMessage,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};