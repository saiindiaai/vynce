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

// GET /api/social/explore/main
exports.getExploreMain = async (req, res) => {
  try {

    // Trending Topics: Top 3 tags by post count (mocked for now)
    const trendingTopics = [
      { name: "Design Trends", tag: "#Design", posts: 156000, trend: 28, trending: true },
      { name: "React Updates", tag: "#React", posts: 142000, trend: 25, trending: false },
      { name: "UI Design", tag: "#UIDesign", posts: 98000, trend: 18, trending: false },
    ];

    // Houses: Top 3 by members (from DB)
    const housesRaw = await House.find({})
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

    // Recommendations, Shorts, Live Events (mocked for now)
    const recommendations = [
      { name: "UI Wizards", icon: "🧙‍♂️", reason: "Because you like Design" },
      { name: "Next.js Pros", icon: "⚡", reason: "Trending in Tech" },
    ];
    const shorts = [
      { id: 1, title: "Epic Drop!", thumb: "https://placehold.co/80x120", user: "@alex" },
      { id: 2, title: "UI Hack", thumb: "https://placehold.co/80x120", user: "@jane" },
    ];
    const liveEvents = [
      { id: 1, name: "Live Coding", viewers: 120, icon: "💻" },
      { id: 2, name: "Art Jam", viewers: 80, icon: "🎨" },
    ];

    res.json({ trendingTopics, houses, recommendations, shorts, liveEvents });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch explore data" });
  }
};
