const Post = require("../models/Post");

/* ================================
   CREATE POST
================================ */
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const post = await Post.create({
      author: req.userId,
      content,
    });

    return res.status(201).json(post);
  } catch (err) {
    console.error("createPost error:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

/* ================================
   GET FEED (PAGINATED)
================================ */
exports.getFeed = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const { cursor } = req.query;

    const query = cursor
      ? { _id: { $lt: cursor } }
      : {};

    const posts = await Post.find(query)
      .populate("author", "username displayName uid")
      .sort({ _id: -1 })
      .limit(limit + 1); // fetch one extra to check hasMore

    let hasMore = false;
    let nextCursor = null;

    if (posts.length > limit) {
      hasMore = true;
      posts.pop(); // remove extra item
      nextCursor = posts[posts.length - 1]._id;
    }

    res.json({
      posts,
      nextCursor,
      hasMore,
    });
  } catch (err) {
    console.error("getFeed error:", err);
    res.status(500).json({ message: "Failed to fetch feed" });
  }
};


/* ================================
   TOGGLE LIKE / UNLIKE
================================ */
exports.toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (err) {
    console.error("toggleLike error:", err);
    res.status(500).json({ message: "Failed to toggle like" });
  }
};

/* ================================
   DELETE POST (author only)
================================ */
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only author can delete
    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("deletePost error:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

/* ================================
   EDIT POST (author only)
================================ */
exports.editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Post content required" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only author can edit
    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    post.content = content;
    await post.save();

    res.json({
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    console.error("editPost error:", err);
    res.status(500).json({ message: "Failed to edit post" });
  }
};
