// Notification Manager Utility
// STEP 7: Actionable Priority Notifications

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

/**
 * Creates an actionable notification
 * @param {string} userId - User to notify
 * @param {string} notificationKey - Key from ACTIONABLE types
 * @param {Object} data - Notification data
 * @param {Object} actionData - Data needed for action resolution
 */
async function createActionableNotification(userId, notificationKey, data, actionData) {
  const config = NOTIFICATION_TYPES.ACTIONABLE[notificationKey];
  if (!config) throw new Error(`Unknown actionable notification: ${notificationKey}`);

  const notification = {
    type: "actionable",
    category: config.category,
    status: "pending",
    title: replaceTemplate(config.titleTemplate, data),
    message: replaceTemplate(config.messageTemplate, data),
    actionData,
    metadata: data.metadata || {},
  };

  await User.findByIdAndUpdate(userId, {
    $push: { notifications: notification }
  });

  return notification;
}

/**
 * Creates an informational notification
 * @param {string} userId - User to notify
 * @param {string} notificationKey - Key from INFORMATIONAL types
 * @param {Object} data - Notification data
 */
async function createInformationalNotification(userId, notificationKey, data) {
  const config = NOTIFICATION_TYPES.INFORMATIONAL[notificationKey];
  if (!config) throw new Error(`Unknown informational notification: ${notificationKey}`);

  const notification = {
    type: "informational",
    category: config.category,
    status: "pending", // For informational, this means "unread"
    title: replaceTemplate(config.titleTemplate, data),
    message: replaceTemplate(config.messageTemplate, data),
    metadata: data.metadata || {},
  };

  await User.findByIdAndUpdate(userId, {
    $push: { notifications: notification }
  });

  return notification;
}

/**
 * Gets user's notifications with proper priority ordering
 * @param {string} userId - User ID
 * @param {number} limit - Max notifications to return
 * @returns {Array} - Ordered notifications
 */
async function getUserNotifications(userId, limit = 50) {
  const user = await User.findById(userId).select('notifications');
  if (!user) return [];

  // Sort notifications by priority:
  // 1. Pending actionable notifications (by date, newest first)
  // 2. Unread informational notifications (by date, newest first)
  // 3. Read/old notifications (by date, newest first)

  const sortedNotifications = user.notifications
    .filter(n => n.status !== 'resolved') // Don't show resolved actionable notifications
    .sort((a, b) => {
      // Priority 1: Pending actionable notifications
      const aIsActionablePending = a.type === 'actionable' && a.status === 'pending';
      const bIsActionablePending = b.type === 'actionable' && b.status === 'pending';

      if (aIsActionablePending && !bIsActionablePending) return -1;
      if (!aIsActionablePending && bIsActionablePending) return 1;

      // Priority 2: Unread informational notifications
      const aIsUnreadInfo = a.type === 'informational' && !a.read;
      const bIsUnreadInfo = b.type === 'informational' && !b.read;

      if (aIsUnreadInfo && !bIsUnreadInfo) return -1;
      if (!aIsUnreadInfo && bIsUnreadInfo) return 1;

      // Priority 3: Sort by date (newest first)
      return new Date(b.date) - new Date(a.date);
    })
    .slice(0, limit);

  return sortedNotifications;
}

/**
 * Resolves an actionable notification
 * @param {string} userId - User ID
 * @param {string} notificationId - Notification ID
 * @param {string} action - "approve" or "reject"
 * @returns {Object} - Resolution result
 */
async function resolveActionableNotification(userId, notificationId, action) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const notification = user.notifications.id(notificationId);
  if (!notification) throw new Error('Notification not found');

  if (notification.type !== 'actionable' || notification.status !== 'pending') {
    throw new Error('Notification is not actionable or not pending');
  }

  // Mark as resolved
  notification.status = 'resolved';
  notification.resolvedAt = new Date();
  notification.actionData.actionType = action;

  await user.save();

  return {
    success: true,
    action,
    notification: notification.toObject()
  };
}

/**
 * Marks informational notification as read
 * @param {string} userId - User ID
 * @param {string} notificationId - Notification ID
 */
async function markNotificationRead(userId, notificationId) {
  await User.findOneAndUpdate(
    { _id: userId, 'notifications._id': notificationId },
    { $set: { 'notifications.$.read': true } }
  );
}

/**
 * Clears old read informational notifications (cleanup)
 * @param {string} userId - User ID
 * @param {number} daysOld - Remove notifications older than this many days
 */
async function clearOldNotifications(userId, daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  await User.findByIdAndUpdate(userId, {
    $pull: {
      notifications: {
        type: 'informational',
        read: true,
        date: { $lt: cutoffDate }
      }
    }
  });
}

/**
 * Gets notification counts for UI badges
 * @param {string} userId - User ID
 * @returns {Object} - Counts by type
 */
async function getNotificationCounts(userId) {
  const user = await User.findById(userId).select('notifications');
  if (!user) return { total: 0, actionable: 0, informational: 0 };

  const counts = user.notifications.reduce((acc, n) => {
    if (n.status === 'resolved') return acc; // Skip resolved actionable

    acc.total++;

    if (n.type === 'actionable' && n.status === 'pending') {
      acc.actionable++;
    } else if (n.type === 'informational' && !n.read) {
      acc.informational++;
    }

    return acc;
  }, { total: 0, actionable: 0, informational: 0 });

  return counts;
}

/**
 * Replaces template variables in notification text
 * @param {string} template - Template string
 * @param {Object} data - Replacement data
 * @returns {string} - Processed string
 */
function replaceTemplate(template, data) {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return data[key] || match;
  });
}

module.exports = {
  createActionableNotification,
  createInformationalNotification,
  getUserNotifications,
  resolveActionableNotification,
  markNotificationRead,
  clearOldNotifications,
  getNotificationCounts,
  NOTIFICATION_TYPES,
};