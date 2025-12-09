// src/controllers/storeController.js

const StoreItem = require("../models/StoreItem");
const User = require("../models/User");
const { logEconomyEvent } = require("../utils/economyLogger");
const { checkAchievementProgress } = require("../utils/achievementEngine");

// GET /api/store
exports.getCatalog = async (req, res) => {
  try {
    const items = await StoreItem.find().sort({ createdAt: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/store/purchase
exports.purchaseItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { key, method } = req.body;

    if (!key || !method) {
      return res.status(400).json({ message: "Missing item key or method" });
    }

    // Fetch item
    const item = await StoreItem.findOne({ key });
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // BLOCK GUEST ACCOUNTS
    if (user.accountType === "guest") {
      return res.status(403).json({
        message: "Guest accounts cannot purchase items",
      });
    }

    let xpReward = 0;

    // -------------------------
    // CELESTIUM PURCHASE (PERMANENT)
    // -------------------------
    if (method === "celestium") {
      const price = Number(item.priceCelestium || 0);

      if (price <= 0) return res.status(400).json({ message: "Invalid store item price" });

      if (user.celestium < price) {
        return res.status(400).json({ message: "Not enough celestium" });
      }

      // Prevent duplicate permanent items
      const alreadyOwned = user.inventory.some((i) => i.key === item.key && i.permanent === true);

      if (alreadyOwned) {
        return res.status(400).json({ message: "You already own this permanently" });
      }

      // Deduct
      user.celestium -= price;
      xpReward = 25;

      // Add permanent inventory item
      user.inventory.push({
        key: item.key,
        name: item.name,
        permanent: true,
        expiresAt: null,
        acquiredAt: new Date(),
        meta: item.metadata || {},
      });

      // Achievement: spending celestium
      await checkAchievementProgress(userId, "spent_celestium", price);
    }

    // -------------------------
    // ENERGY PURCHASE (TEMPORARY)
    // -------------------------
    else if (method === "energy") {
      const price = Number(item.priceEnergy || 0);

      if (price <= 0) return res.status(400).json({ message: "Invalid store item price" });

      if (user.energy < price) {
        return res.status(400).json({ message: "Not enough energy" });
      }

      // Deduct
      user.energy -= price;
      xpReward = 10;

      // Expiration timestamp
      const expiresAt = new Date(Date.now() + (item.durationHours || 48) * 3600 * 1000);

      // Add temporary inventory item
      user.inventory.push({
        key: item.key,
        name: item.name,
        permanent: false,
        acquiredAt: new Date(),
        expiresAt,
        meta: item.metadata || {},
      });

      // Achievement: spending energy
      await checkAchievementProgress(userId, "spent_energy", price);
    }

    // -------------------------
    // Invalid method
    // -------------------------
    else {
      return res.status(400).json({ message: "Invalid purchase method" });
    }

    // -------------------------
    // XP REWARD APPLICATION
    // -------------------------
    user.xp += xpReward;

    // Save user
    await user.save();

    // Log economy event
    logEconomyEvent(userId, {
      event: "purchase",
      item: item.key,
      method,
      xpGained: xpReward,
      spent: method === "energy" ? item.priceEnergy : item.priceCelestium,
    });

    // Achievement: first purchase
    await checkAchievementProgress(userId, "first_purchase", 1);

    return res.json({
      message: "Purchase successful",
      inventory: user.inventory,
      xp: user.xp,
      energy: user.energy,
      celestium: user.celestium,
    });
  } catch (err) {
    console.error("purchaseItem ERROR", err);
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/store/inventory
exports.getInventory = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("inventory celestium energy xp badges");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
