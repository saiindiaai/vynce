const Comment = require("../models/Comment");
const Post = require("../models/Post");

/* CREATE COMMENT */
exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      post: postId,
      author: userId,
      content,
    });

    post.commentsCount += 1;
    await post.save();

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

    const comments = await Comment.find({ post: postId })
      .populate("author", "username displayName uid")
      .sort({ createdAt: 1 });

    res.json(comments);
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

    await Comment.deleteOne({ _id: id });

    await Post.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -1 },
    });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};
