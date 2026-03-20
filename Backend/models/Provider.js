const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceCategory: {
      type: String,
      enum: ["cleaning", "plumbing", "electrician", "carpentry", "painting", "moving", "other"],
      required: true,
    },
    experience: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    location: {
      latitude: Number,
      longitude: Number,
    },
    skills: [String],
    certifications: [String],
    photos: [String],
    verified: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for finding nearby providers
providerSchema.index({ "location.latitude": 1, "location.longitude": 1 });
providerSchema.index({ serviceCategory: 1 });
providerSchema.index({ userId: 1 });

module.exports = mongoose.model("Provider", providerSchema);
