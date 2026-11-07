import mongoose, { Document } from "mongoose";

export interface ICompany extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  companyLogo?: string;
  careersSlug?: string;
  careersHeadline?: string;
  careersDescription?: string;
  careersEnabled?: boolean;
  verification?: { status: "unverified" | "pending" | "verified" | "rejected"; requestedAt?: Date; reviewedAt?: Date; reviewedBy?: mongoose.Types.ObjectId; reason?: string };
  companyName?: string;
  industries?: string;
  companySize?: string;
  companyLocation?: string;
  website?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  billingQuotaRevision?: number;
}

const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    companyLogo: { type: String },
    billingQuotaRevision: { type: Number, default: 0, select: false },
    careersSlug: { type: String, trim: true, lowercase: true, minlength: 3, maxlength: 60, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
    careersHeadline: { type: String, trim: true, maxlength: 140 },
    careersDescription: { type: String, trim: true, maxlength: 3000 },
    careersEnabled: { type: Boolean, default: true },
    verification: { status: { type: String, enum: ["unverified", "pending", "verified", "rejected"], default: "unverified" },
      requestedAt: Date, reviewedAt: Date, reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, reason: String },
    companyName: {
      type: String,
    },
    industries: { type: String },
    companySize: { type: String },
    companyLocation: { type: String },
    website: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

companySchema.index({ createdAt: -1 });
companySchema.index({ careersSlug: 1 }, { unique: true, sparse: true });
companySchema.index({ companySize: 1, createdAt: -1 });
companySchema.index({ industries: 1, createdAt: -1 });
companySchema.virtual("jobs", {
  ref: "Job",
  localField: "userId",
  foreignField: "author",
});

export default mongoose.model<ICompany>("Company", companySchema);
