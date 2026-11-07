import { Schema, model } from "mongoose";

/** Append-only operational audit. Never store bearer tokens, resumes or payment secrets. */
const schema = new Schema({
  actorId: { type: Schema.Types.ObjectId, ref: "User", required: true, immutable: true },
  action: { type: String, required: true, maxlength: 60, immutable: true },
  targetKind: { type: String, required: true, maxlength: 40, immutable: true },
  targetId: { type: String, required: true, maxlength: 100, immutable: true },
  before: { type: String, maxlength: 160, immutable: true },
  after: { type: String, maxlength: 160, immutable: true },
  reason: { type: String, maxlength: 1000, immutable: true },
  requestId: { type: String, maxlength: 80, immutable: true },
}, { timestamps: { createdAt: true, updatedAt: false }, versionKey: false });
schema.index({ createdAt: -1 });
schema.index({ targetKind: 1, targetId: 1, createdAt: -1 });
schema.index({ actorId: 1, createdAt: -1 });
export default model("OperationsAudit", schema);
