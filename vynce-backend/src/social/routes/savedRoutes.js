const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");

const User = require("../../models/User");
const Post = require("../models/Post");
const Drop = require("../models/Drop");
const Capsule = require("../models/Capsule");

/* ================================
   GET ALL SAVED ITEMS (UNIFIED)
================================ */
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20, type } = req.query;

    const user = await User.findById(userId).select("savedPosts savedDrops savedCapsules");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let allSavedItems = [];
    const skip = (page - 1) * limit;

    // If type is specified, return only that type
    if (type === "posts") {
      const savedPostIds = user.savedPosts.slice(skip, skip + limit);
      const posts = await Post.find({ _id: { $in: savedPostIds } })
        .populate("author", "username displayName uid avatar")
        .sort({ _id: -1 });

      const enrichedPosts = posts.map(post => ({
        ...post.toObject(),
        type: "post"
      }));

      return res.json({
        items: enrichedPosts,
        savedCount: user.savedPosts.length,
        currentPage: parseInt(page),
        totalPages: Math.ceil(user.savedPosts.length / limit),
        hasMore: page < Math.ceil(user.savedPosts.length / limit),
        type: "posts"
      });
    }

    if (type === "drops") {
      const savedDropIds = user.savedDrops.slice(skip, skip + limit);
      const drops = await Drop.find({ _id: { $in: savedDropIds } })
        .populate("author", "username displayName uid avatar")
        .sort({ _id: -1 });

      const enrichedDrops = drops.map(drop => ({
        ...drop.toObject(),
        type: "drop"
      }));

      return res.json({
        items: enrichedDrops,
        savedCount: user.savedDrops.length,
        currentPage: parseInt(page),
        totalPages: Math.ceil(user.savedDrops.length / limit),
        hasMore: page < Math.ceil(user.savedDrops.length / limit),
        type: "drops"
      });
    }

    if (type === "capsules") {
      const savedCapsuleIds = user.savedCapsules.slice(skip, skip + limit);
      const capsules = await Capsule.find({ _id: { $in: savedCapsuleIds } })
        .populate("author", "username displayName uid avatar")
        .sort({ _id: -1 });

      const enrichedCapsules = capsules.map(capsule => ({
        ...capsule.toObject(),
        type: "capsule"
      }));

      return res.json({
        items: enrichedCapsules,
        savedCount: user.savedCapsules.length,
        currentPage: parseInt(page),
        totalPages: Math.ceil(user.savedCapsules.length / limit),
        hasMore: page < Math.ceil(user.savedCapsules.length / limit),
        type: "capsules"
      });
    }

    // Unified view - combine all saved items
    const postIds = user.savedPosts;
    const dropIds = user.savedDrops;
    const capsuleIds = user.savedCapsules;

    // Get all items
    const posts = await Post.find({ _id: { $in: postIds } })
      .populate("author", "username displayName uid avatar");
    const drops = await Drop.find({ _id: { $in: dropIds } })
      .populate("author", "username displayName uid avatar");
    const capsules = await Capsule.find({ _id: { $in: capsuleIds } })
      .populate("author", "username displayName uid avatar");

    // Add type and combine
    const enrichedPosts = posts.map(post => ({ ...post.toObject(), type: "post" }));
    const enrichedDrops = drops.map(drop => ({ ...drop.toObject(), type: "drop" }));
    const enrichedCapsules = capsules.map(capsule => ({ ...capsule.toObject(), type: "capsule" }));

    allSavedItems = [...enrichedPosts, ...enrichedDrops, ...enrichedCapsules];

    // Sort by creation date (most recent first)
    allSavedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination
    const totalCount = allSavedItems.length;
    const paginatedItems = allSavedItems.slice(skip, skip + limit);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      items: paginatedItems,
      savedCount: totalCount,
      currentPage: parseInt(page),
      totalPages,
      hasMore: page < totalPages,
      type: "all"
    });
  } catch (err) {
    console.error("getSavedItems error:", err);
    res.status(500).json({ message: "Failed to get saved items" });
  }
});

module.exports = router;