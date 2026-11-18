import mongoose, { Schema } from "mongoose";

/** A company-scoped talent bookmark, NOT an application-stage change. */
const companyCandidateSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, immutable: true },
  seekerId: { type: Schema.Types.ObjectId, ref: "Seeker", required: true, immutable: true },
  status: { type: String, enum: ["saved", "shortlisted"], required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, immutable: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
companyCandidateSchema.index({ companyId: 1, seekerId: 1 }, { unique: true });
companyCandidateSchema.index({ companyId: 1, status: 1, updatedAt: -1 });
export default mongoose.model("CompanyCandidate", companyCandidateSchema);
