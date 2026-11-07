import mongoose, { Schema, Document, Types } from "mongoose";

export interface IInterview extends Document {
  application_id: Types.ObjectId;
  job_id: Types.ObjectId;
  interviewer: Types.ObjectId;
  interviewee: Types.ObjectId;
  date: Date;
  start_time: string; // e.g., "10:00 AM"
  end_time: string; // e.g., "11:00 AM"
  meet_link?: string;
  type: "video" | "audio" | "in-person";
  status: "scheduled" | "completed" | "cancelled";
  note?: string;
  scorecard?: { overall: number; recommendation: "strong_yes" | "yes" | "no" | "strong_no";
    criteria: Array<{ label: string; score: number }>; feedback?: string; submittedAt?: Date; submittedBy?: Types.ObjectId };
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterview>(
  {
    application_id: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    job_id: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    interviewer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interviewee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
    meet_link: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["video", "audio", "in-person"],
      default: "video",
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    note: { type: String, trim: true },
    scorecard: {
      overall: { type: Number, min: 1, max: 5 },
      recommendation: { type: String, enum: ["strong_yes", "yes", "no", "strong_no"] },
      criteria: [{ label: { type: String, trim: true, maxlength: 100 }, score: { type: Number, min: 1, max: 5 } }],
      feedback: { type: String, maxlength: 3000 },
      submittedAt: Date, submittedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
  },
  { timestamps: true }
);

// Indexes for performance
interviewSchema.index({ application_id: 1 });
interviewSchema.index({ interviewer: 1, date: 1 });
interviewSchema.index({ interviewee: 1, date: 1 });

const Interview = mongoose.model<IInterview>("Interview", interviewSchema);

export default Interview;
