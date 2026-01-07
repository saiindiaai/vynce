const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["group_chat", "community", "house", "broadcast"],
    required: true,
  },
  level: {
    type: Number,
    default: 1,
  },
  influence: {
    type: Number,
    default: 0,
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  pendingMembers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  foundedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  crest: {
    type: String,
  },
  channels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
  }],
  allyHouses: [{
    type: String,
  }],
  rivalHouses: [{
    type: String,
  }],
  history: [{
    type: String,
  }],
});

module.exports = mongoose.model("House", houseSchema);