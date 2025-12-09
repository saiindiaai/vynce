// src/models/Achievement.js
const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true },

    /* -------------------------
       UI DETAILS
    ------------------------- */
    title: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" }, // UI asset (SVG/PNG)
    category: {
      type: String,
      enum: ["social", "connect", "ai", "store", "system", "profile", "daily"],
      default: "system",
    },

    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
    },

    /* -------------------------
       TRIGGER SYSTEM
    ------------------------- */
    trigger: {
      type: String,
      enum: [
        "post_upload",
        "message_sent",
        "profile_complete",
        "first_purchase",
        "first_follow",
        "reach_level",
        "daily_login",
        "custom",
      ],
      default: "custom",
    },

    triggerValue: {
      type: Number,
      default: 1, // e.g., upload 1 post, reach level 5, etc.
    },

    /* -------------------------
       REWARDS
    ------------------------- */
    rewardXP: { type: Number, default: 0 },
    rewardEnergy: { type: Number, default: 0 },
    rewardCelestium: { type: Number, default: 0 },
    rewardBadge: { type: String, default: "" },

    /* -------------------------
       BEHAVIOR
    ------------------------- */
    repeatable: { type: Boolean, default: false }, // daily login / repeat tasks
    hidden: { type: Boolean, default: false }, // hidden achievements

    /* -------------------------
       PROGRESS ACHIEVEMENTS (NEW)
       Example: Upload 10 posts or reach Level 5
    ------------------------- */
    maxProgress: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", AchievementSchema);
