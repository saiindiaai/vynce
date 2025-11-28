// src/routes/userRoutes.js
const express = require('express');
const { getMe, updateOnboarding } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/users/me
router.get('/me', protect, getMe);

// PATCH /api/users/onboarding
router.patch('/onboarding', protect, updateOnboarding);

module.exports = router;
