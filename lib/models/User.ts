import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  studentId: string;
  phoneNumber: string;
  phoneVerified: boolean;
  phoneVerificationCode?: string;
  phoneVerificationExpires?: Date;
  studentIdValidated: boolean;
  studentIdValidationScore?: number;
  verificationStatus: "pending_verification" | "verified" | "rejected";
  profileImage?: string;
  studentIdImage?: {
    url: string;
    publicId: string;
  };
  selfieImage?: {
    url: string;
    publicId: string;
  };
  gender?: "male" | "female" | "other";
  indexNumber?: string;
  programmeOfStudy?: string;
  currentYear?: number;
  rating: number;
  totalDeliveries: number;
  joinedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      unique: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\+233\d{9}$/, "Please enter a valid Ghana phone number"],
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerificationCode: String,
    phoneVerificationExpires: Date,
    studentIdValidated: {
      type: Boolean,
      default: false,
    },
    studentIdValidationScore: Number,
    verificationStatus: {
      type: String,
      enum: ["pending_verification", "verified", "rejected"],
      default: "pending_verification",
    },
    profileImage: String,
    studentIdImage: {
      url: String,
      publicId: String,
    },
    selfieImage: {
      url: String,
      publicId: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    indexNumber: String,
    programmeOfStudy: String,
    currentYear: {
      type: Number,
      min: 1,
      max: 6,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    totalDeliveries: {
      type: Number,
      default: 0,
      min: 0,
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ studentId: 1 });
UserSchema.index({ phoneNumber: 1 });

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
