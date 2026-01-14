// Notification Controller
// STEP 7: Actionable Priority Notifications

const {
  getUserNotifications,
  resolveActionableNotification,
  markNotificationRead,
  clearOldNotifications,
  getNotificationCounts
} = require("../utils/notificationManager");

/* ================================
   GET USER NOTIFICATIONS
================================ */
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 50;

    const notifications = await getUserNotifications(userId, limit);

    // Enrich notifications with additional data if needed
    const enrichedNotifications = notifications.map(notification => ({
      _id: notification._id,
      type: notification.type,
      category: notification.category,
      status: notification.status,
      title: notification.title,
      message: notification.message,
      actionData: notification.actionData,
      metadata: notification.metadata,
      date: notification.date,
      read: notification.read,
      resolvedAt: notification.resolvedAt,
      // UI helper flags
      requiresAction: notification.type === 'actionable' && notification.status === 'pending',
      canDismiss: notification.type === 'informational',
    }));

    res.json({
      notifications: enrichedNotifications,
      total: enrichedNotifications.length
    });
  } catch (err) {
    console.error("getNotifications error:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/* ================================
   GET NOTIFICATION COUNTS
================================ */
exports.getNotificationCounts = async (req, res) => {
  try {
    const userId = req.userId;
    const counts = await getNotificationCounts(userId);

    res.json(counts);
  } catch (err) {
    console.error("getNotificationCounts error:", err);
    res.status(500).json({ message: "Failed to get notification counts" });
  }
};

/* ================================
   RESOLVE ACTIONABLE NOTIFICATION
================================ */
exports.resolveNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const { notificationId, action } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: "Action must be 'approve' or 'reject'" });
    }

    const result = await resolveActionableNotification(userId, notificationId, action);

    // Here you would trigger the actual business logic based on notification type
    // For example: approve house join, accept fight request, etc.
    await handleNotificationAction(result.notification, action);

    res.json({
      success: true,
      message: `Notification ${action}d successfully`,
      action,
      notificationId
    });
  } catch (err) {
    console.error("resolveNotification error:", err);
    res.status(500).json({ message: err.message || "Failed to resolve notification" });
  }
};

/* ================================
   MARK NOTIFICATION AS READ
================================ */
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { notificationId } = req.params;

    await markNotificationRead(userId, notificationId);

    res.json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    console.error("markAsRead error:", err);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};

/* ================================
   CLEAR OLD NOTIFICATIONS
================================ */
exports.clearOldNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const daysOld = parseInt(req.query.days) || 30;

    await clearOldNotifications(userId, daysOld);

    res.json({ success: true, message: `Cleared notifications older than ${daysOld} days` });
  } catch (err) {
    console.error("clearOldNotifications error:", err);
    res.status(500).json({ message: "Failed to clear old notifications" });
  }
};

/* ================================
   BUSINESS LOGIC HANDLER
================================ */
async function handleNotificationAction(notification, action) {
  // This function handles the actual business logic after notification resolution
  const { category, actionData } = notification;

  try {
    switch (category) {
      case 'house_join':
        if (action === 'approve') {
          // Add user to house
          await handleHouseJoinApproval(actionData);
        } else {
          // Reject house join (just mark as resolved)
          console.log(`House join rejected for user ${actionData.requesterId}`);
        }
        break;

      case 'fight_request':
        if (action === 'approve') {
          // Start fight
          await handleFightAcceptance(actionData);
        } else {
          // Reject fight (just mark as resolved)
          console.log(`Fight request rejected from user ${actionData.requesterId}`);
        }
        break;

      case 'gang_add':
        if (action === 'approve') {
          // Add to gang
          await handleGangAddApproval(actionData);
        } else {
          // Reject gang add (just mark as resolved)
          console.log(`Gang add rejected for user ${actionData.requesterId}`);
        }
        break;

      default:
        console.log(`Unknown notification category: ${category}`);
    }
  } catch (error) {
    console.error(`Error handling ${category} ${action}:`, error);
    // Don't throw - we don't want notification resolution to fail
  }
}

// Placeholder functions for business logic (implement based on your actual models)
async function handleHouseJoinApproval(actionData) {
  // TODO: Implement house join logic
  console.log(`Approving house join: ${JSON.stringify(actionData)}`);
}

async function handleFightAcceptance(actionData) {
  // TODO: Implement fight acceptance logic
  console.log(`Accepting fight: ${JSON.stringify(actionData)}`);
}

async function handleGangAddApproval(actionData) {
  // TODO: Implement gang add logic
  console.log(`Approving gang add: ${JSON.stringify(actionData)}`);
}