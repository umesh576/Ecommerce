import mongoose from "mongoose";
import { Role } from "../@types/global.types";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required"],
      max: [50, "First name can not exceed 50 characters"],
      min: [3, "First name should be at least 3 characters long"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required"],
      max: [50, "Last Name can not exceed 50 characters"],
      min: [3, "Last Name should be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "User with provided email already exists."],
      match: [emailRegex, "Please enter a valid email format"],
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.user,
    },
    phoneNumber: {
      type: String,
      required: false,
      min: [10, "Phone number must be at least 10 digit long"],
    },
    password: {
      type: String,
      required: true,
      min: [6, "Password must be 6 character long"],
    },
    gender: {
      type: String,
    },
    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "product",
      },
    ],
  },
  { timestamps: true }
);

// const User = mongoose.model("user", userSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
