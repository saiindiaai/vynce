const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, sparse: true },
    password: { type: String },
    displayName: { type: String, default: "" },
    accountType: { type: String, enum: ["standard", "guest"], default: "standard" },
    level: { type: Number, default: 1 },
    energy: { type: Number, default: 1000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
