// src/routes/reportRoutes.js
const express = require("express");
const {
  createReport,
  getMyReports,
  getAllReports,
  updateStatus,
} = require("../controllers/reportController");

const { protect } = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");

const router = express.Router();

/* OPTIONAL AUTH MIDDLEWARE */
async function protectOptional(req, res, next) {
  const header = req.headers.authorization;

  if (!header) return next(); // guest
  const token = header.split(" ")[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
  } catch (err) {
    // invalid token → still guest
  }

  next();
}

// CREATE REPORT (guest or logged-in)
router.post("/", protectOptional, createReport);

// USER REPORTS (only logged in)
router.get("/my", protect, getMyReports);

// ADMIN — GET ALL REPORTS
router.get("/", protect, getAllReports);

// ADMIN — UPDATE STATUS
router.patch("/:id/status", protect, updateStatus);

module.exports = router;
