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

// Get feed
router.get("/", getFeed);

// Like / Unlike post
router.post("/:id/like", toggleLike);

// Delete post (author only)
router.delete("/:id", deletePost);

// Nested comments routes
router.use("/:postId/comments", commentRoutes);

// Edit post (author only)
router.patch("/:id", editPost);

module.exports = router;
