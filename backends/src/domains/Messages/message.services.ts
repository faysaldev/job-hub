import Message from "./message.model";
import Conversation from "../Conversations/conversations.model";
import { AppError } from "../../lib/errors";
import { assertId } from "../../lib/query";
import conversationService from "../Conversations/conversations.services";
import { validateMessageAttachments, linkMessageAttachments } from "../Asset/asset.services";

const contentCheck = (value: unknown) => {
  if (typeof value !== "string" || !value.trim() || value.length > 4000) throw new AppError("Message must contain 1-4000 characters", 400);
  return value.trim();
};
const createMessageService = async (data: { conversationId: string; senderId: string; receiverId: string; content?: string; attachments?: string[] }) => {
  assertId(data.receiverId, "receiver ID");
  const conversation = await conversationService.ensureParticipant(data.conversationId, data.senderId);
  if (data.receiverId === data.senderId || !conversation.participants.some((id) => id.toString() === data.receiverId)) {
    throw new AppError("Receiver must be the other participant", 403);
  }
  const attachments = await validateMessageAttachments(data.attachments || [], data.senderId, data.conversationId);
  const content = typeof data.content === "string" ? data.content.trim() : "";
  if ((!content && !attachments.length) || content.length > 4000) throw new AppError("Message or attachment required", 400);
  // Bind files before publishing the message; other users cannot access unreferenced uploads.
  await linkMessageAttachments(data.attachments || [], data.senderId, data.conversationId);
  const message = await Message.create({ conversationId: conversation._id, senderId: data.senderId,
    receiverId: data.receiverId, content, attachments });
  await Conversation.updateOne({ _id: conversation._id }, {
    $set: { lastMessage: message._id }, $pull: { hiddenFor: { $in: [data.senderId, data.receiverId] } }
  });
  return message;
};
const editMessageService = async (id: string, content: string, actorId: string) => {
  assertId(id, "message ID");
  const message = await Message.findOneAndUpdate({ _id: id, senderId: actorId },
    { $set: { content: contentCheck(content) } }, { new: true, runValidators: true });
  if (!message) throw new AppError("Message not found", 404);
  await conversationService.ensureParticipant(message.conversationId.toString(), actorId);
  return message;
};
const deleteMessageService = async (id: string, actorId: string) => {
  assertId(id, "message ID");
  const message = await Message.findOne({ _id: id, senderId: actorId });
  if (!message) throw new AppError("Message not found", 404);
  await conversationService.ensureParticipant(message.conversationId.toString(), actorId);
  await Message.deleteOne({ _id: id, senderId: actorId });
  if ((await Conversation.findById(message.conversationId))?.lastMessage?.toString() === id) {
    const latest = await Message.findOne({ conversationId: message.conversationId }).sort({ createdAt: -1 }).select("_id");
    await Conversation.updateOne({ _id: message.conversationId }, { $set: { lastMessage: latest?._id || null } });
  }
  return message;
};
const getAllMessagesService = async (id: string, actorId: string, options: { page: number; limit: number }) => {
  const conversation = await conversationService.ensureParticipant(id, actorId);
  const page = Math.min(Math.max(Number(options.page) || 1, 1), 10000);
  const limit = Math.min(Math.max(Number(options.limit) || 20, 1), 50);
  const [messages, total] = await Promise.all([
    Message.find({ conversationId: conversation._id }).sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(limit).lean(),
    Message.countDocuments({ conversationId: conversation._id }),
  ]);
  return { messages, pagination: { currentPage: page, totalPages: Math.ceil(total / limit),
    totalMessages: total, hasNext: page * limit < total, hasPrev: page > 1 } };
};
const markMessageAsReadService = async (id: string, actorId: string) => {
  assertId(id, "message ID");
  const message = await Message.findOne({ _id: id, receiverId: actorId });
  if (!message) throw new AppError("Message not found", 404);
  await conversationService.ensureParticipant(message.conversationId.toString(), actorId);
  if (!message.isRead) await Message.updateOne({ _id: id, receiverId: actorId }, { $set: { isRead: true } });
  return { ...message.toObject(), isRead: true };
};
export default { createMessageService, editMessageService, deleteMessageService,
  getAllMessagesService, markMessageAsReadService };
