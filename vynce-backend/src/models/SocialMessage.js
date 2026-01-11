const mongoose = require("mongoose");

const socialMessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderName: {
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
  read: {
    type: Boolean,
    default: false,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  reactions: [{
    type: {
      type: String,
      required: true,
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    byName: {
      type: String,
      required: true,
    }
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SocialMessage",
  },
  edited: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
  },
  imageUrl: {
    type: String,
  },
});

module.exports = mongoose.model("SocialMessage", socialMessageSchema);