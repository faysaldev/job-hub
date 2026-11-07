import { Schema, model, Types } from "mongoose";
const schema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  stripeInvoiceId: { type: String, required: true, unique: true },
  total: { type: Number, required: true, min: 0 }, remaining: { type: Number, required: true, min: 0 },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });
schema.index({ companyId: 1, expiresAt: 1, remaining: 1 });
export default model("BillingCreditGrant", schema);
