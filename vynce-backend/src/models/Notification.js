const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["actionable", "informational"],
    required: true
  },
  category: {
    type: String,
    enum: ["house_join", "fight_request", "gang_add", "reaction", "comment", "follow", "level_up", "milestone"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending"
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  actionData: {
    // For actionable notifications
    requestId: String, // ID of the request (house join, fight, etc.)
    requesterId: mongoose.Schema.Types.ObjectId, // Who made the request
    targetId: mongoose.Schema.Types.ObjectId, // Target of the action (house, fight, etc.)
    actionType: String, // "approve" or "reject"
  },
  metadata: {
    // Additional data for display/context
    dropId: mongoose.Schema.Types.ObjectId,
    houseId: mongoose.Schema.Types.ObjectId,
    fightId: mongoose.Schema.Types.ObjectId,
    reactionType: String,
    level: Number,
  },
  priority: {
    type: String,
    enum: ["HIGH", "NORMAL"],
    default: "NORMAL",
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  resolvedAt: Date, // When actionable notification was resolved
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);