import { Schema, model } from "mongoose";
/** Stripe refund/dispute tombstones, including events delivered before invoice.paid. */
const schema = new Schema({
  stripePaymentIntentId: { type: String, required: true, unique: true, immutable: true },
  observedAt: { type: Date, default: Date.now, required: true },
}, { timestamps: true, versionKey: false });
export default model("BillingPaymentReversal", schema);
