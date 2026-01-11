const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");

const {
  createPost,
  getFeed,
  getUserPosts,
  toggleLike,
  toggleDislike,
  toggleBookmark,
  deletePost,
  sharePost,
} = require("../controllers/postController");

const {
  createComment,
  getCommentsByPost,
  deleteComment,
} = require("../controllers/commentController");

/* POSTS */
router.post("/", protect, createPost);
router.get("/feed", protect, getFeed);
router.get("/user", protect, getUserPosts);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/dislike", protect, toggleDislike);
router.post("/:id/bookmark", protect, toggleBookmark);
router.post("/:id/share", protect, sharePost);
router.delete("/:id", protect, deletePost);

/* COMMENTS (THIS WAS MISSING 🔥) */
router.post("/:postId/comments", protect, createComment);
router.get("/:postId/comments", protect, getCommentsByPost);
router.delete("/comments/:id", protect, deleteComment);

module.exports = router;
