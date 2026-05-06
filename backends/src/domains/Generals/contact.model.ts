import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  fullName: string;
  email: string;
  department: string;
  subject: string;
  message: string;
  createdAt: Date;
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
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Contact = mongoose.model<IContact>("Contact", contactSchema);

export default Contact;
