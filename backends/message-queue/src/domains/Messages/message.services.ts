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

export const createMessageService = async (data: CreateMessageData) => {
  const { conversationId, senderId, receiverId, content, messageType = "text", attachments } = data;

  // Validate ObjectIds
  if (!Types.ObjectId.isValid(conversationId) || !Types.ObjectId.isValid(senderId) || !Types.ObjectId.isValid(receiverId)) {
    throw new Error("Invalid IDs provided");
  }

  // Check if the conversation exists and if the sender is part of it
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Check if sender is part of the conversation
  const isSenderInConversation = conversation.participants.some(
    (participant: Types.ObjectId) => participant.toString() === senderId
  );

  if (!isSenderInConversation) {
    throw new Error("Sender is not part of this conversation");
  }

  // Create the message
  const message = new Message({
    conversationId,
    senderId,
    receiverId,
    content,
    messageType,
    attachments,
  });

  const savedMessage = await message.save();

  // Update the conversation with the new message information
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: savedMessage._id,
    lastMessageAt: new Date(),
  });

  // Update unread counts for the receiver
  const participantIndex = conversation.participants.indexOf(senderId);
  const receiverIndex = participantIndex === 0 ? 1 : 0;

  if (receiverIndex === 0) {
    await Conversation.findByIdAndUpdate(conversationId, {
      $inc: { user1UnreadCount: 1 },
    });
  } else {
    await Conversation.findByIdAndUpdate(conversationId, {
      $inc: { user2UnreadCount: 1 },
    });
  }

  return savedMessage.populate(["senderId", "receiverId"]);
};

export const editMessageService = async (messageId: string, newContent: string) => {
  if (!Types.ObjectId.isValid(messageId)) {
    throw new Error("Invalid message ID");
  }

  const message = await Message.findById(messageId);
  if (!message) {
    throw new Error("Message not found");
  }

  // Update the message content
  message.content = newContent;
  message.updatedAt = new Date();

  return await message.save();
};

export const deleteMessageService = async (messageId: string) => {
  if (!Types.ObjectId.isValid(messageId)) {
    throw new Error("Invalid message ID");
  }

  const message = await Message.findById(messageId);
  if (!message) {
    throw new Error("Message not found");
  }

  return await Message.findByIdAndDelete(messageId);
};

export const getAllMessagesService = async (
  conversationId: string,
  options: { page: number; limit: number }
) => {
  if (!Types.ObjectId.isValid(conversationId)) {
    throw new Error("Invalid conversation ID");
  }

  const { page, limit } = options;

  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Find messages in the conversation, populate sender/receiver, and sort by creation date
  const messages = await Message.find({ conversationId })
    .populate("senderId", "name image")
    .populate("receiverId", "name image")
    .sort({ createdAt: -1 }) // Most recent first
    .skip(skip)
    .limit(limit);

  // Get total count for pagination info
  const total = await Message.countDocuments({ conversationId });

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

export const markMessageAsReadService = async (messageId: string, userId: string) => {
  if (!Types.ObjectId.isValid(messageId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid IDs provided");
  }

  const message = await Message.findById(messageId);
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
    const receiverIndex = conversation.participants.indexOf(userId);
    const senderIndex = receiverIndex === 0 ? 1 : 0;

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