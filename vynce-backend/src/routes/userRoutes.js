const express = require('express');
const { getMe, updateOnboarding, updateDisplayName } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/users/me
router.get('/me', protect, getMe);

// PATCH /api/users/displayname
router.patch('/displayname', protect, updateDisplayName);

// PATCH /api/users/onboarding
router.patch('/onboarding', protect, updateOnboarding);

module.exports = router;
