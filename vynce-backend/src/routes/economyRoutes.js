// src/routes/economyRoutes.js
const express = require("express");
const { awardXP, awardCelestium, getEconomyState } = require("../controllers/economyController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * POST /api/economy/award-xp
 * Body: { amount, reason }
 * Adds XP and checks level progression (handled in controller)
 */
router.post("/award-xp", protect, awardXP);

/**
 * POST /api/economy/award-celestium
 * Body: { amount }
 * Adds premium currency
 */
router.post("/award-celestium", protect, awardCelestium);

/**
 * GET /api/economy/state
 * Returns:
 * - xp
 * - level
 * - energy
 * - celestium
 * - badges
 * - inventory
 */
router.get("/state", protect, getEconomyState);

module.exports = router;
