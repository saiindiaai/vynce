const Comment = require("../models/Comment.js");
const Post = require("../models/Post.js");

/* ================================
   ADD COMMENT
================================ */
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.userId,
      content,
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error("addComment error:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

/* ================================
   GET COMMENTS FOR POST
================================ */
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("author", "username displayName uid")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    console.error("getComments error:", err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

/* ================================
   DELETE COMMENT (author only)
================================ */
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only author can delete
    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await comment.deleteOne();

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("deleteComment error:", err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};
