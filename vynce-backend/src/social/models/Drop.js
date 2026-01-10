const mongoose = require("mongoose");

const dropSchema = new mongoose.Schema(
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
      enum: ["drop", "capsule", "fight"],
      default: "drop",
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
    // Fight-specific fields
    opponent: {
      type: String,
      trim: true,
    },
    fightType: {
      type: String,
      enum: ["visual", "text"],
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
dropSchema.index({ author: 1, createdAt: -1 });
dropSchema.index({ visibility: 1, createdAt: -1 });
dropSchema.index({ contentType: 1, createdAt: -1 });

module.exports = mongoose.model("Drop", dropSchema);