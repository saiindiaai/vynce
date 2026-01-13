const express = require("express");
const {
  getMe,
  getUserStats,
  getUserAura,
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
  getPublicProfile,
  logoutUser,
  deleteAccount,
  getProfileCard,
  updateShowcase,
  getCelestium,
  addCelestiumTransaction,
  updateProfileShowcase,
} = require("../controllers/userController");

const {
  followUser,
  unfollowUser,
  approveFollowRequest,
  rejectFollowRequest,
} = require("../controllers/socialController");

const { getNotifications } = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// GET USER
router.get("/me", protect, getMe);
router.get("/stats", protect, getUserStats);
router.get("/aura", protect, getUserAura);

// FOLLOW SYSTEM
router.post("/follow", protect, followUser);
router.post("/unfollow", protect, unfollowUser);
router.post("/follow/approve", protect, approveFollowRequest);
router.post("/follow/reject", protect, rejectFollowRequest);

// logoutUser
router.post("/logout", protect, logoutUser);

// public username
router.get("/public/:username", protect, getPublicProfile);

// search
router.get("/search", protect, searchUsers);

// ONBOARDING FLOW
router.patch("/onboarding", protect, updateOnboarding);

// DISPLAY NAME ONLY
router.patch("/displayname", protect, updateDisplayName);

// UPDATE PROFILE (username + displayName)
router.patch("/update-profile", protect, updateProfile);

// GLOBAL BIO
router.patch("/bio", protect, updateBio);

// ACCOUNT INFO (email, phone)
router.patch("/account", protect, updateAccountInfo);

// notification
router.patch("/notifications", protect, updateNotifications);

router.get("/notifications", protect, getNotifications);

// DELETE ACCOUNT
router.delete("/me", protect, deleteAccount);

// privacy
router.patch("/privacy", protect, updatePrivacy);

// INSTALLED APPS
router.post("/apps", protect, addInstalledApp);
router.delete("/apps", protect, removeInstalledApp);

// ENERGY
router.get("/energy", protect, getEnergy);
router.patch("/energy", protect, updateEnergy);

// CELESTIUM
router.get("/celestium", protect, getCelestium);

// Add Celestium earned/spent transaction
router.post("/celestium/transaction", protect, addCelestiumTransaction);

module.exports = router;

// Profile card data (ecosystem hero card)
router.get("/profile-card", protect, getProfileCard);

// Update showcase slots (3 inventory, 3 achievements, 3 dares)
router.put("/profile-card/showcase", protect, updateProfileShowcase);

router.patch("/profile-card/showcase", protect, updateShowcase);
