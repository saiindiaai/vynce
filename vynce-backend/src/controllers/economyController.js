// src/controllers/economyController.js
const User = require("../models/User");
const { checkAchievementProgress } = require("../utils/achievementEngine");

// XP required per level
const XP_TABLE = [0, 0, 100, 250, 500, 900, 1400, 2000];

/* ======================================================
   HELPERS
====================================================== */

// Recalculate level based on XP
function computeLevel(xp) {
  let lvl = 1;
  for (let i = XP_TABLE.length - 1; i >= 1; i--) {
    if (xp >= XP_TABLE[i]) {
      lvl = i;
      break;
    }
  }
  return lvl;
}

/* ======================================================
   GET /api/economy/state     (NEW)
   Returns the full economy snapshot for UI
====================================================== */
exports.getEconomyState = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "xp level energy celestium badges inventory username displayName"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      xp: user.xp,
      level: user.level,
      energy: user.energy,
      celestium: user.celestium,
      badges: user.badges,
      inventory: user.inventory,
      username: user.username,
      displayName: user.displayName,
    });
  } catch (err) {
    console.error("getEconomyState error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   POST /api/economy/award-xp
   body: { amount, reason }
====================================================== */
exports.awardXP = async (req, res) => {
  try {
    const { amount = 0, reason = "unknown" } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const xpGain = Number(amount);
    if (isNaN(xpGain) || xpGain <= 0) return res.status(400).json({ message: "Invalid XP amount" });

    user.xp += xpGain;

    // Level-up calculation
    const newLevel = computeLevel(user.xp);
    const leveledUp = newLevel > user.level;

    if (leveledUp) {
      user.level = newLevel;
      await checkAchievementProgress(user._id, "level_up", newLevel);
    }

    await user.save();

    // XP achievement trigger
    await checkAchievementProgress(user._id, "xp_earned", xpGain);

    res.json({
      message: "XP awarded",
      xp: user.xp,
      level: user.level,
      leveledUp,
    });
  } catch (err) {
    console.error("awardXP error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   POST /api/economy/award-celestium
   body: { amount }
====================================================== */
exports.awardCelestium = async (req, res) => {
  try {
    const { amount = 0, reason = "unknown" } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const gain = Number(amount);
    if (isNaN(gain) || gain <= 0)
      return res.status(400).json({ message: "Invalid celestium amount" });

    user.celestium += gain;
    await user.save();

    await checkAchievementProgress(user._id, "celestium_earned", gain);

    res.json({
      message: "Celestium awarded",
      celestium: user.celestium,
    });
  } catch (err) {
    console.error("awardCelestium error:", err);
    res.status(500).json({ message: err.message });
  }
};
