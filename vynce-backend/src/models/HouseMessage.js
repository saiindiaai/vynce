const mongoose = require("mongoose");

const houseMessageSchema = new mongoose.Schema({
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "House",
    required: true,
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HouseMessage",
  },
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    emoji: {
      type: String,
      required: true,
    },
  }],
  edited: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("HouseMessage", houseMessageSchema);