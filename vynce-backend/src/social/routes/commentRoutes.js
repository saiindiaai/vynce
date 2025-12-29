const express = require("express");
const {
  createComment,
  getCommentsByPost,
  deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

// POST /api/social/posts/:postId/comments
router.post("/", createComment);

// GET /api/social/posts/:postId/comments
router.get("/", getCommentsByPost);

// DELETE /api/social/comments/:id
router.delete("/:id", deleteComment);

module.exports = router;
