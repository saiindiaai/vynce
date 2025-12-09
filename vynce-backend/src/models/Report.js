// src/models/Report.js
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // may be null for anonymous
    reporterName: { type: String, default: "" }, // fallback name when anonymous
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // target user (if any)
    reportedUsername: { type: String, default: "" }, // fallback username string if we don't resolve id
    type: { type: String, enum: ["user", "issue"], required: true },
    reason: { type: String, required: true },
    message: { type: String, default: "" },
    device: { type: String, default: "" },
    meta: { type: Object, default: {} }, // optional extras (postId, url, app, etc.)
    status: { type: String, enum: ["open", "reviewed", "actioned", "dismissed"], default: "open" },
    severity: { type: String, enum: ["low", "medium", "high"], default: "low" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
