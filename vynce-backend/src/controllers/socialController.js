const User = require("../models/User");
const Notification = require("../models/Notification");

/* ================================
   FOLLOW USER
   ================================ */
exports.followUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: "Target user ID required" });
    }

    if (userId === targetUserId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    if (user.following.includes(targetUserId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Add to following list
    user.following.push(targetUserId);
    await user.save();

    // Add to target's followers list
    targetUser.followers.push(userId);
    await targetUser.save();

    // Notify the target user
    await Notification.create({
      user: targetUserId,
      type: "NEW_FOLLOWER",
      title: "New follower",
      message: `${user.username} started following you`,
      metadata: { followerId: userId },
      priority: "NORMAL",
      pinned: false,
    });

    res.json({
      message: "User followed successfully",
      followingCount: user.following.length,
      followersCount: targetUser.followers.length,
    });
  } catch (err) {
    console.error("followUser error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   UNFOLLOW USER
   ================================ */
exports.unfollowUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: "Target user ID required" });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if following
    if (!user.following.includes(targetUserId)) {
      return res.status(400).json({ message: "Not following this user" });
    }

    // Remove from following list
    user.following = user.following.filter(id => id.toString() !== targetUserId);
    await user.save();

    // Remove from target's followers list
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== userId);
    await targetUser.save();

    res.json({
      message: "User unfollowed successfully",
      followingCount: user.following.length,
      followersCount: targetUser.followers.length,
    });
  } catch (err) {
    console.error("unfollowUser error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   SEARCH USERS
   ================================ */
exports.searchUsers = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    const users = await User.find({
      username: { $regex: q, $options: "i" },
    }).select("username displayName _id");

    res.json(users);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* ================================
   GET NOTIFICATIONS
   ================================ */
exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("notifications");
    res.json(user.notifications || []);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
