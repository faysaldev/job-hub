import { Schema, model } from "mongoose";

const schema = new Schema({
  reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true, immutable: true },
  targetKind: { type: String, enum: ["job", "company", "user"], required: true, immutable: true },
  targetId: { type: Schema.Types.ObjectId, required: true, immutable: true },
  category: { type: String, enum: ["spam", "fraud", "harassment", "misleading", "other"], required: true },
  description: { type: String, trim: true, required: true, maxlength: 2000 },
  status: { type: String, enum: ["open", "reviewing", "resolved", "dismissed"], default: "open" },
  reviewerId: { type: Schema.Types.ObjectId, ref: "User" },
  reviewedAt: Date,
  resolutionNote: { type: String, maxlength: 1000 },
}, { timestamps: true, versionKey: false });
schema.index({ status: 1, createdAt: -1 });
schema.index({ targetKind: 1, targetId: 1, createdAt: -1 });
schema.index({ reporterId: 1, createdAt: -1 });
export default model("OperationsReport", schema);
