const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["admin", "resident", "security", "owner"],
      default: "resident",
      required: true,
    },
    flatNumber: {
      type: String,
      default: null, // only for residents
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);