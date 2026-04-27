import mongoose, { Schema, Document, Types } from "mongoose";

// Define the interface for the Job document
export interface IJob extends Document {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  title: string;
  category: string;
  subcategory: string;
  type: "full-time" | "part-time" | "contract" | "internship" | "freelance";
  location: string;
  locationType: "remote" | "onsite" | "hybrid";
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: "hourly" | "daily" | "weekly" | "monthly" | "yearly";
  experienceLevel: "junior" | "mid" | "senior" | "lead";
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  applicationDeadline: Date;
  positions: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Mongoose schema for the job model
const jobSchema = new Schema<IJob>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    locationType: {
      type: String,
      enum: ["remote", "onsite", "hybrid"],
      required: true,
    },
    salaryMin: {
      type: Number,
      required: true,
      min: 0,
    },
    salaryMax: {
      type: Number,
      required: true,
      min: 0,
    },
    salaryPeriod: {
      type: String,
      enum: ["hourly", "daily", "weekly", "monthly", "yearly"],
      required: true,
      default: "yearly",
    },
    experienceLevel: {
      type: String,
      enum: ["junior", "mid", "senior", "lead"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      required: true,
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
      required: true,
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    positions: {
      type: Number,
      required: true,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create the model based on the schema
const Job = mongoose.model<IJob>("Job", jobSchema);

export default Job;
