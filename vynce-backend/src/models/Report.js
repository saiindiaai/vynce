const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reporterName: { type: String, default: "" },
  reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reportedUsername: { type: String, default: "" },
  type: { type: String, required: true, enum: ["user", "post", "drop", "comment", "house"] },
  reason: { type: String, required: true },
  message: { type: String, default: "" },
  meta: { type: Object, default: {} },
  device: { type: String, default: "" },
  severity: { type: String, enum: ["low", "medium", "high"], default: "low" },
  status: { type: String, enum: ["pending", "reviewed", "resolved", "dismissed"], default: "pending" },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewedAt: { type: Date },
  notes: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
