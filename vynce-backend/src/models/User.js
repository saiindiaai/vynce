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

    ageVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
