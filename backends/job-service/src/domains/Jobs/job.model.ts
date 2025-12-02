import mongoose, { Schema, Document, Types } from "mongoose";

// Define the interface for the Job document
export interface IJob extends Document {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  job_title: string;
  job_type: "full-time" | "part-time" | "contract" | "internship" | "freelance";
  location: string | "remote";
  experience: "entry" | "mid" | "senior" | "lead";
  salary: number;
  description: string;
  requirements: string[];
  benefits?: string[];
  isActive: boolean;
  application_date: Date;
}

// Create the Mongoose schema for the job model
const jobSchema = new Schema<IJob>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    job_title: { type: String, required: true },
    job_type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      required: true,
    },
    location: {
      type: String,
      required: true,
      enum: ["remote", "onsite", "hybrid"],
    },
    experience: {
      type: String,
      enum: ["entry", "mid", "senior", "lead"],
      required: true,
    },
    salary: { type: Number, required: true },
    description: { type: String, required: true },
    requirements: { type: [String], required: true },
    benefits: { type: [String] },
    isActive: { type: Boolean, required: true },
    application_date: { type: Date, required: true },
  },
  { timestamps: true }
);

// Create the model based on the schema
const Job = mongoose.model<IJob>("Job", jobSchema);

export default Job;
