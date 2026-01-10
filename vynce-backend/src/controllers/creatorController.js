const Post = require("../social/models/Post");
const Drop = require("../social/models/Drop");
const Capsule = require("../social/models/Capsule");
const User = require("../models/User");
const mongoose = require("mongoose");

/* CREATE CREATOR POST */
exports.createCreatorPost = async (req, res) => {
  try {
    const {
      contentType,
      title,
      description,
      media,
      tags,
      visibility = "public",
      scheduledAt,
      opponent,
      fightType,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!contentType || !["drop", "capsule", "fight", "post"].includes(contentType)) {
      return res.status(400).json({ message: "Valid content type is required" });
    }

    // Choose the appropriate model based on contentType
    let Model;
    if (contentType === "drop" || contentType === "fight") {
      Model = Drop;
    } else if (contentType === "capsule") {
      Model = Capsule;
    } else {
      Model = Post;
    }

    // Create the content
    const contentData = {
      author: req.userId,
      contentType,
      title: title.trim(),
      description: description?.trim(),
      media,
      tags: tags ? tags.map(tag => tag.trim()).filter(tag => tag) : [],
      visibility,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      opponent: opponent?.trim(),
      fightType,
      // For backward compatibility, put title + description in content field
      content: `${title.trim()}${description ? '\n\n' + description.trim() : ''}`,
    };

    const content = await Model.create(contentData);

    const populatedContent = await Model.findById(content._id)
      .populate("author", "username displayName uid avatar");

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("Create creator post error:", err);
    res.status(500).json({ message: "Failed to create creator post" });
  }
};

/* GET USER'S CREATOR POSTS */
exports.getUserCreatorPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const { cursor, status = "all", contentType } = req.query;
    const userId = req.userId;

    let query = { author: userId };

    // Filter by content type if specified
    if (contentType && contentType !== "all") {
      query.contentType = contentType;
    }

    // Filter by status
    if (status === "published") {
      query.visibility = "public";
    } else if (status === "drafts") {
      query.visibility = "draft";
    } else if (status === "scheduled") {
      query.visibility = "scheduled";
    }

    if (cursor) {
      query._id = { $lt: cursor };
    }

    // Fetch from all models
    const [posts, drops, capsules] = await Promise.all([
      Post.find(query).populate("author", "username displayName uid avatar").sort({ _id: -1 }).limit(limit + 1),
      Drop.find(query).populate("author", "username displayName uid avatar").sort({ _id: -1 }).limit(limit + 1),
      Capsule.find(query).populate("author", "username displayName uid avatar").sort({ _id: -1 }).limit(limit + 1),
    ]);

    // Combine and sort by creation date
    const allPosts = [...posts, ...drops, ...capsules]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit + 1);

    let hasMore = false;
    let nextCursor = null;

    if (allPosts.length > limit) {
      hasMore = true;
      allPosts.pop();
      nextCursor = allPosts[allPosts.length - 1]._id;
    }

    res.json({
      posts: allPosts,
      hasMore,
      nextCursor,
    });
  } catch (err) {
    console.error("Get creator posts error:", err);
    res.status(500).json({ message: "Failed to fetch creator posts" });
  }
};

/* UPDATE CREATOR POST */
exports.updateCreatorPost = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find the content in any of the models
    let content = await Post.findOne({ _id: id, author: req.userId });
    let Model = Post;

    if (!content) {
      content = await Drop.findOne({ _id: id, author: req.userId });
      Model = Drop;
    }

    if (!content) {
      content = await Capsule.findOne({ _id: id, author: req.userId });
      Model = Capsule;
    }

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Prevent updating published posts to draft
    if (content.visibility === "public" && updates.visibility === "draft") {
      return res.status(400).json({ message: "Cannot change published content to draft" });
    }

    // Update content field if title or description changed
    if (updates.title || updates.description !== undefined) {
      const newTitle = updates.title || content.title;
      const newDescription = updates.description !== undefined ? updates.description : content.description;
      updates.content = `${newTitle}${newDescription ? '\n\n' + newDescription : ''}`;
    }

    Object.assign(content, updates);
    await content.save();

    const updatedContent = await Model.findById(id)
      .populate("author", "username displayName uid avatar");

    res.json(updatedContent);
  } catch (err) {
    console.error("Update creator content error:", err);
    res.status(500).json({ message: "Failed to update content" });
  }
};

/* DELETE CREATOR POST */
exports.deleteCreatorPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to delete from each model
    let deleted = await Post.findOneAndDelete({ _id: id, author: req.userId });

    if (!deleted) {
      deleted = await Drop.findOneAndDelete({ _id: id, author: req.userId });
    }

    if (!deleted) {
      deleted = await Capsule.findOneAndDelete({ _id: id, author: req.userId });
    }

    if (!deleted) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.json({ message: "Content deleted successfully" });
  } catch (err) {
    console.error("Delete creator content error:", err);
    res.status(500).json({ message: "Failed to delete content" });
  }
};

/* GET CREATOR STATS */
exports.getCreatorStats = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("getCreatorStats - userId:", userId, "type:", typeof userId);

    // Ensure userId is an ObjectId
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(userId);
    } catch (err) {
      console.error("Invalid userId format:", userId);
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Aggregate stats from all content types
    const [postStats, dropStats, capsuleStats] = await Promise.all([
      Post.aggregate([
        { $match: { author: objectId, visibility: "public" } },
        {
          $group: {
            _id: null,
            totalPosts: { $sum: 1 },
            totalViews: { $sum: { $size: { $ifNull: ["$likes", []] } } },
            totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
            totalShares: { $sum: { $ifNull: ["$shares", 0] } },
          }
        }
      ]),
      Drop.aggregate([
        { $match: { author: objectId, visibility: "public" } },
        {
          $group: {
            _id: null,
            totalPosts: { $sum: 1 },
            totalViews: { $sum: { $size: { $ifNull: ["$likes", []] } } },
            totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
            totalShares: { $sum: { $ifNull: ["$shares", 0] } },
          }
        }
      ]),
      Capsule.aggregate([
        { $match: { author: objectId, visibility: "public" } },
        {
          $group: {
            _id: null,
            totalPosts: { $sum: 1 },
            totalViews: { $sum: { $size: { $ifNull: ["$likes", []] } } },
            totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
            totalShares: { $sum: { $ifNull: ["$shares", 0] } },
          }
        }
      ]),
    ]);

    const user = await User.findById(objectId).select("followers following");

    // Combine stats
    const combinedStats = [postStats[0], dropStats[0], capsuleStats[0]]
      .filter(Boolean)
      .reduce((acc, stat) => ({
        totalPosts: acc.totalPosts + (stat.totalPosts || 0),
        totalViews: acc.totalViews + (stat.totalViews || 0),
        totalLikes: acc.totalLikes + (stat.totalLikes || 0),
        totalShares: acc.totalShares + (stat.totalShares || 0),
      }), { totalPosts: 0, totalViews: 0, totalLikes: 0, totalShares: 0 });

    combinedStats.followers = user?.followers?.length || 0;
    combinedStats.following = user?.following?.length || 0;

    res.json(combinedStats);
  } catch (err) {
    console.error("Get creator stats error:", err);
    res.status(500).json({ message: "Failed to fetch creator stats" });
  }
};