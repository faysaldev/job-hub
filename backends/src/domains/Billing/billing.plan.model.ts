import { Schema, model, Types, Document } from "mongoose";

export interface PlanLimits { activeJobs: number; teamSeats: number; monthlyCredits: number }
export interface IBillingPlan extends Document {
  _id: Types.ObjectId; key: string; version: number; name: string; description: string;
  priceCents: number | null; currency: "usd"; limits: PlanLimits; features: string[];
  published: boolean; isCurrent: boolean; enterprise: boolean; createdBy?: Types.ObjectId;
  createdAt: Date; updatedAt: Date;
}
export const planLimitsSchema = new Schema<PlanLimits>({
  activeJobs: { type: Number, required: true, min: 0, max: 100000 },
  teamSeats: { type: Number, required: true, min: 1, max: 100000 },
  monthlyCredits: { type: Number, required: true, min: 0, max: 10000 },
}, { _id: false });
const planSchema = new Schema<IBillingPlan>({
  key: { type: String, required: true, lowercase: true, trim: true, match: /^[a-z][a-z0-9-]{1,39}$/ },
  version: { type: Number, required: true, min: 1 },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, default: "", maxlength: 500 },
  priceCents: { type: Number, default: null, min: 0, max: 10000000 },
  currency: { type: String, enum: ["usd"], default: "usd", immutable: true },
  limits: { type: planLimitsSchema, required: true },
  features: { type: [String], default: [], validate: [(items: string[]) => items.length <= 20, "Too many features"] },
  published: { type: Boolean, default: false },
  isCurrent: { type: Boolean, default: false },
  enterprise: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true, versionKey: false });
planSchema.index({ key: 1, version: 1 }, { unique: true });
planSchema.index({ key: 1, isCurrent: 1 }, { unique: true, partialFilterExpression: { isCurrent: true } });
planSchema.index({ published: 1, isCurrent: 1, priceCents: 1 });
export default model<IBillingPlan>("BillingPlan", planSchema);
