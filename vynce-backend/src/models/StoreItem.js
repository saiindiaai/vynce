// src/models/StoreItem.js
const mongoose = require("mongoose");

const StoreItemSchema = new mongoose.Schema(
  {
    /* -------------------------
       BASIC IDENTITY
    ------------------------- */
    key: { type: String, unique: true, required: true },
    name: { type: String, required: true },

    description: {
      type: String,
      default: "",
    },

    /* -------------------------
       CATEGORY & RARITY
    ------------------------- */
    category: {
      type: String,
      enum: ["theme", "badge", "frame", "effect", "ui-pack", "misc"],
      default: "theme",
    },

    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
    },

    /* -------------------------
       PRICES
    ------------------------- */
    priceEnergy: { type: Number, default: 0 },
    priceCelestium: { type: Number, default: 0 },

    /* -------------------------
       DURATION (temporary purchases)
    ------------------------- */
    durationHours: {
      type: Number,
      default: 48, // only used when priceEnergy > 0
    },

    /* -------------------------
       LIMITED EDITION SUPPORT
    ------------------------- */
    isLimited: {
      type: Boolean,
      default: false,
    },

    stock: {
      type: Number,
      default: null, // null = unlimited
    },

    /* -------------------------
       PREVIEW + METADATA
    ------------------------- */
    preview: { type: String, default: "" },

    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

/* -------------------------
   INDEXING FOR PERFORMANCE
------------------------- */
StoreItemSchema.index({ key: 1 });
StoreItemSchema.index({ category: 1 });
StoreItemSchema.index({ rarity: 1 });

module.exports = mongoose.model("StoreItem", StoreItemSchema);
