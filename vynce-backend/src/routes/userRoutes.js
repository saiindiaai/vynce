const express = require('express');
const {
  getMe,
  updateOnboarding,
  updateDisplayName,
  updateProfile,
  updateBio,
  updateAccountInfo,
  addInstalledApp,
  removeInstalledApp,
  getEnergy,
  updateEnergy
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET USER
router.get('/me', protect, getMe);

// ONBOARDING FLOW
router.patch('/onboarding', protect, updateOnboarding);

// DISPLAY NAME ONLY
router.patch('/displayname', protect, updateDisplayName);

// UPDATE PROFILE (username + displayName)
router.patch('/update-profile', protect, updateProfile);

// GLOBAL BIO
router.patch('/bio', protect, updateBio);

// ACCOUNT INFO (email, phone)
router.patch('/account', protect, updateAccountInfo);

// INSTALLED APPS
router.post('/apps', protect, addInstalledApp);
router.delete('/apps', protect, removeInstalledApp);

// ENERGY
router.get('/energy', protect, getEnergy);
router.patch('/energy', protect, updateEnergy);

module.exports = router;
