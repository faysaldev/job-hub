import mongoose, { Schema, Document, Types } from "mongoose";

// Define the interface for the SavedJob document
export interface ISavedJob extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // The user who saved the job
  jobId: Types.ObjectId; // The ID of the job that was saved
}

// Create the Mongoose schema for the saved job model
const savedJobSchema = new Schema<ISavedJob>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job", // Reference to the Job collection
      required: true,
    },
  },
  { timestamps: true }
);

// Create the model based on the schema
const SavedJob = mongoose.model<ISavedJob>("SavedJob", savedJobSchema);

export default SavedJob;
