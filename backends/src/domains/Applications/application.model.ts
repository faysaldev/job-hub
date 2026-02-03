import mongoose, { Schema, Document, Types } from "mongoose";

const applicationSchema = new Schema(
  {
    cover_letter: {
      type: String,
      trim: true,
      minlength: 30,
    },
    resume_url: {
      type: String,
      required: true,
    },
    applicant: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    job_id: {
      type: Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "under_review", "interview", "rejected", "hired"],
      default: "applied",
    },
    paid_amount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
