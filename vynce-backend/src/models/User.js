const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    /* -------------------------
       CORE IDENTITY
    ------------------------- */
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

    avatar: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    /* -------------------------
       LEVELING & ECONOMY
    ------------------------- */
    level: {
      type: Number,
      default: 1,
    },

    xp: {
      type: Number,
      default: 0,
    },

    energy: {
      type: Number,
      default: 1000,
    },

    celestium: {
      type: Number,
      default: 0,
    },

    celestiumTransactions: [
      {
        type: { type: String, enum: ["earned", "spent"], required: true },
        amount: { type: Number, required: true },
        note: { type: String, default: "" },
        date: { type: Date, default: Date.now },
      },
    ],

    energyHistory: [
      {
        amount: Number,
        reason: String,
        date: { type: Date, default: Date.now },
      },
    ],

    inventory: [
      {
        key: String,
        name: String,
        permanent: { type: Boolean, default: false },
        acquiredAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, default: null },
        meta: { type: Object, default: {} },
      },
    ],

    badges: {
      type: [String],
      default: [],
    },

    /* -------------------------
     PROFILE SHOWCASE SLOTS
     ------------------------- */
    showcase: {
      inventory: {
        type: [String], // store item keys the user wants to flex
        default: [],
      },
      achievements: {
        type: [String], // achievement / badge keys to flex
        default: [],
      },
      dares: {
        type: [String], // completed dare IDs or titles
        default: [],
      },
    },

    /* -------------------------
       PROFILE DETAILS
    ------------------------- */
    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },

    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

    pendingFollowRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

    savedPosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    }],

    savedDrops: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drop",
    }],

    savedCapsules: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Capsule",
    }],

    /* -------------------------
       USER INTERESTS (STEP 4)
    ------------------------- */
    interests: {
      type: Map,
      of: Number, // topic -> score
      default: new Map(),
    },

    installedApps: {
      type: [String],
      default: [],
    },

    profileUpdatedAt: {
      type: Date,
      default: null,
    },

    ageVerified: {
      type: Boolean,
      default: false,
    },

    /* -------------------------
       THEME SETTINGS
    ------------------------- */
    theme: {
      type: String,
      default: "Monochrome Royale",
    },

    /* -------------------------
       NOTIFICATION SYSTEM
    ------------------------- */

    // USER NOTIFICATION PREFERENCES
    notificationSettings: {
      general: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      appUpdates: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },

    // NOTIFICATION INBOX (STEP 7: Actionable Priority)
    notifications: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
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
        title: { type: String, required: true },
        message: { type: String, required: true },
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
        date: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
        resolvedAt: Date, // When actionable notification was resolved
      },
    ],

    /* -------------------------
       PRIVACY SETTINGS
    ------------------------- */
    privacy: {
      visibility: {
        type: String,
        enum: ["public", "friends", "private"],
        default: "public",
      },
      searchable: { type: Boolean, default: true },
      showActivity: { type: Boolean, default: true },
      showLastSeen: { type: Boolean, default: false },
      dataConsent: { type: Boolean, default: true },
    },

    /* -------------------------
       ACCOUNT INFO
    ------------------------- */
    accountInfo: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
