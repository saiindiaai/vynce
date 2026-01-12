const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../../models/Notification");
const User = require("../../models/User");

/* CREATE COMMENT */
exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.userId;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let parentComment = null;
    if (parentCommentId) {
      parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
    }

    const comment = await Comment.create({
      post: postId,
      author: userId,
      content,
      parentComment: parentCommentId || null,
    });

    // Update parent comment replies count if this is a reply
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $inc: { repliesCount: 1 },
      });
    } else {
      // Only increment post comments count for top-level comments
      post.commentsCount += 1;
      await post.save();
    }

    // Notify post author if not self-comment
    if (!post.author.equals(userId)) {
      const commenter = await User.findById(userId);
      const notificationType = parentCommentId ? "REPLY_TO_COMMENT" : "COMMENT_ON_POST";
      const notificationTitle = parentCommentId ? "New reply" : "New comment";
      const notificationMessage = parentCommentId
        ? `${commenter.username} replied to your comment`
        : `${commenter.username} commented on your post`;

      await Notification.create({
        user: post.author,
        type: notificationType,
        title: notificationTitle,
        message: notificationMessage,
        metadata: { postId: post._id, commentId: comment._id },
        priority: "NORMAL",
        pinned: false,
      });
    }

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create comment" });
  }
};

/* GET COMMENTS */
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    // Get all comments for this post
    const allComments = await Comment.find({ post: postId })
      .populate("author", "username displayName uid")
      .sort({ createdAt: 1 });

    // Organize into hierarchical structure
    const commentMap = new Map();
    const topLevelComments = [];

    // First pass: create map of all comments
    allComments.forEach(comment => {
      const commentObj = comment.toObject();
      commentObj.isLikedByMe = comment.likes.some(id => id.toString() === userId);
      commentObj.isDislikedByMe = comment.dislikes.some(id => id.toString() === userId);
      commentObj.replies = [];
      commentMap.set(comment._id.toString(), commentObj);
    });

    // Second pass: organize into hierarchy
    allComments.forEach(comment => {
      if (comment.parentComment) {
        const parent = commentMap.get(comment.parentComment.toString());
        if (parent) {
          parent.replies.push(commentMap.get(comment._id.toString()));
        }
      } else {
        topLevelComments.push(commentMap.get(comment._id.toString()));
      }
    });

    res.json(topLevelComments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

/* DELETE COMMENT */
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // If this is a reply, decrement parent replies count
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $inc: { repliesCount: -1 },
      });
    } else {
      // If this is a top-level comment, decrement post comments count
      await Post.findByIdAndUpdate(comment.post, {
        $inc: { commentsCount: -1 },
      });
    }

    await Comment.deleteOne({ _id: id });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

/* LIKE COMMENT */
exports.likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Remove from dislikes if present
    comment.dislikes = comment.dislikes.filter(id => !id.equals(userId));

    // Add to likes if not already present
    if (!comment.likes.some(id => id.equals(userId))) {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      likesCount: comment.likes.length,
      dislikesCount: comment.dislikes.length,
      isLikedByMe: true,
      isDislikedByMe: false,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to like comment" });
  }
};

/* DISLIKE COMMENT */
exports.dislikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Remove from likes if present
    comment.likes = comment.likes.filter(id => !id.equals(userId));

    // Add to dislikes if not already present
    if (!comment.dislikes.some(id => id.equals(userId))) {
      comment.dislikes.push(userId);
    }

    await comment.save();

    res.json({
      likesCount: comment.likes.length,
      dislikesCount: comment.dislikes.length,
      isLikedByMe: false,
      isDislikedByMe: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to dislike comment" });
  }
};
