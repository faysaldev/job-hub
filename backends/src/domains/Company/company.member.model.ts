import { Schema, model, Types, Document } from "mongoose";

export type TeamRole = "owner" | "admin" | "recruiter" | "interviewer";
export interface ICompanyMember extends Document {
  _id: Types.ObjectId;
  companyId: Types.ObjectId;
  email: string;
  userId?: Types.ObjectId;
  role: Exclude<TeamRole, "owner">;
  status: "invited" | "active" | "removed";
  invitedBy: Types.ObjectId;
  invitedAt: Date;
  joinedAt?: Date;
}
const memberSchema = new Schema<ICompanyMember>({
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, immutable: true },
  email: { type: String, lowercase: true, trim: true, required: true, immutable: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  role: { type: String, enum: ["admin", "recruiter", "interviewer"], required: true },
  status: { type: String, enum: ["invited", "active", "removed"], default: "invited" },
  invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  invitedAt: { type: Date, default: Date.now },
  joinedAt: Date,
}, { timestamps: true, versionKey: false });
memberSchema.index({ companyId: 1, email: 1 }, { unique: true });
memberSchema.index({ userId: 1, status: 1 });
memberSchema.index({ userId: 1 }, { unique: true,
  partialFilterExpression: { userId: { $exists: true }, status: "active" } });
memberSchema.index({ email: 1, status: 1 });
export default model<ICompanyMember>("CompanyMember", memberSchema);
