import mongoose, { Schema, Types } from "mongoose";

export interface IAuthSession {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  refreshHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
}

const sessionSchema = new Schema<IAuthSession>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  refreshHash: { type: String, required: true, select: false },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date },
}, { timestamps: true });

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
sessionSchema.index({ userId: 1, revokedAt: 1, createdAt: -1 });
export default mongoose.model<IAuthSession>("AuthSession", sessionSchema);
