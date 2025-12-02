import mongoose, { Schema, Document, Types } from "mongoose";

// Create the Mongoose schema for the saved job model
const savedJobSchema = new Schema(
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
const SavedJob = mongoose.model("SavedJob", savedJobSchema);

export default SavedJob;
