const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    userData: {
      name:     String,
      phone:    String,
      password: String,
      role:     String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTP", otpSchema);