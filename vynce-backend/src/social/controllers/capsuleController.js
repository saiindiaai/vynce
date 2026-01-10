const Capsule = require("../models/Capsule");

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