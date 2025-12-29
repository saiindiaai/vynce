const express = require("express");
const {
  createPost,
  getFeed,
  toggleLike,
  deletePost,
  editPost,
} = require("../controllers/postController");

const { protect } = require("../../middleware/authMiddleware");
const commentRoutes = require("./commentRoutes");

const router = express.Router();

// All social routes are protected
router.use(protect);

// Create post
router.post("/", createPost);

// Get feed (cursor pagination)
// /api/social/posts?cursor=POST_ID&limit=10
router.get("/", getFeed);

// Like / Unlike post
router.post("/:id/like", toggleLike);

// Edit post (author only)
router.patch("/:id", editPost);

// Delete post (author only)
router.delete("/:id", deletePost);

// Nested comments routes
router.use("/:postId/comments", commentRoutes);

module.exports = router;
