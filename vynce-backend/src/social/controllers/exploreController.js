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

    // Houses: Top 3 by members (mocked for now)
    const houses = [
      {
        name: "Gaming",
        icon: "🎮",
        members: "67.8K",
        online: 2300,
        gradient: "from-green-500 to-emerald-500",
        isJoined: true,
        rank: "A",
      },
      {
        name: "Music",
        icon: "🎵",
        members: "34.1K",
        online: 1120,
        gradient: "from-orange-500 to-yellow-500",
        isJoined: false,
        rank: "B",
      },
      {
        name: "Photography",
        icon: "📷",
        members: "29.3K",
        online: 987,
        gradient: "from-indigo-500 to-purple-500",
        isJoined: true,
        rank: "C",
      },
    ];

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
