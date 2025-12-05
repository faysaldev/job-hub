import mongoose, { Schema, Document, Types } from "mongoose";

export interface INotification extends Document {
  _id: Types.ObjectId;
  title: string;
  link: string;
  sender: Types.ObjectId; // User ID of the sender
  receiver: Types.ObjectId; // User ID of the receiver
  isRead: boolean; // Track if notification has been read
  isDeleted?: boolean; // Track if notification has been soft deleted
}

const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
notificationSchema.index({ receiver: 1, createdAt: -1 }); // For fetching notifications by receiver
notificationSchema.index({ receiver: 1, isRead: 1 }); // For fetching unread notifications
notificationSchema.index({ receiver: 1, isDeleted: 1 }); // For excluding soft deleted notifications

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default Notification;
