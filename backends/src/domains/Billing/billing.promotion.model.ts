import { Schema, model, Types } from "mongoose";
const schema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  requestId: { type: String, required: true },
  source: { type: String, enum: ["credit", "stripe"], required: true },
  durationDays: { type: Number, enum: [7, 30], required: true },
  status: { type: String, enum: ["pending", "active", "failed", "reversed"], default: "pending" },
  priceCents: { type: Number, required: true, min: 0 },
  stripeCheckoutSessionId: String, creditGrantId: { type: Schema.Types.ObjectId, ref: "BillingCreditGrant" },
  startsAt: Date, endsAt: Date,
}, { timestamps: true });
schema.index({ companyId: 1, requestId: 1 }, { unique: true });
schema.index({ stripeCheckoutSessionId: 1 }, { unique: true, sparse: true });
schema.index({ jobId: 1, status: 1, endsAt: -1 });
schema.index({ companyId: 1, createdAt: -1 });
export default model("JobPromotion", schema);
