import mongoose, { Schema, Document, Types } from "mongoose";
import { roles } from "../../config/roles";

const applicationSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 3,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
