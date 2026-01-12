const mongoose = require("mongoose");

const dropCommentSchema = new mongoose.Schema(
  {
    drop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drop",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DropComment",
      default: null,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    dislikes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    repliesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DropComment", dropCommentSchema);