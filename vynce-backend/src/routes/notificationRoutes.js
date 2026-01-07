const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/auth");

// Get notifications
router.get("/", auth, notificationController.getNotifications);

// Mark as read
router.put("/:notificationId/read", auth, notificationController.markAsRead);

// Mark all as read
router.put("/read-all", auth, notificationController.markAllAsRead);

module.exports = router;