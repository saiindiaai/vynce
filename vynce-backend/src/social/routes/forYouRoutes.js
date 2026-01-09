const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const forYouController = require("../controllers/forYouController");

// GET /api/social/explore/for-you
router.get("/for-you", protect, forYouController.getForYou);

module.exports = router;
