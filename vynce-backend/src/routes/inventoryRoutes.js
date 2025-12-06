const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getMyInventory } = require("../controllers/inventoryController");

const router = express.Router();

router.get("/my", protect, getMyInventory);

module.exports = router;
