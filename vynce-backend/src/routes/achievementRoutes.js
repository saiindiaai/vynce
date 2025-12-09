// src/routes/achievementRoutes.js
const express = require("express");
const { getCatalog, unlock } = require("../controllers/achievementController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET /api/achievements
 * Public catalog – shows all achievements
 * Later we can add visibility rules or “hidden” achievements
 */
router.get("/", getCatalog);

/**
 * POST /api/achievements/unlock
 * Requires login
 * Safely attempts to unlock — duplicate unlocks are ignored in controller
 */
router.post("/unlock", protect, unlock);

module.exports = router;
