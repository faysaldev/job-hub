import { Request, Response } from "express";
import conversationService from "./conversations.services";
import { ProtectedRequest } from "../../types/protected-request";

const createConversation = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;
    const { participants } = req.body;

    // Check if conversation already exists between these participants
    let conversation =
      await conversationService.findConversationByParticipantsService(
        participants,
        userId
      );

    if (conversation) {
      return res.status(200).json({
        success: true,
        message: "Conversation already exists",
        data: conversation,
      });
    }

    // Create a new conversation
    conversation = await conversationService.createConversationService(
      participants,
      userId
    );

    res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      data: conversation,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteConversation = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    await conversationService.deleteConversationService(conversationId);

    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const conversations = await conversationService.getUserConversationsService(
      userId
    );

    res.status(200).json({
      success: true,
      message: "Conversations retrieved successfully",
      data: conversations,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createConversation,
  deleteConversation,
  getUserConversations,
};
