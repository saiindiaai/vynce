const mongoose = require("mongoose");

const creatorPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contentType: {
      type: String,
      enum: ["drop", "capsule", "fight"],
      required: true,
    },
    title: {
      type: String,
      required: true,
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
    // Stats
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
creatorPostSchema.index({ author: 1, createdAt: -1 });
creatorPostSchema.index({ visibility: 1, published: 1 });

module.exports = mongoose.model("CreatorPost", creatorPostSchema);