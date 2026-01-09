/**
 * GET /api/social/explore/main
 *
 * Response JSON structure:
 * {
 *   trendingTopics: [
 *     { name: string, tag: string, posts: number, trend: number, trending: boolean }
 *   ],
 *   houses: [
 *     { name: string, icon: string, members: string, online: number, gradient: string, isJoined: boolean, rank: string }
 *   ],
 *   recommendations: [
 *     { name: string, icon: string, reason: string }
 *   ],
 *   shorts: [
 *     { id: number, title: string, thumb: string, user: string }
 *   ],
 *   liveEvents: [
 *     { id: number, name: string, viewers: number, icon: string }
 *   ]
 * }
 */
// Explore Controller: Handles main explore page data aggregation
const Post = require("../models/Post");
const Drop = require("../models/Drop");
const House = require("../../models/House");
const User = require("../../models/User");

// GET /api/social/explore/main
exports.getExploreMain = async (req, res) => {
  try {

    // Trending Topics: Parse hashtags from post content and count frequency
    const posts = await Post.find({}, { content: 1 }).lean();
    const hashtagCounts = {};
    const hashtagRegex = /#(\w+)/g;
    posts.forEach(post => {
      const tags = post.content.match(hashtagRegex);
      if (tags) {
        tags.forEach(tag => {
          const lowerTag = tag.toLowerCase();
          hashtagCounts[lowerTag] = (hashtagCounts[lowerTag] || 0) + 1;
        });
      }
    });
    // Convert to array and sort by count
    const sortedTags = Object.entries(hashtagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    // Trending topics format
    const trendingTopics = sortedTags.map(([tag, count], idx) => ({
      name: tag.replace('#', '').replace(/\b\w/g, l => l.toUpperCase()),
      tag,
      posts: count,
      trend: 10 + idx * 5, // mock trend %
      trending: idx === 0
    }));

    // Houses: Top 3 by members (from DB), excluding user's houses
    const housesRaw = await House.find({
      $and: [
        { foundedBy: { $ne: req.user._id } },
        { members: { $nin: [req.user._id] } }
      ]
    })
      .sort({ members: -1 })
      .limit(3)
      .lean();

    // Map DB houses to frontend format (icon, gradient, isJoined, rank are mocked for now)
    const houses = housesRaw.map((house, idx) => ({
      name: house.name,
      icon: ["🎮", "🎵", "📷"][idx] || "🏠", // fallback icon
      members: house.members > 1000 ? (house.members / 1000).toFixed(1) + "K" : String(house.members),
      online: Math.floor(Math.random() * (house.members / 2)), // mock online count
      gradient: [
        "from-green-500 to-emerald-500",
        "from-orange-500 to-yellow-500",
        "from-indigo-500 to-purple-500"
      ][idx] || "from-gray-500 to-gray-700",
      isJoined: false, // TODO: set true if user is a member
      rank: ["A", "B", "C"][idx] || "D", // mock rank
    }));


    // Recommendations (mocked for now)
    const recommendations = [
      { name: "UI Wizards", icon: "🧙‍♂️", reason: "Because you like Design" },
      { name: "Next.js Pros", icon: "⚡", reason: "Trending in Tech" },
    ];

    // Shorts: Fetch latest 6 drops as shorts
    const dropsRaw = await Drop.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('author', 'username')
      .lean();
    const shorts = dropsRaw.map((drop) => ({
      id: drop._id,
      title: drop.content.length > 20 ? drop.content.slice(0, 20) + '...' : drop.content,
      thumb: 'https://placehold.co/80x120', // Placeholder, replace with real media if available
      user: drop.author && drop.author.username ? `@${drop.author.username}` : '@unknown',
    }));

    // Live Events (mocked for now)
    const liveEvents = [
      { id: 1, name: "Live Coding", viewers: 120, icon: "💻" },
      { id: 2, name: "Art Jam", viewers: 80, icon: "🎨" },
    ];

    res.json({ trendingTopics, houses, recommendations, shorts, liveEvents });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch explore data" });
  }
};

// GET /api/social/explore/search?q=<query>&filter=<all|users|drops|houses>
exports.searchContent = async (req, res) => {
  try {
    const { q, filter = "all" } = req.query;

    if (!q || q.trim().length < 1) {
      return res.json({ results: [] });
    }

    const searchQuery = q.trim();
    const results = [];

    // Search Users
    if (filter === "all" || filter === "users") {
      const User = require("../../models/User");
      const users = await User.find({
        $or: [
          { username: { $regex: searchQuery, $options: "i" } },
          { displayName: { $regex: searchQuery, $options: "i" } }
        ]
      })
        .select("username displayName _id")
        .limit(10)
        .lean();

      results.push({
        category: "Users",
        type: "users",
        items: users.map(u => ({
          id: u._id,
          name: u.displayName || u.username,
          username: u.username,
          icon: "👤"
        }))
      });
    }

    // Search Houses
    if (filter === "all" || filter === "houses") {
      const houses = await House.find({
        isPrivate: false,
        name: { $regex: searchQuery, $options: "i" }
      })
        .select("name _id members")
        .limit(10)
        .lean();

      results.push({
        category: "Houses",
        type: "houses",
        items: houses.map(h => ({
          id: h._id,
          name: h.name,
          memberCount: h.members.length,
          icon: "🏠"
        }))
      });
    }

    // Search Drops
    if (filter === "all" || filter === "drops") {
      const drops = await Drop.find({
        content: { $regex: searchQuery, $options: "i" }
      })
        .select("content _id author aura")
        .populate("author", "username displayName")
        .limit(10)
        .lean();

      results.push({
        category: "Drops",
        type: "drops",
        items: drops.map(d => ({
          id: d._id,
          content: d.content.length > 50 ? d.content.slice(0, 50) + "..." : d.content,
          author: d.author?.displayName || d.author?.username || "Unknown",
          aura: d.aura || 0,
          icon: "📝"
        }))
      });
    }

    res.json({ results });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
};
