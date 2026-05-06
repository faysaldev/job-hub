import mongoose, { Schema, Document, Types } from "mongoose";

export interface IActivityLog extends Document {
  userId: Types.ObjectId;
  activityTitle: string;
  date: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activityTitle: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for efficient queries by user and date
activityLogSchema.index({ userId: 1, date: -1 });

const ActivityLog = mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);

export default ActivityLog;
