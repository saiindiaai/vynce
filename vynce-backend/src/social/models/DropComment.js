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
  },
  { timestamps: true }
);

module.exports = mongoose.model("DropComment", dropCommentSchema);