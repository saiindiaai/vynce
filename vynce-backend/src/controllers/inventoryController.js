const UserInventory = require("../models/UserInventory");
const StoreItem = require("../models/StoreItem");

// GET /api/inventory/my
exports.getMyInventory = async (req, res) => {
  try {
    const items = await UserInventory.find({ userId: req.userId }).lean();
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// INTERNAL FUNCTION: create inventory entry on purchase
exports.addToInventory = async (userId, storeItem, method) => {
  const permanent = method === "celestium";
  const expiresAt = permanent
    ? null
    : new Date(Date.now() + (storeItem.durationHours || 48) * 60 * 60 * 1000);

  return UserInventory.create({
    userId,
    key: storeItem.key,
    permanent,
    expiresAt,
  });
};
