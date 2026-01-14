// Feed Stability & Anti-Noise Controls Utility
// STEP 6: Posting limits, feed stickiness, and soft downranking

const Drop = require("../models/Drop");

/**
 * Posting rate limits
 */
const POSTING_LIMITS = {
  MAX_DROPS_PER_HOUR: 3,
  MAX_DROPS_PER_DAY: 10,
  CACHE_DURATION_MINUTES: 5, // Feed cache duration
};

/**
 * Checks if user can post a drop based on rate limits
 * @param {string} userId - User ID
 * @returns {Object} { canPost: boolean, waitTime?: number, message?: string }
 */
async function checkPostingLimits(userId) {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Count drops in last hour
    const dropsLastHour = await Drop.countDocuments({
      author: userId,
      createdAt: { $gte: oneHourAgo }
    });

    // Count drops in last day
    const dropsLastDay = await Drop.countDocuments({
      author: userId,
      createdAt: { $gte: oneDayAgo }
    });

    // Check hourly limit
    if (dropsLastHour >= POSTING_LIMITS.MAX_DROPS_PER_HOUR) {
      const oldestDrop = await Drop.findOne({
        author: userId,
        createdAt: { $gte: oneHourAgo }
      }).sort({ createdAt: 1 });

      const waitTimeMs = oneHourAgo.getTime() - oldestDrop.createdAt.getTime();
      const waitTimeMinutes = Math.ceil(waitTimeMs / (60 * 1000));

      return {
        canPost: false,
        waitTime: waitTimeMinutes,
        message: `You've reached the hourly limit of ${POSTING_LIMITS.MAX_DROPS_PER_HOUR} drops. Try again in ${waitTimeMinutes} minutes.`
      };
    }

    // Check daily limit
    if (dropsLastDay >= POSTING_LIMITS.MAX_DROPS_PER_DAY) {
      const oldestDrop = await Drop.findOne({
        author: userId,
        createdAt: { $gte: oneDayAgo }
      }).sort({ createdAt: 1 });

      const waitTimeMs = oneDayAgo.getTime() - oldestDrop.createdAt.getTime();
      const waitTimeHours = Math.ceil(waitTimeMs / (60 * 60 * 1000));

      return {
        canPost: false,
        waitTime: waitTimeHours * 60, // Convert to minutes
        message: `You've reached the daily limit of ${POSTING_LIMITS.MAX_DROPS_PER_DAY} drops. Try again in ${waitTimeHours} hours.`
      };
    }

    return { canPost: true };
  } catch (error) {
    console.error('Error checking posting limits:', error);
    // Allow posting if there's an error (fail open)
    return { canPost: true };
  }
}

/**
 * Calculates time decay factor for drop scoring
 * Recent drops get full score, older drops decay gradually
 * @param {Date} createdAt - When the drop was created
 * @returns {number} - Decay multiplier (0-1)
 */
function calculateTimeDecay(createdAt) {
  const now = new Date();
  const ageInHours = (now - createdAt) / (1000 * 60 * 60);

  // No decay for first 2 hours
  if (ageInHours <= 2) return 1;

  // Gradual decay after 2 hours
  // After 24 hours, decay to 0.5
  // After 48 hours, decay to 0.25
  const decayRate = Math.pow(0.5, ageInHours / 24);
  return Math.max(decayRate, 0.1); // Minimum decay of 0.1
}

/**
 * Calculates engagement decay factor
 * Low engagement drops decay faster, high engagement drops decay slower
 * @param {number} engagementScore - Base engagement score
 * @param {Date} createdAt - When the drop was created
 * @returns {number} - Engagement decay multiplier (0-1)
 */
function calculateEngagementDecay(engagementScore, createdAt) {
  const now = new Date();
  const ageInHours = (now - createdAt) / (1000 * 60 * 60);

  // High engagement threshold (lots of likes/comments)
  if (engagementScore >= 10) {
    // High engagement drops decay very slowly
    return Math.max(0.8, Math.pow(0.95, ageInHours));
  }

  // Medium engagement (some interaction)
  if (engagementScore >= 3) {
    // Medium decay
    return Math.max(0.5, Math.pow(0.9, ageInHours));
  }

  // Low engagement drops decay faster
  // After 6 hours, decay significantly
  const decayRate = Math.pow(0.7, ageInHours / 6);
  return Math.max(decayRate, 0.2); // Minimum decay of 0.2
}

/**
 * Simple in-memory cache for feed results
 * In production, use Redis or similar
 */
const feedCache = new Map();

/**
 * Gets cached feed data if still valid
 * @param {string} cacheKey - Unique cache key
 * @returns {Object|null} - Cached data or null if expired
 */
function getCachedFeed(cacheKey) {
  const cached = feedCache.get(cacheKey);
  if (!cached) return null;

  const now = Date.now();
  const cacheAge = now - cached.timestamp;

  // Check if cache is still valid
  if (cacheAge < POSTING_LIMITS.CACHE_DURATION_MINUTES * 60 * 1000) {
    return cached.data;
  }

  // Cache expired, remove it
  feedCache.delete(cacheKey);
  return null;
}

/**
 * Caches feed data with timestamp
 * @param {string} cacheKey - Unique cache key
 * @param {Object} data - Data to cache
 */
function setCachedFeed(cacheKey, data) {
  feedCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
}

module.exports = {
  checkPostingLimits,
  calculateTimeDecay,
  calculateEngagementDecay,
  getCachedFeed,
  setCachedFeed,
  POSTING_LIMITS,
};