const Post = require("../models/Post");

/* CREATE POST */
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content required" });
    }

    const post = await Post.create({
      author: req.userId,
      content,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Create post failed" });
  }
};


/* ================================
   GET FEED (PAGINATED + ENRICHED)
================================ */
exports.getFeed = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const { cursor } = req.query;
    const userId = req.userId;

    const query = cursor ? { _id: { $lt: cursor } } : {};

    const posts = await Post.find(query)
      .populate("author", "username displayName uid")
      .sort({ _id: -1 })
      .limit(limit + 1);

    let hasMore = false;
    let nextCursor = null;

    if (posts.length > limit) {
      hasMore = true;
      posts.pop();
      nextCursor = posts[posts.length - 1]._id;
    }

    const enrichedPosts = posts.map((post) => {
      const isLikedByMe = post.likes.some(
        (id) => id.toString() === userId
      );

      return {
        _id: post._id,
        content: post.content,
        author: post.author,
        createdAt: post.createdAt,
        likesCount: post.likes.length,
        isLikedByMe,
        commentsCount: post.commentsCount,
      };
    });

    res.json({
      posts: enrichedPosts,
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
    const { id: postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const index = post.likes.findIndex((uid) =>
      uid.equals(userId)
    );

    let liked;

    if (index > -1) {
      // Unlike
      post.likes.splice(index, 1);
      liked = false;
    } else {
      // Like
      post.likes.push(userId);
      liked = true;
    }

    await post.save();

    res.json({
      postId,
      liked,
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
