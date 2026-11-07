import { Schema, model, Types, Document } from "mongoose";
import { PlanLimits, planLimitsSchema } from "./billing.plan.model";
export interface PlanSnapshot {
  key: string; version: number; name: string; priceCents: number; currency: "usd"; limits: PlanLimits;
}
const snapshotSchema = new Schema<PlanSnapshot>({
  key: { type: String, required: true }, version: { type: Number, required: true },
  name: { type: String, required: true }, priceCents: { type: Number, required: true },
  currency: { type: String, enum: ["usd"], required: true }, limits: { type: planLimitsSchema, required: true },
}, { _id: false });
export interface IBillingAccount extends Document {
  _id: Types.ObjectId; companyId: Types.ObjectId;
  stripeCustomerId?: string; stripeSubscriptionId?: string; stripeStatus?: string;
  snapshot?: PlanSnapshot; paidThrough?: Date; lastPaidInvoiceId?: string; cancelAtPeriodEnd?: boolean;
  pendingCheckoutSessionId?: string; checkoutPendingUntil?: Date;
}
const schema = new Schema<IBillingAccount>({
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, unique: true },
  stripeCustomerId: { type: String }, stripeSubscriptionId: { type: String },
  stripeStatus: { type: String, enum: ["incomplete", "incomplete_expired", "trialing", "active", "past_due", "unpaid", "canceled", "paused"] },
  snapshot: { type: snapshotSchema }, paidThrough: Date, lastPaidInvoiceId: String, cancelAtPeriodEnd: { type: Boolean, default: false },
  pendingCheckoutSessionId: String, checkoutPendingUntil: Date,
}, { timestamps: true });
schema.index({ stripeCustomerId: 1 }, { unique: true, sparse: true });
schema.index({ stripeSubscriptionId: 1 }, { unique: true, sparse: true });
export default model<IBillingAccount>("BillingAccount", schema);
