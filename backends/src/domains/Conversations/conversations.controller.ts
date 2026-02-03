import { Request, Response } from "express";
import conversationService from "./conversations.services";
import { asyncHandler } from "../../lib/errorsHandle";
import { AppError } from "../../lib/errors";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

const createConversation = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const userId = req.user?._id as string;
  const { participants } = req.body;

  let participantsArray: string[] = [];

  if (typeof participants === "string") {
    participantsArray = [userId, participants];
  } else if (Array.isArray(participants) && participants.length === 1) {
    participantsArray = [userId, participants[0]];
  } else if (Array.isArray(participants) && participants.length === 2) {
    if (!participants.includes(userId)) {
      throw new AppError("Current user must be one of the participants", httpStatus.BAD_REQUEST);
    }
    participantsArray = participants;
  } else {
    throw new AppError(
      "Participants must be either a single user ID string or an array with exactly one or two user IDs",
      httpStatus.BAD_REQUEST
    );
  }

  if (participantsArray.length !== 2) {
    throw new AppError(
      "Exactly 2 participants are required for a private conversation",
      httpStatus.BAD_REQUEST
    );
  }

  if (participantsArray[0] === participantsArray[1]) {
    throw new AppError("Cannot create conversation with the same user", httpStatus.BAD_REQUEST);
  }

  let conversation = await conversationService.findConversationByParticipantsService(
    participantsArray,
    userId
  );

  if (conversation) {
    res.status(httpStatus.OK).json(
      response({
        message: "Conversation already exists",
        status: "OK",
        statusCode: httpStatus.OK,
        data: conversation,
      })
    );
    return;
  }

  conversation = await conversationService.createConversationService(participantsArray, userId);

  res.status(httpStatus.CREATED).json(
    response({
      message: "Conversation created successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: conversation,
    })
  );
});

const deleteConversation = asyncHandler(async (req: Request, res: Response) => {
  const { conversationId } = req.params;

  await conversationService.deleteConversationService(conversationId);

  res.status(httpStatus.OK).json(
    response({
      message: "Conversation deleted successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

const getUserConversations = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const userId = req.user?._id as string;

  if (!userId) {
    throw new AppError("User ID is required", httpStatus.BAD_REQUEST);
  }

  const conversations = await conversationService.getUserConversationsService(userId);

  res.status(httpStatus.OK).json(
    response({
      message: "Conversations retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: conversations,
    })
  );
});

export default {
  createConversation,
  deleteConversation,
  getUserConversations,
};
