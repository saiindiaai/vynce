const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

module.exports = (io) => {
  const auth = require("../middleware/auth")(io);

  // Get notifications
  router.get("/", auth, notificationController.getNotifications);

  // Mark as read
  router.put("/:notificationId/read", auth, notificationController.markAsRead);

  // Mark all as read
  router.put("/read-all", auth, notificationController.markAllAsRead);

  return router;
};