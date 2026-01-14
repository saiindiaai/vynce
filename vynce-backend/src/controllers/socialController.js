const User = require("../models/User");
const Notification = require("../models/Notification");
const { trackFollowInterest } = require("../social/utils/interestTracker");

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

    const user = await User.findById(userId);

    // Try to find target user by uid first, then by _id if uid fails
    let targetUser;
    if (targetUserId.match(/^[0-9a-fA-F]{24}$/)) {
      // Looks like MongoDB ObjectId
      targetUser = await User.findById(targetUserId);
    } else {
      // Assume it's a uid
      targetUser = await User.findOne({ uid: targetUserId });
    }

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.equals(targetUser._id)) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    // Check if already following
    if (user.following.includes(targetUser._id)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Check if target user has private account
    if (targetUser.privacy?.visibility === 'private') {
      // Check if follow request already pending
      if (targetUser.pendingFollowRequests.includes(user._id)) {
        return res.status(400).json({ message: "Follow request already pending" });
      }

      // Add to pending follow requests
      targetUser.pendingFollowRequests.push(user._id);
      await targetUser.save();

      // Notify the target user of follow request
      await Notification.create({
        user: targetUser._id,
        type: "FOLLOW_REQUEST",
        title: "Gang Join Request",
        message: `${user.username} requested to join your gang`,
        metadata: { requesterId: user._id },
        priority: "NORMAL",
        pinned: false,
      });

      return res.json({ message: "Follow request sent" });
    }

    // For public accounts, follow directly
    // Add to following list
    user.following.push(targetUser._id);
    await user.save();

    // Add to target's followers list
    targetUser.followers.push(user._id);
    await targetUser.save();

    // Track interest based on followed user's content
    await trackFollowInterest(userId, targetUser._id);

    // Notify the target user
    await Notification.create({
      user: targetUser._id,
      type: "NEW_FOLLOWER",
      title: "New follower",
      message: `${user.username} started following you`,
      metadata: { followerId: user._id },
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

    // Try to find target user by uid first, then by _id if uid fails
    let targetUser;
    if (targetUserId.match(/^[0-9a-fA-F]{24}$/)) {
      // Looks like MongoDB ObjectId
      targetUser = await User.findById(targetUserId);
    } else {
      // Assume it's a uid
      targetUser = await User.findOne({ uid: targetUserId });
    }

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if following
    if (!user.following.includes(targetUser._id)) {
      return res.status(400).json({ message: "Not following this user" });
    }

    // Remove from following list
    user.following = user.following.filter(id => !id.equals(targetUser._id));
    await user.save();

    // Remove from target's followers list
    targetUser.followers = targetUser.followers.filter(id => !id.equals(user._id));
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
   APPROVE FOLLOW REQUEST
   ================================ */
exports.approveFollowRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { requesterId } = req.body;

    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if request exists
    const requestIndex = user.pendingFollowRequests.findIndex(id => id.equals(requester._id));
    if (requestIndex === -1) {
      return res.status(400).json({ message: "Follow request not found" });
    }

    // Remove from pending requests
    user.pendingFollowRequests.splice(requestIndex, 1);

    // Add to followers
    user.followers.push(requester._id);
    await user.save();

    // Add to requester's following
    requester.following.push(user._id);
    await requester.save();

    // Notify the requester
    await Notification.create({
      user: requester._id,
      type: "FOLLOW_APPROVED",
      title: "Follow request approved",
      message: `${user.username} approved your follow request`,
      metadata: { approverId: user._id },
      priority: "NORMAL",
      pinned: false,
    });

    res.json({ message: "Follow request approved" });
  } catch (err) {
    console.error("approveFollowRequest error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   REJECT FOLLOW REQUEST
   ================================ */
exports.rejectFollowRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { requesterId } = req.body;

    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if request exists
    const requestIndex = user.pendingFollowRequests.findIndex(id => id.equals(requester._id));
    if (requestIndex === -1) {
      return res.status(400).json({ message: "Follow request not found" });
    }

    // Remove from pending requests
    user.pendingFollowRequests.splice(requestIndex, 1);
    await user.save();

    // Notify the requester
    await Notification.create({
      user: requester._id,
      type: "FOLLOW_REJECTED",
      title: "Follow request declined",
      message: `${user.username} declined your follow request`,
      metadata: { rejectorId: user._id },
      priority: "NORMAL",
      pinned: false,
    });

    res.json({ message: "Follow request rejected" });
  } catch (err) {
    console.error("rejectFollowRequest error:", err);
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
