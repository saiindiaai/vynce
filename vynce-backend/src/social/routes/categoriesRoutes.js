const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const categoriesController = require("../controllers/categoriesController");

// GET /api/social/explore/categories
router.get("/categories", protect, categoriesController.getCategories);

module.exports = router;
