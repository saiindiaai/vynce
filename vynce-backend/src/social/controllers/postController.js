const Post = require("../models/Post");
const Notification = require("../../models/Notification");
const User = require("../../models/User");

/* CREATE POST */
exports.createPost = async (req, res) => {
  try {
    const {
      content,
      contentType = "post",
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

    console.log("Creating post with author:", req.userId, "type:", typeof req.userId);

    const post = await Post.create({
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

    console.log("Post created:", post._id, "author:", post.author, "author type:", typeof post.author);

    const populatedPost = await Post.findById(post._id)
      .populate("author", "username displayName uid avatar");

    console.log("Populated post author:", populatedPost.author);

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("Create post error:", err);
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

    console.log("Found posts:", posts.length);
    posts.forEach((post, i) => {
      console.log(`Post ${i}:`, post._id, "author:", post.author);
    });

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
      const isDislikedByMe = post.dislikes.some(
        (id) => id.toString() === userId
      );

      return {
        _id: post._id,
        content: post.content,
        author: post.author,
        createdAt: post.createdAt,
        aura: post.likes.length - post.dislikes.length,
        isLikedByMe,
        isDislikedByMe,
        commentsCount: post.commentsCount,
        shares: post.shares,
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
  console.log("LIKE CONTROLLER HIT");
  console.log("REQ USER ID:", req.userId);
  try {
    const { id: postId } = req.params;
    const userId = req.userId;

    console.log("POST ID:", postId);
    console.log("USER ID:", userId);

    const post = await Post.findById(postId);
    if (!post) {
      console.log("POST NOT FOUND");
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("POST AUTHOR:", post.author);

    const likeIndex = post.likes.findIndex((uid) =>
      uid.equals(userId)
    );
    const dislikeIndex = post.dislikes.findIndex((uid) =>
      uid.equals(userId)
    );

    let liked;

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
      liked = false;
    } else {
      // Like
      post.likes.push(userId);
      // Remove dislike if exists
      if (dislikeIndex > -1) {
        post.dislikes.splice(dislikeIndex, 1);
      }
      liked = true;

      // Notify post author if not self-like
      console.log("CHECKING SELF LIKE:", String(post.author), "vs", String(userId));
      if (!post.author.equals(userId)) {
        console.log("CREATING NOTIFICATION");
        const liker = await User.findById(userId);
        console.log("LIKER:", liker.username);
        await Notification.create({
          user: post.author,
          type: "POST_LIKED",
          title: "New like",
          message: `${liker.username} liked your post`,
          metadata: { postId: post._id },
          priority: "NORMAL",
          pinned: false,
        });
        console.log("NOTIFICATION CREATED");
      } else {
        console.log("SELF LIKE, NO NOTIFICATION");
      }
    }

    await post.save();

    res.json({
      postId,
      liked,
      aura: post.likes.length - post.dislikes.length,
    });
  } catch (err) {
    console.error("toggleLike error:", err);
    res.status(500).json({ message: "Failed to toggle like" });
  }
};

/* ================================
   TOGGLE DISLIKE / UNDISLIKE
================================ */
exports.toggleDislike = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likeIndex = post.likes.findIndex((uid) =>
      uid.equals(userId)
    );
    const dislikeIndex = post.dislikes.findIndex((uid) =>
      uid.equals(userId)
    );

    let disliked;

    if (dislikeIndex > -1) {
      // Undislike
      post.dislikes.splice(dislikeIndex, 1);
      disliked = false;
    } else {
      // Dislike
      post.dislikes.push(userId);
      // Remove like if exists
      if (likeIndex > -1) {
        post.likes.splice(likeIndex, 1);
      }
      disliked = true;
    }

    await post.save();

    res.json({
      postId,
      disliked,
      aura: post.likes.length - post.dislikes.length,
    });
  } catch (err) {
    console.error("toggleDislike error:", err);
    res.status(500).json({ message: "Failed to toggle dislike" });
  }
};


/* ================================
   TOGGLE BOOKMARK / SAVE POST
================================ */
exports.toggleBookmark = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookmarkIndex = user.savedPosts.findIndex((pid) =>
      pid.equals(postId)
    );

    let bookmarked;

    if (bookmarkIndex > -1) {
      // Remove bookmark
      user.savedPosts.splice(bookmarkIndex, 1);
      bookmarked = false;
    } else {
      // Add bookmark
      user.savedPosts.push(postId);
      bookmarked = true;
    }

    await user.save();

    res.json({
      postId,
      bookmarked,
      savedCount: user.savedPosts.length,
    });
  } catch (err) {
    console.error("toggleBookmark error:", err);
    res.status(500).json({ message: "Failed to toggle bookmark" });
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
   SHARE POST
================================ */
exports.sharePost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.shares += 1;
    await post.save();

    res.json({
      postId,
      shares: post.shares,
    });
  } catch (err) {
    console.error("sharePost error:", err);
    res.status(500).json({ message: "Failed to share post" });
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

/* ================================
   GET USER POSTS
================================ */
exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const posts = await Post.find({ author: userId })
      .populate("author", "username displayName uid")
      .sort({ _id: -1 })
      .limit(20);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to get user posts" });
  }
};
