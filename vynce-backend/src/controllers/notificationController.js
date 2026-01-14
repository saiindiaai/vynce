const Notification = require("../models/Notification");
const User = require("../models/User");

/**
 * Notification types and their configurations
 */
const NOTIFICATION_TYPES = {
  // Actionable notifications (require user action)
  ACTIONABLE: {
    HOUSE_JOIN: {
      category: "house_join",
      titleTemplate: "{requester} requested to join your house",
      messageTemplate: "Review and approve or reject this join request.",
    },
    FIGHT_REQUEST: {
      category: "fight_request",
      titleTemplate: "Fight request from {requester}",
      messageTemplate: "Accept or decline this fight challenge.",
    },
    GANG_ADD: {
      category: "gang_add",
      titleTemplate: "{requester} wants to add you to their gang",
      messageTemplate: "Approve or reject this gang invitation.",
    },
  },

  // Informational notifications (FYI only)
  INFORMATIONAL: {
    REACTION: {
      category: "reaction",
      titleTemplate: "{actor} reacted to your drop",
      messageTemplate: "Someone engaged with your content.",
    },
    COMMENT: {
      category: "comment",
      titleTemplate: "{actor} commented on your drop",
      messageTemplate: "New discussion on your content.",
    },
    FOLLOW: {
      category: "follow",
      titleTemplate: "{actor} started following you",
      messageTemplate: "You have a new follower.",
    },
    LEVEL_UP: {
      category: "level_up",
      titleTemplate: "Congratulations! You reached Level {level}",
      messageTemplate: "Keep up the great work!",
    },
    MILESTONE: {
      category: "milestone",
      titleTemplate: "Milestone achieved: {milestone}",
      messageTemplate: "You've reached a new milestone!",
    },
  },
};

