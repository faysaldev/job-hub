import { Schema, model, Types } from "mongoose";
const schema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  stripeInvoiceId: { type: String, required: true, unique: true, immutable: true },
  stripeSubscriptionId: { type: String, required: true },
  stripePaymentIntentId: { type: String }, reversedAt: Date,
  amountPaidCents: { type: Number, min: 0, required: true }, currency: { type: String, required: true },
  invoiceUrl: { type: String }, paidAt: { type: Date, required: true },
  periodEnd: { type: Date, required: true }, planKey: { type: String, required: true }, planVersion: { type: Number, required: true },
}, { timestamps: true, versionKey: false });
schema.index({ companyId: 1, paidAt: -1 });
schema.index({ stripePaymentIntentId: 1 }, { sparse: true });
export default model("BillingInvoice", schema);
