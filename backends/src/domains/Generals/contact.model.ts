import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  fullName: string;
  email: string;
  department: string;
  subject: string;
  message: string;
  createdAt: Date;
  status?: "open" | "in_progress" | "resolved";
  resolutionNote?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
}

const contactSchema = new Schema<IContact>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
    status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
    resolutionNote: { type: String, maxlength: 1000 },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

contactSchema.index({ status: 1, createdAt: -1 });
const Contact = mongoose.model<IContact>("Contact", contactSchema);

export default Contact;
