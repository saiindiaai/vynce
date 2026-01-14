// Notification Service
// Easy-to-use functions for creating notifications throughout the app
// STEP 7: Actionable Priority Notifications

const { createActionableNotification, createInformationalNotification } = require("../controllers/notificationController");

/**
 * Create a house join request notification
 * @param {string} houseOwnerId - User who owns the house
 * @param {string} requesterId - User requesting to join
 * @param {string} houseId - House ID
 */
async function notifyHouseJoinRequest(houseOwnerId, requesterId, houseId) {
  try {
    const requester = await require("../models/User").findById(requesterId).select("username displayName");

    await createActionableNotification(houseOwnerId, "HOUSE_JOIN", {
      requester: requester.displayName || requester.username,
      metadata: { houseId, requesterId }
    }, {
      requestId: `house_join_${houseId}_${requesterId}`,
      requesterId,
      targetId: houseId
    });
  } catch (error) {
    console.error("Error creating house join notification:", error);
  }
}

/**
 * Create a fight request notification
 * @param {string} targetUserId - User being challenged
 * @param {string} challengerId - User sending the challenge
 * @param {string} fightId - Fight ID
 */
async function notifyFightRequest(targetUserId, challengerId, fightId) {
  try {
    const challenger = await require("../models/User").findById(challengerId).select("username displayName");

    await createActionableNotification(targetUserId, "FIGHT_REQUEST", {
      requester: challenger.displayName || challenger.username,
      metadata: { fightId, challengerId }
    }, {
      requestId: `fight_${fightId}`,
      requesterId: challengerId,
      targetId: fightId
    });
  } catch (error) {
    console.error("Error creating fight request notification:", error);
  }
}

/**
 * Create a gang add request notification
 * @param {string} targetUserId - User being added to gang
 * @param {string} requesterId - User sending the request
 * @param {string} gangId - Gang ID
 */
async function notifyGangAddRequest(targetUserId, requesterId, gangId) {
  try {
    const requester = await require("../models/User").findById(requesterId).select("username displayName");

    await createActionableNotification(targetUserId, "GANG_ADD", {
      requester: requester.displayName || requester.username,
      metadata: { gangId, requesterId }
    }, {
      requestId: `gang_add_${gangId}_${requesterId}`,
      requesterId,
      targetId: gangId
    });
  } catch (error) {
    console.error("Error creating gang add notification:", error);
  }
}

/**
 * Create a reaction notification
 * @param {string} dropAuthorId - Author of the drop that was reacted to
 * @param {string} reactorId - User who reacted
 * @param {string} dropId - Drop ID
 * @param {string} reactionType - Type of reaction
 */
async function notifyReaction(dropAuthorId, reactorId, dropId, reactionType) {
  try {
    // Don't notify if user reacted to their own drop
    if (dropAuthorId === reactorId) return;

    const reactor = await require("../models/User").findById(reactorId).select("username displayName");

    await createInformationalNotification(dropAuthorId, "REACTION", {
      actor: reactor.displayName || reactor.username,
      metadata: { dropId, reactionType, reactorId }
    });
  } catch (error) {
    console.error("Error creating reaction notification:", error);
  }
}

/**
 * Create a comment notification
 * @param {string} dropAuthorId - Author of the drop that was commented on
 * @param {string} commenterId - User who commented
 * @param {string} dropId - Drop ID
 */
async function notifyComment(dropAuthorId, commenterId, dropId) {
  try {
    // Don't notify if user commented on their own drop
    if (dropAuthorId === commenterId) return;

    const commenter = await require("../models/User").findById(commenterId).select("username displayName");

    await createInformationalNotification(dropAuthorId, "COMMENT", {
      actor: commenter.displayName || commenter.username,
      metadata: { dropId, commenterId }
    });
  } catch (error) {
    console.error("Error creating comment notification:", error);
  }
}

/**
 * Create a follow notification
 * @param {string} followedUserId - User who was followed
 * @param {string} followerId - User who followed
 */
async function notifyFollow(followedUserId, followerId) {
  try {
    const follower = await require("../models/User").findById(followerId).select("username displayName");

    await createInformationalNotification(followedUserId, "FOLLOW", {
      actor: follower.displayName || follower.username,
      metadata: { followerId }
    });
  } catch (error) {
    console.error("Error creating follow notification:", error);
  }
}

/**
 * Create a level up notification
 * @param {string} userId - User who leveled up
 * @param {number} newLevel - New level achieved
 */
async function notifyLevelUp(userId, newLevel) {
  try {
    await createInformationalNotification(userId, "LEVEL_UP", {
      level: newLevel,
      metadata: { level: newLevel }
    });
  } catch (error) {
    console.error("Error creating level up notification:", error);
  }
}

/**
 * Create a milestone notification
 * @param {string} userId - User who achieved milestone
 * @param {string} milestone - Milestone description
 */
async function notifyMilestone(userId, milestone) {
  try {
    await createInformationalNotification(userId, "MILESTONE", {
      milestone,
      metadata: { milestone }
    });
  } catch (error) {
    console.error("Error creating milestone notification:", error);
  }
}

module.exports = {
  notifyHouseJoinRequest,
  notifyFightRequest,
  notifyGangAddRequest,
  notifyReaction,
  notifyComment,
  notifyFollow,
  notifyLevelUp,
  notifyMilestone,
};