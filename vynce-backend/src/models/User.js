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

    /* -------------------------
       GLOBAL BIO
    ------------------------- */
    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },

    /* -------------------------
       INSTALLED APPS
    ------------------------- */
    installedApps: {
      type: [String],
      default: [],
    },

    /* -------------------------
       PROFILE AVATAR
    ------------------------- */
    avatar: {
      type: String,
      default: "",
    },

    /* -------------------------
       ACCOUNT INFO
    ------------------------- */
    accountInfo: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
    },

    profileUpdatedAt: {
      type: Date,
      default: null,
    },

    country: {
      type: String,
      default: "",
    },

    /* -------------------------
       ENERGY LOG
    ------------------------- */
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

    /* -------------------------
       THEME SETTINGS  (NEW)
    ------------------------- */
    theme: {
      type: String,
      default: "Monochrome Royale",
    },

    /* -------------------------
       NOTIFICATION SETTINGS (NEW)
    ------------------------- */
    notifications: {
      general: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      appUpdates: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },

profileVisibility: {
  type: String,
  enum: ["public", "friends", "private"],
  default: "public",
},

notifications: [
  {
    title: String,
    message: String,
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }
],

searchVisibility: {
  type: Boolean,
  default: true,
},

dataConsent: {
  type: Boolean,
  default: true,
},

    /* -------------------------
       PRIVACY SETTINGS (NEW)
    ------------------------- */
    privacy: {
      showProfile: { type: Boolean, default: true },
      showActivity: { type: Boolean, default: true },
      showLastSeen: { type: Boolean, default: false },
      searchable: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
