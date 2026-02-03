import { Request, Response } from "express";
import messageServices from "./message.services";
import { asyncHandler } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

const createMessage = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { conversationId, receiverId, content } = req.body;
  const senderId = req.user?._id as string;

  const message = await messageServices.createMessageService({
    conversationId,
    senderId,
    receiverId,
    content,
  });

  res.status(httpStatus.CREATED).json(
    response({
      message: "Message created successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: message,
    })
  );
});

const editMessage = asyncHandler(async (req: Request, res: Response) => {
  const { messageId } = req.params;
  const { content } = req.body;

  const updatedMessage = await messageServices.editMessageService(messageId, content);

  res.status(httpStatus.OK).json(
    response({
      message: "Message updated successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: updatedMessage,
    })
  );
});

const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const { messageId } = req.params;

  await messageServices.deleteMessageService(messageId);

  res.status(httpStatus.OK).json(
    response({
      message: "Message deleted successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

const getAllMessages = asyncHandler(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const messages = await messageServices.getAllMessagesService(conversationId, {
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  });

  res.status(httpStatus.OK).json(
    response({
      message: "Messages retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: messages,
    })
  );
});

const markMessageAsRead = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { messageId } = req.params;
  const userId = req.user?._id as string;

  const updatedMessage = await messageServices.markMessageAsReadService(messageId, userId);

  res.status(httpStatus.OK).json(
    response({
      message: "Message marked as read successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: updatedMessage,
    })
  );
});

export default {
  createMessage,
  editMessage,
  deleteMessage,
  getAllMessages,
  markMessageAsRead,
};
