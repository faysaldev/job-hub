import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAMUser extends Document {
  _id: Types.ObjectId; // Explicitly typing _id
  name: string;
  email: string;
  password: string;
  image: string;
  role: string;
}

const userSchema = new Schema<IAMUser>(
  {
    name: {
      type: String,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: "https://lpx-khalid.s3.ap-southeast-1.amazonaws.com/user.png",
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IAMUser>("User", userSchema);

export default User;
