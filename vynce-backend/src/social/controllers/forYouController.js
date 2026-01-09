const Post = require("../models/Post");
const Drop = require("../models/Drop");
const House = require("../../models/House");
const User = require("../../models/User");


// GET /api/social/explore/for-you
exports.getForYou = async (req, res) => {
  try {
    const userId = req.user._id;
    const DAYS = 14;
    const since = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);

    // Drops user liked or interacted with
    const likedDropIds = await Drop.find({ likes: userId, createdAt: { $gte: since } }, '_id tags').lean();
    const likedTags = likedDropIds.flatMap(d => d.tags || []);

    // Suggest similar drops (by tags)
    let drops = [];
    if (likedTags.length) {
      drops = await Drop.find({
        tags: { $in: likedTags },
        _id: { $nin: likedDropIds.map(d => d._id) },
        createdAt: { $gte: since }
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('author', 'username')
        .lean();
    }

    // Houses user joined or viewed
    const user = await User.findById(userId).lean();
    const joinedHouseIds = user.houses || [];
    let houses = [];
    if (joinedHouseIds.length) {
      houses = await House.find({
        _id: { $nin: joinedHouseIds },
        tags: { $in: user.interests || [] }
      })
        .sort({ members: -1 })
        .limit(5)
        .lean();
    }


    // Fights model not available; skipping fight-based recommendations

    // Followed users' drops
    let creators = [];
    if (user.following && user.following.length) {
      creators = await Drop.find({
        author: { $in: user.following },
        createdAt: { $gte: since }
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('author', 'username')
        .lean();
    }

    // Fallback: trending drops if no activity
    if (!drops.length && !houses.length && !creators.length) {
      drops = await Drop.find({ createdAt: { $gte: since } })
        .sort({ likes: -1 })
        .limit(10)
        .populate('author', 'username')
        .lean();
    }

    res.json({
      drops,
      houses,
      creators
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch personalized recommendations" });
  }
};
