// Notification Routes
// STEP 7: Actionable Priority Notifications

const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authenticateToken } = require("../../middleware/auth");

// All notification routes require authentication
router.use(authenticateToken);

// Get user's notifications with priority ordering
router.get("/", notificationController.getNotifications);

// Get notification counts for UI badges
router.get("/counts", notificationController.getNotificationCounts);

// Resolve actionable notification (approve/reject)
router.post("/resolve", notificationController.resolveNotification);

// Mark informational notification as read
router.patch("/:notificationId/read", notificationController.markAsRead);

// Clear old notifications (cleanup)
router.delete("/clear", notificationController.clearOldNotifications);

module.exports = router;