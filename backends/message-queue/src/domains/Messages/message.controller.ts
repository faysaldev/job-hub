import { Request, Response } from "express";
import messageServices from "./message.services";
import { ProtectedRequest } from "../../types/protected-request";

const createMessage = async (req: ProtectedRequest, res: Response) => {
  try {
    const { conversationId, receiverId, content } = req.body;
    const senderId = req.user?._id as string;

    const message = await messageServices.createMessageService({
      conversationId,
      senderId,
      receiverId,
      content,
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

const editMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const updatedMessage = await messageServices.editMessageService(
      messageId,
      content
    );

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

const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    await messageServices.deleteMessageService(messageId);

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

const getAllMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const messages = await messageServices.getAllMessagesService(
      conversationId,
      {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      }
    );

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

const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body; // The user who read the message

    const updatedMessage = await messageServices.markMessageAsReadService(
      messageId,
      userId
    );

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

export default {
  createMessage,
  editMessage,
  deleteMessage,
  getAllMessages,
  markMessageAsRead,
};
