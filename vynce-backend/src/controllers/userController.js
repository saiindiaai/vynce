const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  try {
    const { username, password, displayName } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ username });
    if (exists)
      return res.status(400).json({ message: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashed,
      displayName: displayName || username,
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
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.guestLogin = async (req, res) => {
  try {
    const random = Math.floor(100000 + Math.random() * 999999);

    const user = await User.create({
      username: `guest_${random}`,
      password: "",
      displayName: "Guest User",
      accountType: "guest",
    });

    res.json({
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOnboarding = async (req, res) => {
  try {
    const { displayName, ageVerified, parentalPasskey } = req.body;

    const updates = {};

    if (displayName) updates.displayName = displayName;
    if (ageVerified !== undefined) updates.ageVerified = ageVerified;
    if (parentalPasskey) updates.parentalPasskey = parentalPasskey;

    const updated = await User.findByIdAndUpdate(
      req.userId,
      updates,
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
