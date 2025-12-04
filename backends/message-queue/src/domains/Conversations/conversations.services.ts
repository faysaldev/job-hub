import Conversation from "./conversations.model";
import { Types } from "mongoose";

const createConversationService = async (
  participant1Id: string,
  participant2Id: string
) => {
  // Ensure the participants are different
  if (participant1Id === participant2Id) {
    throw new Error("Cannot create conversation between the same user");
  }

  // Validate ObjectIds
  if (
    !Types.ObjectId.isValid(participant1Id) ||
    !Types.ObjectId.isValid(participant2Id)
  ) {
    throw new Error("Invalid participant IDs");
  }

  // Check if conversation already exists (in any order)
  const existingConversation = await Conversation.findOne({
    participants: { $all: [participant1Id, participant2Id] },
  });

  if (existingConversation) {
    throw new Error("Conversation already exists between these participants");
  }

  const conversation = new Conversation({
    participants: [participant1Id, participant2Id],
  });

  return await conversation.save();
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
    .populate("participants", "name email image")
    .sort({ lastMessageAt: -1 }); // Sort by most recent message

  return conversations;
};

const findConversationByParticipantsService = async (
  participant1Id: string,
  participant2Id: string
) => {
  // Find conversation that includes both participants (in any order)
  const conversation = await Conversation.findOne({
    participants: { $all: [participant1Id, participant2Id] },
  }).populate("participants", "name email image");

  return conversation;
};

export default {
  createConversationService,
  deleteConversationService,
  getUserConversationsService,
  findConversationByParticipantsService,
};
