import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  content: string;
  attachments?: Array<{ assetId: Types.ObjectId; name: string; mimeType: string; size: number }>;
  isRead: boolean;
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
    content: { type: String, required: false, default: "", trim: true, maxlength: 4000 },
    attachments: [{
      assetId: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
      name: { type: String, required: true },
      mimeType: { type: String, required: true },
      size: { type: Number, required: true },
      _id: false,
    }],
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Add indexes for better query performance
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ "attachments.assetId": 1 }); // For fetching messages in a conversation
const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
