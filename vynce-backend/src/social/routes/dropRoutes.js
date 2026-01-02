const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");

const {
  createDrop,
  getDropFeed,
  toggleDropLike,
  toggleDropDislike,
  deleteDrop,
} = require("../controllers/dropController");

const {
  createDropComment,
  getDropCommentsByDrop,
  deleteDropComment,
} = require("../controllers/dropCommentController");

/* DROPS */
router.post("/", protect, createDrop);
router.get("/feed", protect, getDropFeed);
router.post("/:id/like", protect, toggleDropLike);
router.post("/:id/dislike", protect, toggleDropDislike);
router.delete("/:id", protect, deleteDrop);

/* DROP COMMENTS */
router.post("/:dropId/comments", protect, createDropComment);
router.get("/:dropId/comments", protect, getDropCommentsByDrop);
router.delete("/comments/:id", protect, deleteDropComment);

module.exports = router;