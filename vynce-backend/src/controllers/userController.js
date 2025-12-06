const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");

// Utility: Generate random UID
function generateUID() {
  return "uid_" + Math.random().toString(36).substring(2, 10);
}

/* ================================
   REGISTER (username + password)
   ================================ */
exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ username });
    if (exists)
      return res.status(400).json({ message: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // Generate UID (8-digit, random, unique)
    const uid = "U" + Math.floor(10000000 + Math.random() * 90000000);

    const newUser = await User.create({
      username,
      password: hashed,
      uid,
      displayName: "",
      accountType: "standard",
    });

    return res.json({
      user: newUser,
      token: generateToken(newUser._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   LOGIN
   ================================ */
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid username or password" });

    res.json({
      user: {
        uid: user.uid,
        username: user.username,
        displayName: user.displayName,
      },
      token: generateToken(user._id),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   GUEST LOGIN
   ================================ */
exports.guestLogin = async (req, res) => {
  try {
    const random = Math.floor(100000 + Math.random() * 999999);

    const user = await User.create({
      username: `guest_${random}`,
      password: "guest_temp",       // dummy password to satisfy schema
      displayName: "Guest User",
      accountType: "guest",
      uid: "G" + random,            // generate UID for guest
      level: 1,                     // guest must have level
      energy: 1000,                 // guest must have energy
      bio: "",
      installedApps: [],
      accountInfo: {},
    });

    res.json({
      user: {
        uid: user.uid,
        username: user.username,
        displayName: user.displayName,
        accountType: user.accountType,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   GET LOGGED-IN USER  (FIXED)
================================ */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password -__v"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const level = user.level || 1;
    const xp = user.xp || 0;
    const nextXP = (level + 1) * 1000;
    const percent = Math.min(100, Math.floor((xp / nextXP) * 100));

    res.json({
      uid: user.uid || "GUEST",
      username: user.username,
      displayName: user.displayName,
      level,
      xp,
      nextXP,
      percent,
      energy: user.energy ?? 1000,
      celestium: user.celestium ?? 0,
      celestiumTransactions: user.celestiumTransactions || [],
      inventory: user.inventory || [],
      badges: user.badges || [],
      accountType: user.accountType,
      createdAt: user.createdAt,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGOUT USER (auto-delete guest accounts)
exports.logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If guest → delete account fully
    if (user.accountType === "guest") {
      await User.findByIdAndDelete(req.userId);
      return res.json({ message: "Guest account deleted" });
    }

    // Standard users → just respond success
    return res.json({ message: "Logout successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   (Optional leftover) Onboarding
   ================================ */
exports.updateOnboarding = async (req, res) => {
  try {
    const { ageVerified } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.userId,
      { ageVerified },
      { new: true }
    ).select("-password");

    res.json({
      message: "Onboarding updated",
      user: updated,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE DISPLAY NAME (simple version)
exports.updateDisplayName = async (req, res) => {
  try {
    const { displayName } = req.body;
    if (!displayName)
      return res.status(400).json({ message: "Missing displayName" });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { displayName, profileUpdatedAt: Date.now() },
      { new: true }
    ).select("-password");

    return res.json({
      message: "Display name updated",
      user
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// UPDATE DISPLAY NAME
exports.updateProfile = async (req, res) => {
  try {
    const { username, displayName } = req.body;

    if (!username || !displayName)
      return res.status(400).json({ message: "Missing fields" });

    // Check if username is taken by someone else
    const existing = await User.findOne({ username });
    if (existing && existing._id.toString() !== req.userId)
      return res.status(400).json({ message: "Username already taken" });

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        username,
        displayName,
        profileUpdatedAt: Date.now(),
      },
      { new: true }
    ).select("-password");

    return res.json({
      message: "Profile updated successfully",
      user,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// UPDATE GLOBAL BIO
exports.updateBio = async (req, res) => {
  try {
    const { bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { bio },
      { new: true }
    ).select("-password");

    res.json({ message: "Bio updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE ACCOUNT INFO (email / phone)
exports.updateAccountInfo = async (req, res) => {
  try {
    const { email, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { accountInfo: { email, phone } },
      { new: true }
    ).select("-password");

    res.json({ message: "Account info updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD INSTALLED APP
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

// REMOVE INSTALLED APP
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

// GET ENERGY STATUS
exports.getEnergy = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("energy energyHistory");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE ENERGY
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

// notification
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

// UPDATE PRIVACY SETTINGS
exports.updatePrivacy = async (req, res) => {
  try {
    const { profileVisibility, searchVisibility, dataConsent } = req.body;

    const updates = {};
    if (profileVisibility) updates.profileVisibility = profileVisibility;
    if (typeof searchVisibility === "boolean")
      updates.searchVisibility = searchVisibility;
    if (typeof dataConsent === "boolean")
      updates.dataConsent = dataConsent;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true }
    ).select("-password");

    res.json({ message: "Privacy settings updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;

    // Remove user from DB
    await User.findByIdAndDelete(userId);

    return res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.log("Delete error:", err);
    res.status(500).json({ message: "Failed to delete account" });
  }
};

// search
exports.searchUsers = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    const users = await User.find({
      username: { $regex: q, $options: "i" }
    }).select("username displayName _id");

    res.json(users);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// notification
exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("notifications");
    res.json(user.notifications || []);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// GET PUBLIC PROFILE
exports.getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select(
      "username displayName uid level bio energy"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================================
   PROFILE CARD – READ
   ================================ */
// GET /api/users/profile-card
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
        dares: []
      },
      inventoryCount: (user.inventory || []).length
    });
  } catch (err) {
    console.error("getProfileCard error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   PROFILE CARD – UPDATE SHOWCASE
   ================================ */
// PUT /api/users/profile-card/showcase
// body: { inventory?: string[], achievements?: string[], dares?: string[] }
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
      showcase: user.showcase
    });
  } catch (err) {
    console.error("updateProfileShowcase error:", err);
    res.status(500).json({ message: err.message });
  }
};


// UPDATE SHOWCASE ITEMS
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

// GET CELESTIUM STATUS
exports.getCelestium = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("celestium celestiumTransactions");

    res.json({
      celestium: user.celestium,
      celestiumTransactions: user.celestiumTransactions
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addCelestiumTransaction = async (req, res) => {
  try {
    const { type, amount, note } = req.body;

    if (!["earned", "spent"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    const user = await User.findById(req.user.id);

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
