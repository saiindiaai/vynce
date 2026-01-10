const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  houseId: { type: mongoose.Schema.Types.ObjectId, ref: "House", required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String },
  metadata: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
