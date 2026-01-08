const User = require("../models/User");
const Drop = require("../social/models/Drop");
const Post = require("../social/models/Post");

/* ================================
   GET USER STATS
   ================================ */
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('followers following');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      inMyGang: user.followers ? user.followers.length : 0, // followers count
      mutualGangs: user.following ? user.following.length : 0, // following count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   GET USER AURA
   ================================ */
exports.getUserAura = async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Aggregate total likes and dislikes from drops
    const dropStats = await Drop.aggregate([
      { $match: { author: userId } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
          totalDislikes: { $sum: { $size: { $ifNull: ["$dislikes", []] } } }
        }
      }
    ]);

    // Aggregate total likes and dislikes from posts
    const postStats = await Post.aggregate([
      { $match: { author: userId } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
          totalDislikes: { $sum: { $size: { $ifNull: ["$dislikes", []] } } }
        }
      }
    ]);

    const dropLikes = dropStats[0]?.totalLikes || 0;
    const dropDislikes = dropStats[0]?.totalDislikes || 0;
    const postLikes = postStats[0]?.totalLikes || 0;
    const postDislikes = postStats[0]?.totalDislikes || 0;

    const totalAura = (dropLikes + postLikes) - (dropDislikes + postDislikes);

    // Calculate weekly aura (content created this week)
    const weeklyDropStats = await Drop.aggregate([
      { $match: { author: userId, createdAt: { $gte: oneWeekAgo } } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
          totalDislikes: { $sum: { $size: { $ifNull: ["$dislikes", []] } } }
        }
      }
    ]);

    const weeklyPostStats = await Post.aggregate([
      { $match: { author: userId, createdAt: { $gte: oneWeekAgo } } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
          totalDislikes: { $sum: { $size: { $ifNull: ["$dislikes", []] } } }
        }
      }
    ]);

    const weeklyAura = ((weeklyDropStats[0]?.totalLikes || 0) + (weeklyPostStats[0]?.totalLikes || 0)) -
      ((weeklyDropStats[0]?.totalDislikes || 0) + (weeklyPostStats[0]?.totalDislikes || 0));

    // Calculate monthly aura
    const monthlyDropStats = await Drop.aggregate([
      { $match: { author: userId, createdAt: { $gte: oneMonthAgo } } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
          totalDislikes: { $sum: { $size: { $ifNull: ["$dislikes", []] } } }
        }
      }
    ]);

    const monthlyPostStats = await Post.aggregate([
      { $match: { author: userId, createdAt: { $gte: oneMonthAgo } } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
          totalDislikes: { $sum: { $size: { $ifNull: ["$dislikes", []] } } }
        }
      }
    ]);

    const monthlyAura = ((monthlyDropStats[0]?.totalLikes || 0) + (monthlyPostStats[0]?.totalLikes || 0)) -
      ((monthlyDropStats[0]?.totalDislikes || 0) + (monthlyPostStats[0]?.totalDislikes || 0));

    // Calculate all-time rank
    // First, get all users' total aura
    const allUsersAura = await Promise.all([
      Drop.aggregate([
        {
          $group: {
            _id: "$author",
            totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
            totalDislikes: { $sum: { $size: { $ifNull: ["$dislikes", []] } } }
          }
        }
      ]),
      Post.aggregate([
        {
          $group: {
            _id: "$author",
            totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
            totalDislikes: { $sum: { $size: { $ifNull: ["$dislikes", []] } } }
          }
        }
      ])
    ]);

    // Combine drop and post auras per user
    const userAuras = {};
    allUsersAura[0].forEach(user => {
      userAuras[user._id] = (userAuras[user._id] || 0) + user.totalLikes - user.totalDislikes;
    });
    allUsersAura[1].forEach(user => {
      userAuras[user._id] = (userAuras[user._id] || 0) + user.totalLikes - user.totalDislikes;
    });

    // Sort by aura descending
    const sortedUsers = Object.entries(userAuras).sort((a, b) => b[1] - a[1]);
    const userRank = sortedUsers.findIndex(([id]) => id === userId) + 1;

    res.json({
      totalAura,
      thisWeek: weeklyAura,
      thisMonth: monthlyAura,
      allTimeRank: userRank || 1,
    });
  } catch (err) {
    console.error("getUserAura error:", err);
    res.status(500).json({ message: err.message });
  }
};
