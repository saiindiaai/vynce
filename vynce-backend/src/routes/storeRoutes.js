// src/routes/storeRoutes.js
const express = require("express");
const { getCatalog, purchaseItem, getInventory } = require("../controllers/storeController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/* ============================================
   GET STORE CATALOG (public)
   Example: GET /api/store
============================================ */
router.get("/", getCatalog);

/* ============================================
   PURCHASE ITEM (authenticated)
   Example: POST /api/store/purchase
============================================ */
router.post("/purchase", protect, purchaseItem);

/* ============================================
   GET USER INVENTORY (authenticated)
   Example: GET /api/store/inventory
============================================ */
router.get("/inventory", protect, getInventory);

module.exports = router;
