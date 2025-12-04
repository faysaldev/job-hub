import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  content: string;
  messageType: "text" | "image" | "file" | "audio" | "video";
  isRead: boolean;
  readAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  repliedTo?: Types.ObjectId;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "audio", "video"],
      default: "text",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    repliedTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    attachments: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

// Add indexes for better query performance
messageSchema.index({ conversationId: 1, createdAt: -1 }); // For fetching messages in a conversation
messageSchema.index({ senderId: 1 }); // For fetching messages by sender
messageSchema.index({ receiverId: 1 }); // For fetching messages by receiver
messageSchema.index({ isRead: 1, receiverId: 1 }); // For fetching unread messages for a user
messageSchema.index({ createdAt: -1 }); // For ordering messages by time

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
