import mongoose, { Document, Schema, Types } from "mongoose";

export type AssetKind = "avatar" | "company-logo" | "resume" | "attachment";
export type AssetStatus = "pending" | "ready";
export interface IAsset extends Document {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  kind: AssetKind;
  status: AssetStatus;
  visibility: "public" | "private";
  bucket: string;
  key: string;
  fileName: string;
  mimeType: string;
  size: number;
  conversationId?: Types.ObjectId;
  expiresAt?: Date;
  legacyUrl?: string;
  createdAt: Date;
}

const assetSchema = new Schema<IAsset>({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true, immutable: true },
  kind: { type: String, enum: ["avatar", "company-logo", "resume", "attachment"], required: true, immutable: true },
  status: { type: String, enum: ["pending", "ready"], default: "pending" },
  visibility: { type: String, enum: ["public", "private"], required: true, immutable: true },
  bucket: { type: String, required: true, immutable: true, select: false },
  key: { type: String, required: true, unique: true, immutable: true, select: false },
  fileName: { type: String, required: true, maxlength: 180, immutable: true },
  mimeType: { type: String, required: true, immutable: true },
  size: { type: Number, required: true, min: 1, immutable: true },
  conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
  // Pending upload permits expire automatically; finalized objects must unset this field.
  expiresAt: { type: Date },
  legacyUrl: { type: String, select: false },
}, { timestamps: true, versionKey: false });
assetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
assetSchema.index({ owner: 1, kind: 1, createdAt: -1 });
assetSchema.index({ conversationId: 1, status: 1 });
export default mongoose.model<IAsset>("Asset", assetSchema);
