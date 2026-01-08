const User = require("../models/User");

/* ================================
   GET LOGGED-IN USER  (FIXED)
   ================================ */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const level = user.level || 1;
    const xp = user.xp || 0;
    const nextXP = (level + 1) * 1000;
    const percent = Math.min(100, Math.floor((xp / nextXP) * 100));

    res.json({
      user: {
        id: user._id,
        uid: user.uid,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatar: user.avatar,
        accountType: user.accountType,
        createdAt: user.createdAt,
      },
      progress: {
        level,
        xp,
        nextXP,
        percent,
      },
      status: {
        energy: user.energy ?? 1000,
        celestium: user.celestium ?? 0,
      },
      access: {
        roles: [user.accountType === "admin" ? "admin" : "user"],
        permissions: [],
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   GET PUBLIC PROFILE
   ================================ */
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
   (Optional leftover) Onboarding
   ================================ */
exports.updateOnboarding = async (req, res) => {
  try {
    const { ageVerified } = req.body;

    const updated = await User.findByIdAndUpdate(req.userId, { ageVerified }, { new: true }).select(
      "-password"
    );

    res.json({
      message: "Onboarding updated",
      user: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   UPDATE DISPLAY NAME (simple version)
   ================================ */
exports.updateDisplayName = async (req, res) => {
  try {
    const { displayName } = req.body;
    if (!displayName) return res.status(400).json({ message: "Missing displayName" });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { displayName, profileUpdatedAt: Date.now() },
      { new: true }
    ).select("-password");

    return res.json({
      message: "Display name updated",
      user,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ================================
   UPDATE PROFILE
   ================================ */
exports.updateProfile = async (req, res) => {
  try {
    const { username, displayName } = req.body;

    if (!username || !displayName) return res.status(400).json({ message: "Missing fields" });

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

/* ================================
   UPDATE GLOBAL BIO
   ================================ */
exports.updateBio = async (req, res) => {
  try {
    const { bio } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { bio }, { new: true }).select(
      "-password"
    );

    res.json({ message: "Bio updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   UPDATE ACCOUNT INFO (email / phone)
   ================================ */
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

/* ================================
   DELETE ACCOUNT
   ================================ */
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

/* ================================
   UPDATE PRIVACY SETTINGS
   ================================ */
exports.updatePrivacy = async (req, res) => {
  try {
    const { profileVisibility, searchVisibility, dataConsent } = req.body;

    const updates = {};
    if (profileVisibility) updates.profileVisibility = profileVisibility;
    if (typeof searchVisibility === "boolean") updates.searchVisibility = searchVisibility;
    if (typeof dataConsent === "boolean") updates.dataConsent = dataConsent;

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select(
      "-password"
    );

    res.json({ message: "Privacy settings updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
