const Drop = require("../models/Drop");

/* CREATE DROP */
exports.createDrop = async (req, res) => {
  try {
    const {
      content,
      contentType = "drop",
      title,
      description,
      media,
      tags,
      visibility = "public",
      scheduledAt,
      opponent,
      fightType,
    } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content required" });
    }

    const drop = await Drop.create({
      author: req.userId,
      content,
      contentType,
      title,
      description,
      media,
      tags: tags ? tags.map(tag => tag.trim()).filter(tag => tag) : [],
      visibility,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      opponent,
      fightType,
    });

    const populatedDrop = await Drop.findById(drop._id)
      .populate("author", "username displayName uid avatar");

    res.status(201).json(populatedDrop);
  } catch (err) {
    res.status(500).json({ message: "Create drop failed" });
  }
};


/* ================================
   GET DROP FEED (PAGINATED + ENRICHED)
================================ */
exports.getDropFeed = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const { cursor } = req.query;
    const userId = req.userId;

    const query = cursor ? { _id: { $lt: cursor } } : {};

    const drops = await Drop.find(query)
      .populate("author", "username displayName uid")
      .sort({ _id: -1 })
      .limit(limit + 1);

    let hasMore = false;
    let nextCursor = null;

    if (drops.length > limit) {
      hasMore = true;
      drops.pop();
      nextCursor = drops[drops.length - 1]._id;
    }

    const enrichedDrops = drops.map((drop) => {
      const isLikedByMe = drop.likes.some(
        (id) => id.toString() === userId
      );
      const isDislikedByMe = drop.dislikes.some(
        (id) => id.toString() === userId
      );

      return {
        _id: drop._id,
        content: drop.content,
        author: drop.author,
        createdAt: drop.createdAt,
        aura: drop.likes.length - drop.dislikes.length,
        isLikedByMe,
        isDislikedByMe,
        commentsCount: drop.commentsCount,
        shares: drop.shares,
      };
    });

    res.json({
      drops: enrichedDrops,
      nextCursor,
      hasMore,
    });
  } catch (err) {
    console.error("getDropFeed error:", err);
    res.status(500).json({ message: "Failed to fetch drop feed" });
  }
};


/* ================================
   TOGGLE LIKE / UNLIKE DROP
================================ */
exports.toggleDropLike = async (req, res) => {
  try {
    const { id: dropId } = req.params;
    const userId = req.userId;

    const drop = await Drop.findById(dropId);
    if (!drop) {
      return res.status(404).json({ message: "Drop not found" });
    }

    const likeIndex = drop.likes.findIndex((uid) =>
      uid.equals(userId)
    );
    const dislikeIndex = drop.dislikes.findIndex((uid) =>
      uid.equals(userId)
    );

    let liked;

    if (likeIndex > -1) {
      // Unlike
      drop.likes.splice(likeIndex, 1);
      liked = false;
    } else {
      // Like
      drop.likes.push(userId);
      // Remove dislike if exists
      if (dislikeIndex > -1) {
        drop.dislikes.splice(dislikeIndex, 1);
      }
      liked = true;
    }

    await drop.save();

    res.json({
      dropId,
      liked,
      aura: drop.likes.length - drop.dislikes.length,
    });
  } catch (err) {
    console.error("toggleDropLike error:", err);
    res.status(500).json({ message: "Failed to toggle like" });
  }
};

/* ================================
   TOGGLE DISLIKE / UNDISLIKE DROP
================================ */
exports.toggleDropDislike = async (req, res) => {
  try {
    const { id: dropId } = req.params;
    const userId = req.userId;

    const drop = await Drop.findById(dropId);
    if (!drop) {
      return res.status(404).json({ message: "Drop not found" });
    }

    const likeIndex = drop.likes.findIndex((uid) =>
      uid.equals(userId)
    );
    const dislikeIndex = drop.dislikes.findIndex((uid) =>
      uid.equals(userId)
    );

    let disliked;

    if (dislikeIndex > -1) {
      // Undislike
      drop.dislikes.splice(dislikeIndex, 1);
      disliked = false;
    } else {
      // Dislike
      drop.dislikes.push(userId);
      // Remove like if exists
      if (likeIndex > -1) {
        drop.likes.splice(likeIndex, 1);
      }
      disliked = true;
    }

    await drop.save();

    res.json({
      dropId,
      disliked,
      aura: drop.likes.length - drop.dislikes.length,
    });
  } catch (err) {
    console.error("toggleDropDislike error:", err);
    res.status(500).json({ message: "Failed to toggle dislike" });
  }
};


/* ================================
   DELETE DROP (author only)
================================ */
exports.deleteDrop = async (req, res) => {
  try {
    const dropId = req.params.id;
    const userId = req.userId;

    const drop = await Drop.findById(dropId);
    if (!drop) {
      return res.status(404).json({ message: "Drop not found" });
    }

    // Only author can delete
    if (drop.author.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await drop.deleteOne();

    res.json({ message: "Drop deleted successfully" });
  } catch (err) {
    console.error("deleteDrop error:", err);
    res.status(500).json({ message: "Failed to delete drop" });
  }
};

/* ================================
   SHARE DROP
================================ */
exports.shareDrop = async (req, res) => {
  try {
    const { id: dropId } = req.params;

    const drop = await Drop.findById(dropId);
    if (!drop) {
      return res.status(404).json({ message: "Drop not found" });
    }

    drop.shares += 1;
    await drop.save();

    res.json({
      dropId,
      shares: drop.shares,
    });
  } catch (err) {
    console.error("shareDrop error:", err);
    res.status(500).json({ message: "Failed to share drop" });
  }
};

/* ================================
   GET USER DROPS
================================ */
exports.getUserDrops = async (req, res) => {
  try {
    const userId = req.userId;
    const drops = await Drop.find({ author: userId })
      .populate("author", "username displayName uid")
      .sort({ _id: -1 })
      .limit(20); // limit for profile

    res.json(drops);
  } catch (err) {
    res.status(500).json({ message: "Failed to get user drops" });
  }
};