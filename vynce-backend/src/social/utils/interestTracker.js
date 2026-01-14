// User Interest Tracking Utility
// Tracks user behavior to build interest profiles

const User = require("../../models/User");

/**
 * Signal weights for different user actions
 */
const SIGNAL_WEIGHTS = {
  LIKE: 3,
  COMMENT: 5,
  SHARE: 4,
  FOLLOW: 2,
  SAVE: 3,
};

/**
 * Updates user interests based on interaction with a drop
 * @param {string} userId - User ID
 * @param {Array<string>} topics - Topics from the drop
 * @param {string} action - Action type (LIKE, COMMENT, SHARE, SAVE)
 */
async function trackInterest(userId, topics, action) {
  if (!topics || topics.length === 0) return;

  const weight = SIGNAL_WEIGHTS[action];
  if (!weight) return;

  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Initialize interests map if it doesn't exist
    if (!user.interests) {
      user.interests = new Map();
    }

    // Update interest scores for each topic
    topics.forEach(topic => {
      const currentScore = user.interests.get(topic) || 0;
      user.interests.set(topic, currentScore + weight);
    });

    await user.save();
  } catch (error) {
    console.error('Error tracking user interest:', error);
  }
}

/**
 * Updates user interests when they follow someone
 * @param {string} userId - User who is following
 * @param {string} followedUserId - User being followed
 */
async function trackFollowInterest(userId, followedUserId) {
  try {
    // Get the followed user's recent drops to infer their interests
    const Drop = require("../models/Drop");
    const recentDrops = await Drop.find({ author: followedUserId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('topics');

    const topicCounts = new Map();

    // Count topic frequency in recent drops
    recentDrops.forEach(drop => {
      drop.topics.forEach(topic => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      });
    });

    // Convert to array and track interests
    const topics = Array.from(topicCounts.keys());
    await trackInterest(userId, topics, 'FOLLOW');

  } catch (error) {
    console.error('Error tracking follow interest:', error);
  }
}

/**
 * Gets user's top interests sorted by score
 * @param {string} userId - User ID
 * @param {number} limit - Max number of interests to return
 * @returns {Array<{topic: string, score: number}>}
 */
async function getUserInterests(userId, limit = 5) {
  try {
    const user = await User.findById(userId).select('interests');
    if (!user || !user.interests) return [];

    // Convert Map to array and sort by score
    const interests = Array.from(user.interests.entries())
      .map(([topic, score]) => ({ topic, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return interests;
  } catch (error) {
    console.error('Error getting user interests:', error);
    return [];
  }
}

/**
 * Calculates interest boost for a drop based on user interests
 * @param {Array<string>} dropTopics - Topics of the drop
 * @param {Array<{topic: string, score: number}>} userInterests - User's interests
 * @returns {number} - Boost score
 */
function calculateInterestBoost(dropTopics, userInterests) {
  if (!dropTopics || dropTopics.length === 0 || !userInterests || userInterests.length === 0) {
    return 0;
  }

  let boost = 0;
  const maxInterestScore = Math.max(...userInterests.map(i => i.score));

  dropTopics.forEach(dropTopic => {
    const userInterest = userInterests.find(i => i.topic === dropTopic);
    if (userInterest) {
      // Normalize boost by user's max interest score
      boost += (userInterest.score / maxInterestScore) * 2; // Max boost of 2
    }
  });

  return Math.min(boost, 3); // Cap at 3 to prevent over-boosting
}

module.exports = {
  trackInterest,
  trackFollowInterest,
  getUserInterests,
  calculateInterestBoost,
  SIGNAL_WEIGHTS,
};