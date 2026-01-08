const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");

/* ================================
   REGISTER (username + password)
   ================================ */
exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "Username already exists" });

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
    if (!user) return res.status(400).json({ message: "Invalid username or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid username or password" });

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
      password: "guest_temp", // dummy password to satisfy schema
      displayName: "Guest User",
      accountType: "guest",
      uid: "G" + random, // generate UID for guest
      level: 1, // guest must have level
      energy: 1000, // guest must have energy
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
   LOGOUT USER (auto-delete guest accounts)
   ================================ */
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
