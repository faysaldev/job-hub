import mongoose, { Schema } from "mongoose";
/** Seekers follow employers; the scheduler claims new jobs without adding HTTP polling endpoints. */
const schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, immutable: true },
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, immutable: true },
  lastCheckedAt: { type: Date, required: true, default: Date.now },
}, { timestamps: true });
schema.index({ userId: 1, companyId: 1 }, { unique: true });
schema.index({ lastCheckedAt: 1, companyId: 1 });
export default mongoose.model("CompanyFollow", schema);
