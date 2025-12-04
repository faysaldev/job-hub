import { Request, Response } from "express";
import conversationService from "./conversations.services";
import { ProtectedRequest } from "../../types/protected-request";

const createConversation = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;
    const { participants } = req.body;

    // Handle both string and array formats for participants
    let participantsArray: string[] = [];

    if (typeof participants === "string") {
      // Single participant ID provided, create conversation with current user
      participantsArray = [userId, participants];
    } else if (Array.isArray(participants) && participants.length === 1) {
      // Single participant in array format
      participantsArray = [userId, participants[0]];
    } else if (Array.isArray(participants) && participants.length === 2) {
      // Two participants provided, ensure current user is one of them
      if (!participants.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: "Current user must be one of the participants",
        });
      }
      participantsArray = participants;
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Participants must be either a single user ID string or an array with exactly one or two user IDs, including the current user",
      });
    }

    // Validate that we have exactly 2 unique participants
    if (participantsArray.length !== 2) {
      return res.status(400).json({
        success: false,
        message:
          "Exactly 2 participants are required for a private conversation",
      });
    }

    // Ensure the two participants are different
    if (participantsArray[0] === participantsArray[1]) {
      return res.status(400).json({
        success: false,
        message: "Cannot create conversation with the same user",
      });
    }

    // Check if conversation already exists between these participants
    let conversation =
      await conversationService.findConversationByParticipantsService(
        participantsArray,
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
      participantsArray,
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

const getUserConversations = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;

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
