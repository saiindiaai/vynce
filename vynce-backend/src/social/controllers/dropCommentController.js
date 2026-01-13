const DropComment = require("../models/DropComment");
const Drop = require("../models/Drop");

/* CREATE DROP COMMENT */
exports.createDropComment = async (req, res) => {
  try {
    const { dropId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.userId;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content required" });
    }

    const drop = await Drop.findById(dropId);
    if (!drop) {
      return res.status(404).json({ message: "Drop not found" });
    }

    let parentComment = null;
    if (parentCommentId) {
      parentComment = await DropComment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
    }

    const comment = await DropComment.create({
      drop: dropId,
      author: userId,
      content,
      parentComment: parentCommentId || null,
    });

    // Update parent comment replies count if this is a reply
    if (parentCommentId) {
      await DropComment.findByIdAndUpdate(parentCommentId, {
        $inc: { repliesCount: 1 },
      });
    } else {
      // Only increment drop comments count for top-level comments
      drop.commentsCount += 1;
      await drop.save();
    }

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create comment" });
  }
};

/* GET DROP COMMENTS */
exports.getDropCommentsByDrop = async (req, res) => {
  try {
    const { dropId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const drop = await Drop.findById(dropId);
    if (!drop) {
      return res.status(404).json({ message: "Drop not found" });
    }

    // Recursive function to fetch all nested replies
    const fetchRepliesRecursively = async (parentCommentId) => {
      const replies = await DropComment.find({
        parentComment: parentCommentId,
      })
        .populate("author", "username displayName uid")
        .sort({ createdAt: 1 });

      // Recursively fetch replies for each reply
      const repliesWithNested = await Promise.all(
        replies.map(async (reply) => {
          const nestedReplies = await fetchRepliesRecursively(reply._id);
          return {
            ...reply.toObject(),
            replies: nestedReplies,
          };
        })
      );

      return repliesWithNested;
    };

    // Get top-level comments with pagination
    const topLevelComments = await DropComment.find({
      drop: dropId,
      parentComment: null,
    })
      .populate("author", "username displayName uid")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get replies for each top-level comment (recursively)
    const commentsWithReplies = await Promise.all(
      topLevelComments.map(async (comment) => {
        const replies = await fetchRepliesRecursively(comment._id);
        return {
          ...comment.toObject(),
          replies,
        };
      })
    );

    res.json({
      comments: commentsWithReplies,
      totalComments: drop.commentsCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(drop.commentsCount / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get comments" });
  }
};

/* DELETE DROP COMMENT */
exports.deleteDropComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const comment = await DropComment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Handle replies count update for parent comment
    if (comment.parentComment) {
      await DropComment.findByIdAndUpdate(comment.parentComment, {
        $inc: { repliesCount: -1 },
      });
    } else {
      // Only decrement drop comments count for top-level comments
      await Drop.findByIdAndUpdate(comment.drop, {
        $inc: { commentsCount: -1 },
      });
    }

    await DropComment.deleteOne({ _id: id });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

/* LIKE DROP COMMENT */
exports.likeDropComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const comment = await DropComment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user already liked
    const alreadyLiked = comment.likes.includes(userId);
    const alreadyDisliked = comment.dislikes.includes(userId);

    if (alreadyLiked) {
      // Remove like
      comment.likes.pull(userId);
    } else {
      // Add like
      comment.likes.push(userId);
      // Remove dislike if exists
      if (alreadyDisliked) {
        comment.dislikes.pull(userId);
      }
    }

    await comment.save();

    res.json({
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
      userLiked: comment.likes.includes(userId),
      userDisliked: comment.dislikes.includes(userId),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to like comment" });
  }
};

/* DISLIKE DROP COMMENT */
exports.dislikeDropComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const comment = await DropComment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user already disliked
    const alreadyDisliked = comment.dislikes.includes(userId);
    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyDisliked) {
      // Remove dislike
      comment.dislikes.pull(userId);
    } else {
      // Add dislike
      comment.dislikes.push(userId);
      // Remove like if exists
      if (alreadyLiked) {
        comment.likes.pull(userId);
      }
    }

    await comment.save();

    res.json({
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
      userLiked: comment.likes.includes(userId),
      userDisliked: comment.dislikes.includes(userId),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to dislike comment" });
  }
};