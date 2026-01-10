const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");

const {
  createCapsule,
  getCapsuleFeed,
  getUserCapsules,
  toggleCapsuleLike,
  toggleCapsuleDislike,
  shareCapsule,
  deleteCapsule,
} = require("../controllers/capsuleController");

/* CAPSULES */
router.post("/", protect, createCapsule);
router.get("/feed", protect, getCapsuleFeed);
router.get("/user", protect, getUserCapsules);
router.post("/:id/like", protect, toggleCapsuleLike);
router.post("/:id/dislike", protect, toggleCapsuleDislike);
router.post("/:id/share", protect, shareCapsule);
router.delete("/:id", protect, deleteCapsule);

module.exports = router;