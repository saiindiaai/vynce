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
  updateEnergy,
  updateNotifications,
  updatePrivacy,
  searchUsers,
  getNotifications,
  getPublicProfile,
  logoutUser,
  deleteAccount
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET USER
router.get('/me', protect, getMe);

// logoutUser
router.post("/logout", protect, logoutUser);

// public username
router.get("/public/:username", getPublicProfile);

// search
router.get("/search", protect, searchUsers);

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

// notification
router.patch("/notifications", protect, updateNotifications);

router.get("/notifications", protect, getNotifications);

// DELETE ACCOUNT
router.delete("/me", protect, deleteAccount);

// privacy
router.patch("/privacy", protect, updatePrivacy);

// INSTALLED APPS
router.post('/apps', protect, addInstalledApp);
router.delete('/apps', protect, removeInstalledApp);

// ENERGY
router.get('/energy', protect, getEnergy);
router.patch('/energy', protect, updateEnergy);

module.exports = router;
