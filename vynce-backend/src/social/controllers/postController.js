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
   GET FEED (latest first)
================================ */
exports.getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username displayName uid")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
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
