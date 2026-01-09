const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const exploreController = require("../controllers/exploreController");

// GET /api/social/explore/main
router.get("/main", protect, exploreController.getExploreMain);

// GET /api/social/explore/search?q=<query>&filter=<all|users|drops|houses>
router.get("/search", protect, exploreController.searchContent);

module.exports = router;
