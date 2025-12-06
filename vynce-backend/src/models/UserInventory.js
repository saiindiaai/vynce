const mongoose = require("mongoose");

const userInventorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    key: { type: String, required: true }, // same as StoreItem.key

    permanent: { type: Boolean, default: false },

    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserInventory", userInventorySchema);
