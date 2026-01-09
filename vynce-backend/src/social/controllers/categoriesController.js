const Drop = require("../models/Drop");
const House = require("../../models/House");

const User = require("../../models/User");

// GET /api/social/explore/categories
exports.getCategories = async (req, res) => {
  try {
    const userId = req.user._id;
    const DAYS = 14;
    const since = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);
    const user = await User.findById(userId).lean();

    // Collect categories from user activity
    let categoryScores = {};

    // Drops liked
    const likedDrops = await Drop.find({ likes: userId, createdAt: { $gte: since } }, 'tags').lean();
    likedDrops.forEach(drop => {
      (drop.tags || []).forEach(tag => {
        categoryScores[tag] = (categoryScores[tag] || 0) + 10;
      });
    });

    // Houses joined
    (user.houses || []).forEach(houseId => {
      categoryScores['Communities'] = (categoryScores['Communities'] || 0) + 15;
    });


    // Fights model not available; skipping fight-based scoring

    // Recent drops interacted with
    const recentDrops = await Drop.find({ $or: [{ likes: userId }, { comments: { $elemMatch: { user: userId } } }], createdAt: { $gte: since } }, 'tags').lean();
    recentDrops.forEach(drop => {
      (drop.tags || []).forEach(tag => {
        categoryScores[tag] = (categoryScores[tag] || 0) + 5;
      });
    });

    // Fallback: trending tags if no activity
    if (Object.keys(categoryScores).length === 0) {
      const allDrops = await Drop.find({ createdAt: { $gte: since } }, 'tags').lean();
      allDrops.forEach(drop => {
        (drop.tags || []).forEach(tag => {
          categoryScores[tag] = (categoryScores[tag] || 0) + 1;
        });
      });
    }

    // Format and sort
    const categories = Object.entries(categoryScores)
      .map(([name, score]) => ({ name, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};
