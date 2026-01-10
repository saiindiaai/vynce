const mongoose = require("mongoose");

const capsuleSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    // Extended fields for Creator Hub
    contentType: {
      type: String,
      enum: ["capsule"],
      default: "capsule",
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    media: {
      url: String,
      type: {
        type: String,
        enum: ["image", "video"],
      },
    },
    tags: [{
      type: String,
      trim: true,
    }],
    visibility: {
      type: String,
      enum: ["public", "private", "draft", "scheduled"],
      default: "public",
    },
    scheduledAt: {
      type: Date,
    },
    // Capsule-specific styling
    gradient: {
      type: String,
      default: "from-purple-500 to-pink-500",
    },
    emoji: {
      type: String,
      default: "📱",
    },
    // Legacy fields for backward compatibility
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    commentsCount: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
capsuleSchema.index({ author: 1, createdAt: -1 });
capsuleSchema.index({ visibility: 1, createdAt: -1 });

module.exports = mongoose.model("Capsule", capsuleSchema);