// src/controllers/achievementController.js
const Achievement = require("../models/Achievement");
const User = require("../models/User");

/* =========================================
   GET ACHIEVEMENT CATALOG
   /api/achievements/catalog
========================================= */
exports.getCatalog = async (req, res) => {
  try {
    const list = await Achievement.find().sort({ createdAt: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================
   UNLOCK ACHIEVEMENT (MANUAL or ENGINE)
   /api/achievements/unlock
========================================= */
exports.unlock = async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) return res.status(400).json({ message: "Missing key" });

    const ach = await Achievement.findOne({ key });
    if (!ach) return res.status(404).json({ message: "Achievement not found" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    /* Already unlocked */
    if (ach.rewardBadge && user.badges.includes(ach.rewardBadge)) {
      return res.json({
        message: "Already unlocked",
        unlocked: false,
        user,
      });
    }

    /* Apply rewards */
    const rewards = {
      xp: ach.rewardXP || 0,
      energy: ach.rewardEnergy || 0,
      celestium: ach.rewardCelestium || 0,
      badge: ach.rewardBadge || null,
    };

    user.xp += rewards.xp;
    user.energy += rewards.energy;
    user.celestium += rewards.celestium;

    if (rewards.badge) user.badges.push(rewards.badge);

    await user.save();

    /* Return structured response */
    res.json({
      message: "Achievement unlocked",
      unlocked: true,
      achievement: {
        key: ach.key,
        title: ach.title,
        description: ach.description,
      },
      rewards,
      user,
    });
  } catch (err) {
    console.error("achievement unlock error:", err);
    res.status(500).json({ message: err.message });
  }
};
