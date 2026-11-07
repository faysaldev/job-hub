import mongoose, { Schema, Document, Types } from "mongoose";

// Define the interface for the Job document
export interface IJob extends Document {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  companyId?: Types.ObjectId;
  createdBy?: Types.ObjectId;
  status: "draft" | "scheduled" | "published" | "closed";
  publishAt?: Date;
  publishedAt?: Date;
  title: string;
  category: string;
  subcategory: string;
  type: "full-time" | "part-time" | "contract" | "internship" | "freelance";
  location: string;
  locationType: "remote" | "onsite" | "hybrid";
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: "hourly" | "daily" | "weekly" | "monthly" | "yearly";
  experienceLevel: "entry" | "junior" | "mid" | "senior" | "lead";
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  applicationDeadline: Date;
  positions: number;
  isActive: boolean;
  isDeleted: boolean;
  moderation?: { status: "clear" | "blocked"; reason?: string; reviewedAt?: Date; reviewedBy?: Types.ObjectId };
  sponsoredUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Mongoose schema for the job model
const jobSchema = new Schema<IJob>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["draft", "scheduled", "published", "closed"], default: "published" },
    publishAt: { type: Date },
    publishedAt: { type: Date },
    title: {
      type: String,
      required: false,
      trim: true,
    },
    category: {
      type: String,
      required: false,
      trim: true,
    },
    subcategory: {
      type: String,
      required: false,
      trim: true,
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      required: false,
    },
    location: {
      type: String,
      required: false,
      trim: true,
    },
    locationType: {
      type: String,
      enum: ["remote", "onsite", "hybrid"],
      required: false,
    },
    salaryMin: {
      type: Number,
      required: false,
      min: 0,
    },
    salaryMax: {
      type: Number,
      required: false,
      min: 0,
    },
    salaryPeriod: {
      type: String,
      enum: ["hourly", "daily", "weekly", "monthly", "yearly"],
      required: false,
      default: "yearly",
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "junior", "mid", "senior", "lead"],
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    requirements: {
      type: [String],
      required: false,
    },
    responsibilities: {
      type: [String],
      required: true,
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      required: false,
    },
    applicationDeadline: {
      type: Date,
      required: false,
    },
    positions: {
      type: Number,
      required: false,
      min: 1,
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    moderation: { status: { type: String, enum: ["clear", "blocked"], default: "clear" },
      reason: { type: String, maxlength: 1000 }, reviewedAt: Date, reviewedBy: { type: Schema.Types.ObjectId, ref: "User" } },
    sponsoredUntil: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for company profile
jobSchema.virtual("company", {
  ref: "Company",
  localField: "author",
  foreignField: "userId",
  justOne: true,
});

jobSchema.index({ author: 1, isDeleted: 1, createdAt: -1 });
jobSchema.index({ companyId: 1, status: 1, createdAt: -1 });
jobSchema.index({ status: 1, publishAt: 1, isDeleted: 1 });
jobSchema.index({ isActive: 1, isDeleted: 1, createdAt: -1 });
jobSchema.index({ isActive: 1, isDeleted: 1, applicationDeadline: 1, createdAt: -1 });
jobSchema.index({ author: 1, isActive: 1, isDeleted: 1, applicationDeadline: 1 });
jobSchema.index({ category: 1, type: 1, locationType: 1 });
jobSchema.index({ sponsoredUntil: -1, createdAt: -1 });
jobSchema.index({ "moderation.status": 1, createdAt: -1 });
jobSchema.virtual("isSponsored").get(function () { return !!this.sponsoredUntil && this.sponsoredUntil.getTime() > Date.now(); });

// Create the model based on the schema
const Job = mongoose.model<IJob>("Job", jobSchema);

export default Job;
