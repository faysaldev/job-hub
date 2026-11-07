import mongoose, { Schema, Document, Types } from "mongoose";
import { roles } from "../../config/roles";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface IAMUser extends Document {
  _id: Types.ObjectId; // Explicitly typing _id
  name: string;
  email: string;
  password: string;
  image: string;
  role: "seeker" | "recruiter" | "admin";
  phoneNumber: string;
  oneTimeCode: number | null;
  verificationCodeHash?: string;
  verificationExpiresAt?: Date;
  verificationAttempts: number;
  resetCodeHash?: string;
  resetExpiresAt?: Date;
  resetAttempts: number;
  isEmailVerified: boolean;
  isResetPassword: boolean;
  fcmToken: string;
  isDeleted: boolean;
  suspendedAt?: Date;
  suspensionReason?: string;
  suspendedBy?: Types.ObjectId;
  isPasswordMatch(password: string): Promise<boolean>; // Add this method to IAMUser interface
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
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    image: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number",
          );
        }
      },
    },
    role: {
      type: String,
      enum: roles,
      default: "seeker",
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    oneTimeCode: { type: Number, default: null, select: false },
    verificationCodeHash: { type: String, select: false },
    verificationExpiresAt: { type: Date },
    verificationAttempts: { type: Number, default: 0 },
    resetCodeHash: { type: String, select: false },
    resetExpiresAt: { type: Date },
    resetAttempts: { type: Number, default: 0 },
    isEmailVerified: { type: Boolean, default: false },
    isResetPassword: { type: Boolean, default: false },
    fcmToken: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
    suspendedAt: { type: Date },
    suspensionReason: { type: String, maxlength: 1000 },
    suspendedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

userSchema.methods.isPasswordMatch = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12); // Hash password with a salt of 8 rounds
  }
  next();
});

// Virtual for seeker profile
userSchema.virtual("seeker", {
  ref: "Seeker",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

userSchema.set("toJSON", { virtuals: true, transform(_doc, ret: Record<string, any>) {
  for (const key of ["password", "oneTimeCode", "verificationCodeHash", "resetCodeHash", "verificationExpiresAt", "resetExpiresAt", "verificationAttempts", "resetAttempts", "fcmToken", "isDeleted", "suspendedAt", "suspensionReason", "suspendedBy"]) delete ret[key];
  return ret;
} });
userSchema.set("toObject", { virtuals: true });

userSchema.index({ suspendedAt: 1 });
const User = mongoose.model<IAMUser>("User", userSchema);

export default User;
