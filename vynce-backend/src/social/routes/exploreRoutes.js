const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const exploreController = require("../controllers/exploreController");

// GET /api/social/explore/main
router.get("/main", protect, exploreController.getExploreMain);

module.exports = router;
