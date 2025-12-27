const express = require("express");
const {
  createPost,
  getFeed,
  toggleLike,
} = require("../controllers/postController.js");

const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

// All social routes are protected
router.use(protect);

// Create post
router.post("/", createPost);

// Get feed
router.get("/", getFeed);

// Like / Unlike post
router.post("/:id/like", toggleLike);

module.exports = router;
