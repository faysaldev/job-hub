import mongoose, { Schema, Types } from "mongoose";

export type EmailPurpose = "verification" | "password-reset" | "team-invite";
export interface IMailOutbox {
  userId: Types.ObjectId;
  companyId?: Types.ObjectId;
  purpose: EmailPurpose;
  to: string;
  subject: string;
  encryptedBody: string;
  status: "pending" | "sending" | "sent" | "failed";
  attempts: number;
  availableAt: Date;
  leaseUntil?: Date;
  expiresAt: Date;
  retainUntil: Date;
  sentAt?: Date;
}

const schema = new Schema<IMailOutbox>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  companyId: { type: Schema.Types.ObjectId, ref: "Company" },
  purpose: { type: String, enum: ["verification", "password-reset", "team-invite"], required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  encryptedBody: { type: String, required: true, select: false },
  status: { type: String, enum: ["pending", "sending", "sent", "failed"], default: "pending" },
  attempts: { type: Number, default: 0 },
  availableAt: { type: Date, default: Date.now },
  leaseUntil: { type: Date },
  expiresAt: { type: Date, required: true },
  retainUntil: { type: Date, required: true },
  sentAt: { type: Date },
}, { timestamps: true });

schema.index({ status: 1, availableAt: 1, leaseUntil: 1 });
schema.index({ userId: 1, purpose: 1, createdAt: -1 });
schema.index({ companyId: 1, purpose: 1, to: 1, status: 1 });
schema.index({ retainUntil: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model<IMailOutbox>("MailOutbox", schema);
