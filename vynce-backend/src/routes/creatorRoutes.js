const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  createCreatorPost,
  getUserCreatorPosts,
  updateCreatorPost,
  deleteCreatorPost,
  getCreatorStats,
} = require("../controllers/creatorController");

/* CREATOR POSTS */
router.post("/", protect, createCreatorPost);
router.get("/", protect, getUserCreatorPosts);
router.put("/:id", protect, updateCreatorPost);
router.delete("/:id", protect, deleteCreatorPost);

/* CREATOR STATS */
router.get("/stats", protect, getCreatorStats);

module.exports = router;