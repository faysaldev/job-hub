import { Schema, model } from "mongoose";
const schema = new Schema({
  _id: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ["processing", "processed", "failed"], required: true },
  lockedUntil: Date, processedAt: Date, attempts: { type: Number, default: 1 },
  lastError: String,
}, { timestamps: true, versionKey: false });
schema.index({ status: 1, lockedUntil: 1 });
export default model("BillingStripeEvent", schema);
