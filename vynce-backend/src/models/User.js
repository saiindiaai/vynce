const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      unique: true,
      sparse: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    displayName: {
      type: String,
      default: "",
    },

    accountType: {
      type: String,
      enum: ["standard", "guest"],
      default: "standard",
    },

    level: {
      type: Number,
      default: 1,
    },

    energy: {
      type: Number,
      default: 1000,
    },

    // ⭐ NEW: Global Bio
    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },

    // ⭐ NEW: Apps Installed
    installedApps: {
      type: [String], // example: ["vynce-social", "vynce-ai"]
      default: [],
    },

    // ⭐ NEW: Profile Avatar (future)
    avatar: {
      type: String,
      default: "",
    },

    // ⭐ NEW: Email / Mobile (not required)
    accountInfo: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" }
    },

    // ⭐ NEW: Profile updated timestamp
    profileUpdatedAt: {
      type: Date,
      default: null,
    },

    // ⭐ NEW: Country
    country: {
      type: String,
      default: "",
    },

    // ⭐ NEW: Energy Log (future rewards)
    energyHistory: [
      {
        amount: Number,
        reason: String,
        date: { type: Date, default: Date.now },
      },
    ],

    ageVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
