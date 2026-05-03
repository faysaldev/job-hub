import mongoose, { Schema, Document, Types } from "mongoose";

export interface IConversation extends Document {
  _id: Types.ObjectId;
  participants: [Types.ObjectId, Types.ObjectId]; // Exactly 2 participants for one-to-one chat
  lastMessage?: Types.ObjectId;
  status?: "applied" | "under_review" | "interview" | "rejected" | "hired";
  role?: string;
  job_id?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: true,
      validate: {
        validator: function (value: Types.ObjectId[]) {
          return value.length === 2; // Exactly 2 participants for one-to-one conversation
        },
        message: "One-to-one conversation must have exactly 2 participants.",
      },
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    status: {
      type: String,
      enum: ["applied", "under_review", "interview", "rejected", "hired"],
    },
    role: {
      type: String,
      trim: true,
    },
    job_id: {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
  },
  { timestamps: true }
);

// Add indexes for better query performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ "participants.0": 1, "participants.1": 1 }); // For one-to-one conversations
conversationSchema.index({ updatedAt: -1 });

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default Conversation;
