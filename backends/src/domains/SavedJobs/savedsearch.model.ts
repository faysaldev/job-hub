import { Schema, model, Document, Types } from "mongoose";
export interface ISavedSearch extends Document {
  userId: Types.ObjectId; name: string;
  filters: { q?: string; category?: string; location?: string; type?: string; locationType?: string };
  alertsEnabled: boolean; frequency: "daily" | "weekly"; lastCheckedAt?: Date;
}
const schema = new Schema<ISavedSearch>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User", immutable: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  filters: { q: { type: String, maxlength: 100 }, category: { type: String, maxlength: 100 },
    location: { type: String, maxlength: 100 }, type: { type: String, maxlength: 50 },
    locationType: { type: String, enum: ["remote", "onsite", "hybrid"] } },
  alertsEnabled: { type: Boolean, default: false }, frequency: { type: String, enum: ["daily", "weekly"], default: "daily" },
  lastCheckedAt: Date,
}, { timestamps: true });
schema.index({ userId: 1, createdAt: -1 });
schema.index({ alertsEnabled: 1, lastCheckedAt: 1 });
export default model<ISavedSearch>("SavedSearch", schema);
