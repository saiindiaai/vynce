const User = require("../models/User");

/* ================================
   ADD INSTALLED APP
   ================================ */
exports.addInstalledApp = async (req, res) => {
  try {
    const { appId } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { installedApps: appId } },
      { new: true }
    ).select("-password");

    res.json({ message: "App added", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   REMOVE INSTALLED APP
   ================================ */
exports.removeInstalledApp = async (req, res) => {
  try {
    const { appId } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { installedApps: appId } },
      { new: true }
    ).select("-password");

    res.json({ message: "App removed", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   GET ENERGY STATUS
   ================================ */
exports.getEnergy = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("energy energyHistory");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   UPDATE ENERGY
   ================================ */
exports.updateEnergy = async (req, res) => {
  try {
    const { amount, reason } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $inc: { energy: amount },
        $push: { energyHistory: { amount, reason } },
      },
      { new: true }
    ).select("-password");

    res.json({ message: "Energy updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   UPDATE NOTIFICATIONS
   ================================ */
exports.updateNotifications = async (req, res) => {
  try {
    const { push, email, system } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { notifications: { push, email, system } },
      { new: true }
    ).select("-password");

    res.json({ message: "Notifications updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   GET CELESTIUM STATUS
   ================================ */
exports.getCelestium = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("celestium celestiumTransactions");

    res.json({
      celestium: user.celestium,
      celestiumTransactions: user.celestiumTransactions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   ADD CELESTIUM TRANSACTION
   ================================ */
exports.addCelestiumTransaction = async (req, res) => {
  try {
    const { type, amount, note } = req.body;

    if (!["earned", "spent"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    const user = await User.findById(req.userId);

    if (type === "spent" && user.celestium < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Update balance
    if (type === "earned") {
      user.celestium += amount;
    } else {
      user.celestium -= amount;
    }

    // Push new transaction
    user.celestiumTransactions.unshift({
      type,
      amount,
      note,
      date: new Date(),
    });

    await user.save();

    res.json({
      message: "Transaction added successfully",
      balance: user.celestium,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   PROFILE CARD – READ
   ================================ */
exports.getProfileCard = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "uid username displayName level xp energy celestium badges showcase inventory"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const level = user.level || 1;
    const xp = user.xp || 0;
    const nextXP = (level + 1) * 1000; // same formula you used in frontend
    const percent = Math.min(100, Math.floor((xp / nextXP) * 100));

    return res.json({
      uid: user.uid,
      username: user.username,
      displayName: user.displayName,
      level,
      xp,
      nextXP,
      percent,
      energy: user.energy,
      celestium: user.celestium || 0,
      badges: user.badges || [],
      showcase: user.showcase || {
        inventory: [],
        achievements: [],
        dares: [],
      },
      inventoryCount: (user.inventory || []).length,
    });
  } catch (err) {
    console.error("getProfileCard error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   PROFILE CARD – UPDATE SHOWCASE
   ================================ */
exports.updateProfileShowcase = async (req, res) => {
  try {
    const { inventory, achievements, dares } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // simple safety: cap slots to 3 each
    if (!user.showcase) user.showcase = {};

    if (Array.isArray(inventory)) {
      user.showcase.inventory = inventory.slice(0, 3);
    }
    if (Array.isArray(achievements)) {
      user.showcase.achievements = achievements.slice(0, 3);
    }
    if (Array.isArray(dares)) {
      user.showcase.dares = dares.slice(0, 3);
    }

    await user.save();

    return res.json({
      message: "Showcase updated",
      showcase: user.showcase,
    });
  } catch (err) {
    console.error("updateProfileShowcase error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   UPDATE SHOWCASE ITEMS (alternative)
   ================================ */
exports.updateShowcase = async (req, res) => {
  try {
    const { inventory = [], achievements = [], dares = [] } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.showcase = {
      inventory: inventory.slice(0, 3),
      achievements: achievements.slice(0, 3),
      dares: dares.slice(0, 3),
    };

    await user.save();

    res.json({ message: "Showcase updated", showcase: user.showcase });
  } catch (err) {
    console.log("updateShowcase error:", err);
    res.status(500).json({ message: err.message });
  }
};
