"use client";

import HouseCard from "@/components/explore/HouseCard";
import TrendingTopic from "@/components/explore/TrendingTopic";
import { PlayCircle, Search, Share2, Shield, Star, Tag, TrendingUp, Users, Zap } from "lucide-react";
import React, { useRef, useState } from "react";
const PAGE_SIZE = 4;
// Mock data for new features
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

const categories = [
  { name: "Tech", icon: <Users size={16} /> },
  { name: "Art", icon: <Tag size={16} /> },
  { name: "Gaming", icon: <PlayCircle size={16} /> },
  { name: "Music", icon: <Zap size={16} /> },
];

type House = {
  name: string;
  icon: string;
  members: string;
  online: number;
  gradient: string;
  isJoined: boolean;
  rank: string;
};

const houses: House[] = [
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

type TrendingTopicType = {
  name: string;
  tag: string;
  posts: number;
  trend: number;
  trending: boolean;
};

const trendingTopics: TrendingTopicType[] = [
  { name: "Design Trends", tag: "#Design", posts: 156000, trend: 28, trending: true },
  { name: "React Updates", tag: "#React", posts: 142000, trend: 25, trending: false },
  { name: "UI Design", tag: "#UIDesign", posts: 98000, trend: 18, trending: false },
];

export default function ExplorePage() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [housePage, setHousePage] = useState(1);
  const [dropPage, setDropPage] = useState(1);
  const [preview, setPreview] = useState<{ type: 'user' | 'house', name: string } | null>(null);
  const FILTERS = [
    { id: "all", label: "All" },
    { id: "users", label: "Users" },
    { id: "drops", label: "Drops" },
    { id: "houses", label: "Houses" },
    { id: "capsules", label: "Capsules" },
  ];
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setResults([
        { type: filter === "all" ? "user" : filter, name: `Result for '${query}' (${filter})` },
      ]);
      setSuggestions([
        `Popular: ${query} Design`,
        `Trending: ${query} Drops`,
        `New: ${query} Houses`,
      ]);
      setShowSuggestions(true);
      setLoading(false);
    }, 800);
  };

  const visibleHouses = houses.slice(0, housePage * PAGE_SIZE);
  const visibleDrops = Array.from({ length: dropPage * PAGE_SIZE }, (_, i) => i + 1);
  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 100) {
      setHousePage((p) => Math.min(p + 1, Math.ceil(houses.length / PAGE_SIZE)));
      setDropPage((p) => Math.min(p + 1, 3));
    }
  }

  return (
    <div className="p-4 animate-fadeIn pb-24 sm:pb-0 space-y-10">
      {/* Search Bar (always at top) */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-col gap-2 animate-scaleIn">
          <div className="relative flex items-center gap-3 px-4 py-3.5 rounded-2xl clean-card border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300">
            <Search size={20} className="text-slate-400 transition-all duration-300" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setShowSuggestions(true);
                setSuggestions([
                  `Popular: ${e.target.value} Design`,
                  `Trending: ${e.target.value} Drops`,
                  `New: ${e.target.value} Houses`,
                ]);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              aria-label="Search"
              placeholder="Search users, drops, houses, capsules..."
              className="flex-1 bg-transparent outline-none text-slate-100 placeholder-slate-500 text-sm"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute left-0 top-full mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-20">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    tabIndex={0}
                    className="px-4 py-2 text-sm text-slate-200 hover:bg-purple-700/30 cursor-pointer"
                    onMouseDown={() => { setQuery(s); setShowSuggestions(false); }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {FILTERS.map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${filter === f.id ? "bg-purple-600 text-white border-purple-600" : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </form>
        <div className="mt-4">
          {loading && <div className="text-slate-400">Loading...</div>}
          {!loading && results.length === 0 && <div className="text-slate-400">No results yet. Try searching!</div>}
          {!loading && results.length > 0 && (
            <ul className="space-y-3">
              {results.map((r, i) => (
                <li key={i} className="p-4 rounded-lg bg-slate-800 border border-slate-700 text-white">
                  <span className="font-bold capitalize">{r.type}:</span> {r.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-50 mb-2 uppercase tracking-widest">For You</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {recommendations.map((rec, i) => (
            <div key={i} className="min-w-[160px] p-4 rounded-xl bg-slate-800 border border-slate-700 text-white flex flex-col items-center">
              <div className="text-3xl mb-2">{rec.icon}</div>
              <div className="font-bold mb-1">{rec.name}</div>
              <div className="text-xs text-slate-400">{rec.reason}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Drops Horizontal Scroll (was Shorts) */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-50 mb-2 uppercase tracking-widest">Drops</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {shorts.map((short) => (
            <div key={short.id} className="min-w-[80px] flex flex-col items-center">
              <img src={short.thumb} alt={short.title} className="rounded-lg w-20 h-28 object-cover mb-1" />
              <div className="text-xs text-white truncate w-20">{short.title}</div>
              <div className="text-[10px] text-slate-400">{short.user}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Events & Rooms */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-50 mb-2 uppercase tracking-widest">Live Now</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {liveEvents.map((event) => (
            <div key={event.id} className="min-w-[140px] p-3 rounded-xl bg-gradient-to-br from-purple-700 to-pink-700 text-white flex flex-col items-center border border-slate-700">
              <div className="text-2xl mb-1">{event.icon}</div>
              <div className="font-bold mb-1">{event.name}</div>
              <div className="text-xs text-pink-200">{event.viewers} watching</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category & Tag Navigation */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-50 mb-2 uppercase tracking-widest">Categories</h3>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat, i) => (
            <button key={i} className="px-4 py-2 rounded-full bg-slate-800 text-white flex items-center gap-2 border border-slate-700 text-sm font-medium hover:bg-purple-700/40 transition">
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ...removed duplicate search bar... */}

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

      {/* Trending Houses with Infinite Scroll, Badges, Previews, Sharing, Moderation */}
      <div className="mb-8" onScroll={handleScroll} tabIndex={0} aria-label="Trending Houses" style={{ maxHeight: 400, overflowY: 'auto' }}>
        <h3 className="text-sm font-bold text-slate-50 mb-4 uppercase tracking-widest">
          Trending Houses
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {visibleHouses.map((house, idx) => (
            <div key={house.name} className="relative group">
              {idx === 0 && <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs text-black px-2 py-0.5 rounded-full font-bold z-10 flex items-center gap-1"><Star size={12} />Top 1%</span>}
              {idx === visibleHouses.length - 1 && <span className="absolute -top-2 -left-2 bg-green-500 text-xs text-white px-2 py-0.5 rounded-full font-bold z-10">New</span>}
              <div
                onMouseEnter={() => setPreview({ type: 'house', name: house.name })}
                onMouseLeave={() => setPreview(null)}
                tabIndex={0}
                aria-label={`Preview ${house.name}`}
              >
                <HouseCard house={house} />
              </div>
              <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button aria-label="Share" className="p-1 rounded-full bg-slate-800 hover:bg-purple-700 text-white"><Share2 size={14} /></button>
                <button aria-label="Report" className="p-1 rounded-full bg-slate-800 hover:bg-red-700 text-white"><Shield size={14} /></button>
              </div>
            </div>
          ))}
        </div>
        {visibleHouses.length < houses.length && <div className="text-center text-slate-400 py-2">Loading more houses...</div>}
      </div>

      {/* Trending Drops Gallery with Infinite Scroll, Sharing, Moderation */}
      <div>
        <h3 className="text-sm font-bold text-slate-50 mb-4 uppercase tracking-widest">
          Trending Drops
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {visibleDrops.map((i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl overflow-hidden group cursor-pointer animate-slideIn transition-all duration-300 relative clean-card border border-slate-600/50 hover:border-slate-500/50 hover:shadow-lg hover:shadow-purple-500/20"
              style={{ animationDelay: `${i * 50}ms` }}
              tabIndex={0}
              aria-label={`Preview Drop ${i}`}
              onMouseEnter={() => setPreview({ type: 'user', name: `Dropper${i}` })}
              onMouseLeave={() => setPreview(null)}
            >
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 transform"></div>
              <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button aria-label="Share" className="p-1 rounded-full bg-slate-800 hover:bg-purple-700 text-white"><Share2 size={14} /></button>
                <button aria-label="Report" className="p-1 rounded-full bg-slate-800 hover:bg-red-700 text-white"><Shield size={14} /></button>
              </div>
            </div>
          ))}
        </div>
        {visibleDrops.length < 9 && <div className="text-center text-slate-400 py-2">Loading more drops...</div>}
      </div>
      {/* Preview Popover (mocked, global) */}
      {preview && (
        <div className="fixed bottom-8 right-8 z-50 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl animate-fadeIn w-64">
          <div className="font-bold text-white mb-1">{preview.type === 'user' ? 'User Preview' : 'House Preview'}</div>
          <div className="text-slate-200">{preview.name}</div>
          <div className="text-xs text-slate-400 mt-2">(Mocked preview popover)</div>
        </div>
      )}
    </div>
  );
}
