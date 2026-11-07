import { Response } from "express";
import { ProtectedRequest } from "../../types/protected-request";
import messageServices from "./message.services";
import { asyncHandler } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";

/**
 * DELETE /messages/:messageId
 * Hard-deletes a message. All other operations (send, edit, read) are
 * handled in real-time via Socket.IO events.
 */
const deleteMessage = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { messageId } = req.params;

  await messageServices.deleteMessageService(messageId, req.user!._id);

  res.status(httpStatus.OK).json(
    response({
      message: "Message deleted successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    }),
  );
});

export default {
  deleteMessage,
};
