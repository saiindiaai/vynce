const Capsule = require("../models/Capsule");
const User = require("../../models/User");

/* CREATE CAPSULE */
exports.createCapsule = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content required" });
    }

    const capsule = await Capsule.create({
      author: req.userId,
      content,
    });

    res.status(201).json(capsule);
  } catch (err) {
    res.status(500).json({ message: "Create capsule failed" });
  }
};

/* GET CAPSULE FEED */
exports.getCapsuleFeed = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const { cursor } = req.query;

    const query = cursor ? { _id: { $lt: cursor }, visibility: "public" } : { visibility: "public" };

    const capsules = await Capsule.find(query)
      .populate("author", "username displayName uid avatar")
      .sort({ _id: -1 })
      .limit(limit + 1);

    let hasMore = false;
    let nextCursor = null;

    if (capsules.length > limit) {
      hasMore = true;
      capsules.pop();
      nextCursor = capsules[capsules.length - 1]._id;
    }

    res.json({
      capsules,
      hasMore,
      nextCursor,
    });
  } catch (err) {
    console.error("Get capsule feed error:", err);
    res.status(500).json({ message: "Failed to fetch capsules" });
  }
};

/* GET USER CAPSULES */
exports.getUserCapsules = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const { cursor } = req.query;
    const userId = req.userId;

    const query = cursor ? { _id: { $lt: cursor }, author: userId } : { author: userId };

    const capsules = await Capsule.find(query)
      .populate("author", "username displayName uid avatar")
      .sort({ _id: -1 })
      .limit(limit + 1);

    let hasMore = false;
    let nextCursor = null;

    if (capsules.length > limit) {
      hasMore = true;
      capsules.pop();
      nextCursor = capsules[capsules.length - 1]._id;
    }

    res.json({
      capsules,
      hasMore,
      nextCursor,
    });
  } catch (err) {
    console.error("Get user capsules error:", err);
    res.status(500).json({ message: "Failed to fetch user capsules" });
  }
};

/* TOGGLE CAPSULE LIKE */
exports.toggleCapsuleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const capsule = await Capsule.findById(id);
    if (!capsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }

    const isLiked = capsule.likes.includes(userId);

    if (isLiked) {
      capsule.likes = capsule.likes.filter(id => id.toString() !== userId);
    } else {
      capsule.likes.push(userId);
    }

    await capsule.save();

    res.json({
      capsuleId: id,
      liked: !isLiked,
      likesCount: capsule.likes.length
    });
  } catch (err) {
    console.error("Toggle capsule like error:", err);
    res.status(500).json({ message: "Failed to toggle like" });
  }
};

/* TOGGLE CAPSULE DISLIKE */
exports.toggleCapsuleDislike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const capsule = await Capsule.findById(id);
    if (!capsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }

    const isDisliked = capsule.dislikes.includes(userId);

    if (isDisliked) {
      capsule.dislikes = capsule.dislikes.filter(id => id.toString() !== userId);
    } else {
      capsule.dislikes.push(userId);
    }

    await capsule.save();

    res.json({
      capsuleId: id,
      disliked: !isDisliked,
      dislikesCount: capsule.dislikes.length
    });
  } catch (err) {
    console.error("Toggle capsule dislike error:", err);
    res.status(500).json({ message: "Failed to toggle dislike" });
  }
};

/* SHARE CAPSULE */
exports.shareCapsule = async (req, res) => {
  try {
    const { id } = req.params;

    const capsule = await Capsule.findById(id);
    if (!capsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }

    capsule.shares += 1;
    await capsule.save();

    res.json({ shares: capsule.shares });
  } catch (err) {
    console.error("Share capsule error:", err);
    res.status(500).json({ message: "Failed to share capsule" });
  }
};

/* ================================
   TOGGLE BOOKMARK / SAVE CAPSULE
================================ */
exports.toggleBookmark = async (req, res) => {
  try {
    const { id: capsuleId } = req.params;
    const userId = req.userId;

    const capsule = await Capsule.findById(capsuleId);
    if (!capsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookmarkIndex = user.savedCapsules.findIndex((pid) =>
      pid.equals(capsuleId)
    );

    let bookmarked;

    if (bookmarkIndex > -1) {
      // Remove bookmark
      user.savedCapsules.splice(bookmarkIndex, 1);
      bookmarked = false;
    } else {
      // Add bookmark
      user.savedCapsules.push(capsuleId);
      bookmarked = true;
    }

    await user.save();

    res.json({
      capsuleId,
      bookmarked,
      savedCount: user.savedCapsules.length,
    });
  } catch (err) {
    console.error("toggleBookmark error:", err);
    res.status(500).json({ message: "Failed to toggle bookmark" });
  }
};

/* ================================
   GET SAVED CAPSULES (BOOKMARKS)
================================ */
exports.getSavedCapsules = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(userId).select("savedCapsules");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get saved capsules with pagination
    const skip = (page - 1) * limit;
    const savedCapsuleIds = user.savedCapsules.slice(skip, skip + limit);

    const capsules = await Capsule.find({ _id: { $in: savedCapsuleIds } })
      .populate("author", "username displayName uid avatar")
      .sort({ _id: -1 });

    // Get total count
    const totalCount = user.savedCapsules.length;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      capsules,
      savedCount: totalCount,
      currentPage: parseInt(page),
      totalPages,
      hasMore: page < totalPages,
    });
  } catch (err) {
    console.error("getSavedCapsules error:", err);
    res.status(500).json({ message: "Failed to get saved capsules" });
  }
};

/* DELETE CAPSULE */
exports.deleteCapsule = async (req, res) => {
  try {
    const { id } = req.params;

    const capsule = await Capsule.findOneAndDelete({
      _id: id,
      author: req.userId
    });

    if (!capsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }

    res.json({ message: "Capsule deleted successfully" });
  } catch (err) {
    console.error("Delete capsule error:", err);
    res.status(500).json({ message: "Failed to delete capsule" });
  }
};