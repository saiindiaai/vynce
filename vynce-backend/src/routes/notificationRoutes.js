const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

module.exports = (io) => {
  const auth = require("../middleware/auth")(io);

  // Get notifications with priority ordering
  router.get("/", auth, notificationController.getNotifications);

  // Get notification counts for UI badges
  router.get("/counts", auth, notificationController.getNotificationCounts);

  // Resolve actionable notification (approve/reject)
  router.post("/resolve", auth, notificationController.resolveNotification);

  // Mark notification as read
  router.patch("/:notificationId/read", auth, notificationController.markAsRead);

  // Mark all notifications as read
  router.patch("/read-all", auth, notificationController.markAllAsRead);

  // Clear old notifications (cleanup)
  router.delete("/clear", auth, notificationController.clearOldNotifications);

  return router;
};