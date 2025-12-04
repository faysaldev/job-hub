import Conversation from "./conversations.model";
import { Types } from "mongoose";

const createConversationService = async (
  participants: string[],
  currentUserId: string
) => {
  // Ensure exactly 2 participants for private one-to-one chat
  if (participants.length !== 2) {
    throw new Error(
      "Private one-to-one conversation must have exactly 2 participants"
    );
  }

  // Validate ObjectIds
  for (const participantId of participants) {
    if (!Types.ObjectId.isValid(participantId)) {
      throw new Error(`Invalid participant ID: ${participantId}`);
    }
  }

  // Ensure the participants are different
  if (participants[0] === participants[1]) {
    throw new Error("Cannot create conversation between the same user");
  }

  // Check if conversation already exists (in any order)
  const existingConversation = await Conversation.findOne({
    participants: { $all: participants },
  });

  if (existingConversation) {
    return existingConversation; // Return existing conversation instead of throwing an error
  }

  const conversation = new Conversation({
    participants: participants,
  });

  return await conversation.save();
};

// Additional service functions to handle sender/receiver specific operations
const markMessagesAsReadByUser = async (
  conversationId: string,
  userId: string
) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Determine which participant is the user (index 0 or 1) and reset their unread count
  if (conversation.participants[0].toString() === userId) {
    conversation.user1UnreadCount = 0;
  } else if (conversation.participants[1].toString() === userId) {
    conversation.user2UnreadCount = 0;
  } else {
    throw new Error("User is not part of this conversation");
  }

  return await conversation.save();
};

const incrementUnreadMessageCount = async (
  conversationId: string,
  recipientId: string
) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Increment the unread count for the recipient
  if (conversation.participants[0].toString() === recipientId) {
    conversation.user1UnreadCount += 1;
  } else if (conversation.participants[1].toString() === recipientId) {
    conversation.user2UnreadCount += 1;
  } else {
    throw new Error("Recipient is not part of this conversation");
  }

  return await conversation.save();
};

const findConversationByTwoUsers = async (user1Id: string, user2Id: string) => {
  // Find conversation between two specific users
  const conversation = await Conversation.findOne({
    participants: { $all: [user1Id, user2Id] },
  }).populate("participants", "name email image");

  return conversation;
};

const deleteConversationService = async (conversationId: string) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  return await Conversation.findByIdAndDelete(conversationId);
};

const getUserConversationsService = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  // Find conversations where the user is a participant
  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate("users", "name email image")
    .sort({ lastMessageAt: -1 }); // Sort by most recent message

  return conversations;
};

const findConversationByParticipantsService = async (
  participants: string[],
  currentUserId: string
) => {
  // Extract the other participant (not the current user)
  const otherParticipant = participants.find((id) => id !== currentUserId);

  if (!otherParticipant) {
    throw new Error("Current user must be one of the participants");
  }

  // Find conversation that includes both participants (in any order)
  const conversation = await Conversation.findOne({
    participants: { $all: participants },
  }).populate("participants", "name email image");

  return conversation;
};

export default {
  createConversationService,
  deleteConversationService,
  getUserConversationsService,
  findConversationByParticipantsService,
  markMessagesAsReadByUser,
  incrementUnreadMessageCount,
  findConversationByTwoUsers,
};
