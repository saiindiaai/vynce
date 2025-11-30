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
      password: "",
      displayName: "Guest User",
      accountType: "guest",
      uid: null, // guests have no UID
    });

    res.json({
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   GET LOGGED-IN USER
   ================================ */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    res.json({
      uid: user.uid,
      username: user.username,
      displayName: user.displayName,
      level: user.level,
      energy: user.energy,
      accountType: user.accountType,
      createdAt: user.createdAt,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   UPDATE DISPLAY NAME
   ================================ */
exports.updateDisplayName = async (req, res) => {
  try {
    const { displayName } = req.body;

    if (!displayName)
      return res.status(400).json({ message: "Display Name required" });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { displayName },
      { new: true }
    ).select("-password");

    res.json({
      message: "Display Name updated",
      user
    });
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
