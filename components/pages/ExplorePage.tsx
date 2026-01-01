"use client";

import React from "react";
import { Search, TrendingUp } from "lucide-react";
import HouseCard from "@/components/explore/HouseCard";
import TrendingTopic from "@/components/explore/TrendingTopic";

const houses = [
  {
    name: "Design",
    icon: "🎨",
    members: "23.4K",
    online: 891,
    gradient: "from-purple-500 to-pink-500",
    isJoined: true,
  },
  {
    name: "Tech",
    icon: "💻",
    members: "45.2K",
    online: 1400,
    gradient: "from-blue-500 to-cyan-500",
    isJoined: true,
  },
  {
    name: "Creative",
    icon: "✨",
    members: "18.7K",
    online: 765,
    gradient: "from-pink-500 to-rose-500",
    isJoined: false,
  },
  {
    name: "Gaming",
    icon: "🎮",
    members: "67.8K",
    online: 2300,
    gradient: "from-green-500 to-emerald-500",
    isJoined: true,
  },
  {
    name: "Music",
    icon: "🎵",
    members: "34.1K",
    online: 1120,
    gradient: "from-orange-500 to-yellow-500",
    isJoined: false,
  },
  {
    name: "Photography",
    icon: "📸",
    members: "29.3K",
    online: 987,
    gradient: "from-indigo-500 to-purple-500",
    isJoined: true,
  },
];

const trendingTopics = [
  { name: "AI Breakthrough", tag: "#AI", posts: 234000, trend: 45, trending: true },
  { name: "Web Development", tag: "#WebDev", posts: 189000, trend: 32, trending: true },
  { name: "Design Trends", tag: "#Design", posts: 156000, trend: 28, trending: true },
  { name: "React Updates", tag: "#React", posts: 142000, trend: 25, trending: false },
  { name: "UI Design", tag: "#UIDesign", posts: 98000, trend: 18, trending: false },
];

export default function ExplorePage() {
  return (
    <div className="p-4 animate-fadeIn pb-24 sm:pb-0">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative animate-scaleIn">
          <div className="relative flex items-center gap-3 px-4 py-3.5 rounded-2xl clean-card border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300">
            <Search size={20} className="text-slate-400 transition-all duration-300" />
            <input
              type="text"
              placeholder="Search communities, topics, drops..."
              className="flex-1 bg-transparent outline-none text-slate-100 placeholder-slate-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-purple-400" />
          <h3 className="text-sm font-bold text-slate-50 uppercase tracking-widest">
            Trending Now
          </h3>
        </div>
        <div className="space-y-2">
          {trendingTopics.map((topic, idx) => (
            <TrendingTopic key={topic.tag} topic={topic} />
          ))}
        </div>
      </div>

      {/* Trending Houses */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-50 mb-4 uppercase tracking-widest">
          Trending Houses
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {houses.map((house, idx) => (
            <HouseCard key={house.name} house={house} />
          ))}
        </div>
      </div>

      {/* Trending Drops Gallery */}
      <div>
        <h3 className="text-sm font-bold text-slate-50 mb-4 uppercase tracking-widest">
          Trending Drops
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl overflow-hidden group cursor-pointer animate-slideIn transition-all duration-300 relative clean-card border border-slate-600/50 hover:border-slate-500/50 hover:shadow-lg hover:shadow-purple-500/20"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 transform"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
