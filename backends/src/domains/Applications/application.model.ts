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
      enum: ["applied", "under_review", "shortlisted", "interview", "offer", "rejected", "hired"],
      default: "applied",
    },
    paid_amount: { type: Number, default: 0, min: 0 },
    boostPaymentStatus: { type: String, enum: ["none", "pending", "paid"], default: "none" },
    stripeCheckoutSessionId: { type: String },
    boostPriceCents: { type: Number, min: 0 },
    isWithdrawn: { type: Boolean, default: false },
    withdrawnAt: { type: Date },
    stageHistory: [{ from: { type: String }, to: { type: String, required: true },
      actorId: { type: Types.ObjectId, ref: "User" }, at: { type: Date, default: Date.now }, note: { type: String, maxlength: 2000 } }],
    internalNotes: [{ text: { type: String, trim: true, required: true, maxlength: 3000 },
      authorId: { type: Types.ObjectId, ref: "User", required: true }, createdAt: { type: Date, default: Date.now } }],
    offer: {
      salary: { type: Number, min: 0 }, currency: { type: String, uppercase: true, maxlength: 3 },
      message: { type: String, maxlength: 4000 }, expiresAt: Date,
      status: { type: String, enum: ["sent", "accepted", "declined", "expired"] },
      sentBy: { type: Types.ObjectId, ref: "User" }, sentAt: Date, respondedAt: Date,
    },
    rejection_note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job_id: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ applicant: 1, createdAt: -1 });
applicationSchema.index({ resume_url: 1, isWithdrawn: 1, job_id: 1 });
applicationSchema.index({ job_id: 1, status: 1, createdAt: -1 });
applicationSchema.index({ applicant: 1, status: 1, createdAt: -1 });
applicationSchema.index({ stripeCheckoutSessionId: 1 }, { sparse: true });
const Application = mongoose.model("Application", applicationSchema);

export default Application;