// Get notifications for the user with priority ordering
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 50;

    // Get notifications with proper priority ordering:
    // 1. Pending actionable notifications (by date, newest first)
    // 2. Unread informational notifications (by date, newest first)
    // 3. Read/old notifications (by date, newest first)

    const notifications = await Notification.find({
      user: userId,
      status: { $ne: 'resolved' } // Don't show resolved actionable notifications
    })
      .sort({ createdAt: -1 }) // Get all, then sort by priority in memory
      .populate("actionData.requesterId", "username displayName")
      .limit(limit * 2); // Get more to ensure proper priority sorting

    // Sort by priority in memory
    const sortedNotifications = notifications
      .sort((a, b) => {
        // Priority 1: Pending actionable notifications
        const aIsActionablePending = a.type === 'actionable' && a.status === 'pending';
        const bIsActionablePending = b.type === 'actionable' && b.status === 'pending';

        if (aIsActionablePending && !bIsActionablePending) return -1;
        if (!aIsActionablePending && bIsActionablePending) return 1;

        // Priority 2: Unread informational notifications
        const aIsUnreadInfo = a.type === 'informational' && !a.isRead;
        const bIsUnreadInfo = b.type === 'informational' && !b.isRead;

        if (aIsUnreadInfo && !bIsUnreadInfo) return -1;
        if (!aIsUnreadInfo && bIsUnreadInfo) return 1;

        // Priority 3: Sort by date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .slice(0, limit);

    // Enrich notifications with additional data
    const enrichedNotifications = sortedNotifications.map(notification => ({
      _id: notification._id,
      type: notification.type,
      category: notification.category,
      status: notification.status,
      title: notification.title,
      message: notification.message,
      actionData: notification.actionData,
      metadata: notification.metadata,
      createdAt: notification.createdAt,
      isRead: notification.isRead,
      resolvedAt: notification.resolvedAt,
      // UI helper flags
      requiresAction: notification.type === 'actionable' && notification.status === 'pending',
      canDismiss: notification.type === 'informational',
      pinned: notification.type === 'actionable' && notification.status === 'pending',
    }));

    res.json({
      notifications: enrichedNotifications,
      total: enrichedNotifications.length
    });
  } catch (error) {
    console.error("getNotifications error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get notification counts for UI badges
exports.getNotificationCounts = async (req, res) => {
  try {
    const userId = req.userId;

    const counts = await Notification.aggregate([
      { $match: { user: userId, status: { $ne: 'resolved' } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          actionable: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$type", "actionable"] }, { $eq: ["$status", "pending"] }] },
                1,
                0
              ]
            }
          },
          informational: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$type", "informational"] }, { $eq: ["$isRead", false] }] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const result = counts[0] || { total: 0, actionable: 0, informational: 0 };
    res.json(result);
  } catch (error) {
    console.error("getNotificationCounts error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create an actionable notification
exports.createActionableNotification = async (userId, notificationKey, data, actionData) => {
  const config = NOTIFICATION_TYPES.ACTIONABLE[notificationKey];
  if (!config) throw new Error(`Unknown actionable notification: ${notificationKey}`);

  const notification = new Notification({
    user: userId,
    type: "actionable",
    category: config.category,
    status: "pending",
    title: replaceTemplate(config.titleTemplate, data),
    message: replaceTemplate(config.messageTemplate, data),
    actionData,
    metadata: data.metadata || {},
    pinned: true, // Actionable notifications are always pinned
    priority: "HIGH",
  });

  await notification.save();
  return notification;
};

// Create an informational notification
exports.createInformationalNotification = async (userId, notificationKey, data) => {
  const config = NOTIFICATION_TYPES.INFORMATIONAL[notificationKey];
  if (!config) throw new Error(`Unknown informational notification: ${notificationKey}`);

  const notification = new Notification({
    user: userId,
    type: "informational",
    category: config.category,
    status: "pending", // For informational, this means "unread"
    title: replaceTemplate(config.titleTemplate, data),
    message: replaceTemplate(config.messageTemplate, data),
    metadata: data.metadata || {},
  });

  await notification.save();
  return notification;
};

// Resolve actionable notification (approve/reject)
exports.resolveNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const { notificationId, action } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: "Action must be 'approve' or 'reject'" });
    }

    const notification = await Notification.findOne({
      _id: notificationId,
      user: userId,
      type: 'actionable',
      status: 'pending'
    });

    if (!notification) {
      return res.status(404).json({ message: "Actionable notification not found" });
    }

    // Mark as resolved
    notification.status = 'resolved';
    notification.resolvedAt = new Date();
    notification.actionData.actionType = action;
    await notification.save();

    // Handle the actual business logic
    await handleNotificationAction(notification, action);

    res.json({
      success: true,
      message: `Notification ${action}d successfully`,
      action,
      notificationId
    });
  } catch (error) {
    console.error("resolveNotification error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.userId;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("markAsRead error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.userId;

    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("markAllAsRead error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Clear old notifications (cleanup)
exports.clearOldNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const daysOld = parseInt(req.query.days) || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Notification.deleteMany({
      user: userId,
      type: 'informational',
      isRead: true,
      createdAt: { $lt: cutoffDate }
    });

    res.json({
      success: true,
      message: `Cleared ${result.deletedCount} old notifications`
    });
  } catch (error) {
    console.error("clearOldNotifications error:", error);
    res.status(500).json({ message: error.message });
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
          await handleHouseJoinApproval(actionData);
        } else {
          console.log(`House join rejected for user ${actionData.requesterId}`);
        }
        break;

      case 'fight_request':
        if (action === 'approve') {
          await handleFightAcceptance(actionData);
        } else {
          console.log(`Fight request rejected from user ${actionData.requesterId}`);
        }
        break;

      case 'gang_add':
        if (action === 'approve') {
          await handleGangAddApproval(actionData);
        } else {
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

/**
 * Replaces template variables in notification text
 */
function replaceTemplate(template, data) {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return data[key] || match;
  });
}