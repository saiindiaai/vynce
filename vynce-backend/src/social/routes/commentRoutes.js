const express = require("express");
const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

const { protect } = require("../../middleware/authMiddleware");

const router = express.Router({ mergeParams: true });

// Auth required
router.use(protect);

// Add comment
router.post("/", addComment);

// Get comments
router.get("/", getComments);

// Delete comment (author only)
router.delete("/:commentId", deleteComment);

module.exports = router;

