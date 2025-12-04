import Message from "./message.model";
import Conversation from "../Conversations/conversations.model";
import { Types } from "mongoose";

interface CreateMessageData {
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType?: "text" | "image" | "file" | "audio" | "video";
  attachments?: string[];
}

const createMessageService = async (data: CreateMessageData) => {
  const {
    conversationId,
    senderId,
    receiverId,
    content,
    messageType = "text",
    attachments,
  } = data;

  // Validate ObjectIds
  if (
    !Types.ObjectId.isValid(conversationId) ||
    !Types.ObjectId.isValid(senderId) ||
    !Types.ObjectId.isValid(receiverId)
  ) {
    throw new Error("Invalid IDs provided");
  }

  // Convert string IDs to ObjectId
  const conversationObjectId = new Types.ObjectId(conversationId);
  const senderObjectId = new Types.ObjectId(senderId);
  const receiverObjectId = new Types.ObjectId(receiverId);

  // Check if the conversation exists and if the sender is part of it
  const conversation = await Conversation.findById(conversationObjectId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Check if sender is part of the conversation
  const isSenderInConversation = conversation.participants.some(
    (participant: Types.ObjectId) => participant.equals(senderObjectId)
  );

  if (!isSenderInConversation) {
    throw new Error("Sender is not part of this conversation");
  }

  // Create the message
  const message = new Message({
    conversationId: conversationObjectId,
    senderId: senderObjectId,
    receiverId: receiverObjectId,
    content,
    messageType,
    attachments,
  });

  const savedMessage = await message.save();

  // Update the conversation with the new message information
  await Conversation.findByIdAndUpdate(conversationObjectId, {
    lastMessage: savedMessage._id,
    lastMessageAt: new Date(),
  });

  // Update unread counts for the receiver
  const participantIndex = conversation.participants.findIndex(
    (participant: Types.ObjectId) => participant.equals(senderObjectId)
  );
  const receiverIndex = participantIndex === 0 ? 1 : 0;

  if (receiverIndex === 0) {
    await Conversation.findByIdAndUpdate(conversationObjectId, {
      $inc: { user1UnreadCount: 1 },
    });
  } else {
    await Conversation.findByIdAndUpdate(conversationObjectId, {
      $inc: { user2UnreadCount: 1 },
    });
  }

  return savedMessage.populate(["senderId", "receiverId"]);
};

const editMessageService = async (messageId: string, newContent: string) => {
  if (!Types.ObjectId.isValid(messageId)) {
    throw new Error("Invalid message ID");
  }

  const messageObjectId = new Types.ObjectId(messageId);

  const message = await Message.findById(messageObjectId);
  if (!message) {
    throw new Error("Message not found");
  }

  // Update the message content
  message.content = newContent;
  message.updatedAt = new Date();

  return await message.save();
};

const deleteMessageService = async (messageId: string) => {
  if (!Types.ObjectId.isValid(messageId)) {
    throw new Error("Invalid message ID");
  }

  const messageObjectId = new Types.ObjectId(messageId);

  const message = await Message.findById(messageObjectId);
  if (!message) {
    throw new Error("Message not found");
  }

  return await Message.findByIdAndDelete(messageObjectId);
};

const getAllMessagesService = async (
  conversationId: string,
  options: { page: number; limit: number }
) => {
  if (!Types.ObjectId.isValid(conversationId)) {
    throw new Error("Invalid conversation ID");
  }

  const conversationObjectId = new Types.ObjectId(conversationId);
  const { page, limit } = options;

  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Find messages in the conversation, populate sender/receiver, and sort by creation date
  const messages = await Message.find({ conversationId: conversationObjectId })
    .populate("senderId", "name image")
    .populate("receiverId", "name image")
    .sort({ createdAt: -1 }) // Most recent first
    .skip(skip)
    .limit(limit);

  // Get total count for pagination info
  const total = await Message.countDocuments({
    conversationId: conversationObjectId,
  });

  return {
    messages,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMessages: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
};

const markMessageAsReadService = async (messageId: string, userId: string) => {
  if (!Types.ObjectId.isValid(messageId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid IDs provided");
  }

  const messageObjectId = new Types.ObjectId(messageId);
  const userObjectId = new Types.ObjectId(userId);

  const message = await Message.findById(messageObjectId);
  if (!message) {
    throw new Error("Message not found");
  }

  // Update the message as read
  message.isRead = true;
  message.readAt = new Date();

  const updatedMessage = await message.save();

  // Find the conversation and update the unread count for the user
  const conversation = await Conversation.findById(message.conversationId);
  if (conversation) {
    // Determine which user's unread count to decrement
    const receiverIndex = conversation.participants.findIndex(
      (participant: Types.ObjectId) => participant.equals(userObjectId)
    );

    if (receiverIndex === 0) {
      // Decrement user1's unread count
      await Conversation.findByIdAndUpdate(message.conversationId, {
        $inc: { user1UnreadCount: -1 },
      });
    } else {
      // Decrement user2's unread count
      await Conversation.findByIdAndUpdate(message.conversationId, {
        $inc: { user2UnreadCount: -1 },
      });
    }
  }

  return updatedMessage.populate(["senderId", "receiverId"]);
};

export default {
  createMessageService,
  editMessageService,
  deleteMessageService,
  getAllMessagesService,
  markMessageAsReadService,
};
