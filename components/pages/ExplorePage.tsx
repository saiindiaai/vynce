"use client";

import DropPreviewSheet from "@/components/drops/DropPreviewSheet";
import HouseCard from "@/components/explore/HouseCard";
import HousePreviewSheet from "@/components/explore/HousePreviewSheet";
import TrendingTopic from "@/components/explore/TrendingTopic";
import UserPreviewSheet from "@/components/profile/UserPreviewSheet";
import { fetchCategories } from "@/lib/categories";
import { fetchExploreData, searchExploreContent } from "@/lib/explore";
import { fetchForYou } from "@/lib/forYou";
import { Loader, Search, Share2, Shield, Star, TrendingUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
const PAGE_SIZE = 4;

export default function ExplorePage() {
  // Categories state
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  useEffect(() => {
    setCategoriesLoading(true);
    fetchCategories()
      .then((data) => {
        setCategories(data);
        setCategoriesLoading(false);
      })
      .catch(() => {
        setCategoriesError("Failed to load categories");
        setCategoriesLoading(false);
      });
  }, []);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [housePage, setHousePage] = useState(1);
  const [dropPage, setDropPage] = useState(1);
  const [previewDrop, setPreviewDrop] = useState<any | null>(null);
  const [previewHouse, setPreviewHouse] = useState<any | null>(null);
  const [previewUser, setPreviewUser] = useState<any | null>(null);
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

  // Explore API data
  const [exploreData, setExploreData] = useState<any>(null);
  const [exploreLoading, setExploreLoading] = useState(true);
  const [exploreError, setExploreError] = useState<string | null>(null);

  // For You section state
  const [forYou, setForYou] = useState<any>({ drops: [], houses: [], creators: [] });
  const [forYouLoading, setForYouLoading] = useState(true);
  const [forYouError, setForYouError] = useState<string | null>(null);

  useEffect(() => {
    setExploreLoading(true);
    fetchExploreData()
      .then((data) => {
        setExploreData(data);
        setExploreLoading(false);
      })
      .catch((err) => {
        setExploreError("Failed to load explore data");
        setExploreLoading(false);
      });
    // Fetch For You
    setForYouLoading(true);
    fetchForYou()
      .then((data) => {
        setForYou(data);
        setForYouLoading(false);
      })
      .catch(() => {
        setForYouError("Failed to load recommendations");
        setForYouLoading(false);
      });
  }, []);

  const handleSearch = async (searchQuery: string = query, searchFilter: string = filter) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const data = await searchExploreContent(searchQuery, searchFilter);
      setResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search as user types
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Show suggestions while typing
    if (value.trim()) {
      setShowSuggestions(true);
      // Auto-search after user stops typing for 300ms
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(value, filter);
      }, 300);
    } else {
      setResults([]);
      setShowSuggestions(false);
    }
  };

  const houses = exploreData?.houses || [];
  const trendingTopics = exploreData?.trendingTopics || [];
  // Remove recommendations (mock) from exploreData
  const drops = exploreData?.shorts || [];
  const liveEvents = exploreData?.liveEvents || [];

  const visibleHouses = houses.slice(0, housePage * PAGE_SIZE);
  const visibleDrops = drops.slice(0, dropPage * PAGE_SIZE);
  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 100) {
      setHousePage((p) => Math.min(p + 1, Math.ceil(houses.length / PAGE_SIZE)));
      setDropPage((p) => Math.min(p + 1, 3));
    }
  }


  // Used for previewing houses (e.g., on hover)
  const [preview, setPreview] = useState<{ type: string; name: any } | null>(null);

  if (exploreLoading) {
    return <div className="p-8 text-center text-slate-400">Loading explore...</div>;
  }
  if (exploreError) {
    return <div className="p-8 text-center text-red-400">{exploreError}</div>;
  }

  return (
    <div className="p-4 animate-fadeIn pb-24 sm:pb-0 space-y-10">
      {/* Search Bar (always at top) */}
      <div className="mb-6">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(query, filter); }} className="flex flex-col gap-2 animate-scaleIn">
          <div className="relative flex items-center gap-3 px-4 py-3.5 rounded-2xl clean-card border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300">
            <Search size={20} className="text-slate-400 transition-all duration-300" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={handleSearchInput}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              aria-label="Search"
              placeholder="Search users, drops, houses, capsules..."
              className="flex-1 bg-transparent outline-none text-slate-100 placeholder-slate-500 text-sm"
            />
            {loading && <Loader size={18} className="text-slate-400 animate-spin" />}
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {FILTERS.map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setFilter(f.id);
                  if (query.trim()) {
                    handleSearch(query, f.id);
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${filter === f.id ? "bg-purple-600 text-white border-purple-600" : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </form>
        <div className="mt-4">
          {loading && <div className="text-slate-400 flex items-center gap-2"><Loader size={16} className="animate-spin" /> Searching...</div>}
          {!loading && results.length === 0 && query.trim() && <div className="text-slate-400">No results found for "{query}"</div>}
          {!loading && results.length === 0 && !query.trim() && <div className="text-slate-400">Start typing to search for users, drops, and houses</div>}
          {!loading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((category, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">{category.category}</h4>
                  <div className="space-y-2">
                    {category.items.map((item: any, itemIdx: number) => (
                      <div
                        key={itemIdx}
                        onClick={() => {
                          if (category.category.toLowerCase() === 'houses') {
                            setPreviewHouse(item);
                          } else if (category.category.toLowerCase() === 'drops') {
                            setPreviewDrop(item);
                          } else if (category.category.toLowerCase() === 'users') {
                            setPreviewUser(item);
                          }
                        }}
                        className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-purple-500/30 transition cursor-pointer flex items-center gap-3"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-100 truncate">{item.name}</div>
                          {item.username && <div className="text-xs text-slate-400">@{item.username}</div>}
                          {item.content && <div className="text-xs text-slate-400 line-clamp-2">{item.content}</div>}
                          {item.author && <div className="text-xs text-slate-400">by {typeof item.author === 'string' ? item.author : (item.author?.username || item.author?.displayName || 'unknown')}</div>}
                          {item.user && !item.author && <div className="text-xs text-slate-400">by {item.user}</div>}
                          {item.bio && !item.content && <div className="text-xs text-slate-400 line-clamp-1">{item.bio}</div>}
                        </div>
                        {item.memberCount !== undefined && <span className="text-xs text-slate-400">{item.memberCount} members</span>}
                        {item.aura !== undefined && <span className="text-xs text-purple-400">⭐ {item.aura}</span>}
                        {item.level !== undefined && <span className="text-xs text-purple-400">Lv {item.level}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* For You: Backend-driven recommendations */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-50 mb-2 uppercase tracking-widest">For You</h3>
        {forYouLoading ? (
          <div className="text-slate-400">Loading...</div>
        ) : forYouError ? (
          <div className="text-red-400">{forYouError}</div>
        ) : (!forYou.drops.length && !forYou.houses.length && !forYou.creators.length) ? (
          <div className="text-slate-400">Nothing to recommend yet</div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {/* Drops */}
            {forYou.drops.map((drop: any) => (
              <div
                key={drop._id}
                onClick={() => setPreviewDrop(drop)}
                className="min-w-[160px] p-4 rounded-xl bg-slate-800 border border-slate-700 text-white flex flex-col items-center cursor-pointer hover:bg-slate-700/80 hover:border-purple-500/40 transition"
              >
                <div className="text-3xl mb-2">📝</div>
                <div className="font-bold mb-1">{drop.title || drop.content?.slice(0, 20) || 'Drop'}</div>
                <div className="text-xs text-slate-400">by {drop.author?.username || 'unknown'}</div>
              </div>
            ))}
            {/* Houses */}
            {forYou.houses.map((house: any) => (
              <div
                key={house._id}
                onClick={() => setPreviewHouse(house)}
                className="min-w-[160px] p-4 rounded-xl bg-slate-800 border border-slate-700 text-white flex flex-col items-center cursor-pointer hover:bg-slate-700/80 hover:border-purple-500/40 transition"
              >
                <div className="text-3xl mb-2">🏠</div>
                <div className="font-bold mb-1">{house.name}</div>
                <div className="text-xs text-slate-400">{house.memberCount || house.members?.length || 0} members</div>
              </div>
            ))}
            {/* Creators */}
            {forYou.creators.map((drop: any) => (
              <div
                key={drop._id}
                onClick={() => setPreviewDrop(drop)}
                className="min-w-[160px] p-4 rounded-xl bg-slate-800 border border-slate-700 text-white flex flex-col items-center cursor-pointer hover:bg-slate-700/80 hover:border-purple-500/40 transition"
              >
                <div className="text-3xl mb-2">👤</div>
                <div className="font-bold mb-1">{drop.title || drop.content?.slice(0, 20) || 'Drop'}</div>
                <div className="text-xs text-slate-400">by {drop.author?.username || 'unknown'}</div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Drops section removed as per requirements. Only Trending Drops below. */}



      {/* Categories: backend-driven */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-50 mb-2 uppercase tracking-widest">Categories</h3>
        {categoriesLoading ? (
          <div className="text-slate-400">Loading...</div>
        ) : categoriesError ? (
          <div className="text-red-400">{categoriesError}</div>
        ) : categories.length === 0 ? (
          <div className="text-slate-400">No categories yet</div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat: any, i: number) => (
              <button key={i} className="px-4 py-2 rounded-full bg-slate-800 text-white flex items-center gap-2 border border-slate-700 text-sm font-medium hover:bg-purple-700/40 transition">
                {cat.name}
                <span className="ml-1 text-xs text-slate-400">{cat.score}</span>
              </button>
            ))}
          </div>
        )}
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
          {trendingTopics.map((topic: any, idx: number) => (
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
          {visibleHouses.map((house: any, idx: number) => (
            <div key={house.name} className="relative group cursor-pointer" onClick={() => setPreviewHouse(house)}>
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
          {visibleDrops.map((drop: any, i: number) => (
            <div
              key={drop.id}
              className="rounded-2xl group cursor-pointer animate-slideIn transition-all duration-300 relative clean-card border border-slate-600/50 hover:border-slate-500/50 hover:shadow-lg hover:shadow-purple-500/20 p-4 bg-slate-900"
              style={{ animationDelay: `${i * 50}ms` }}
              tabIndex={0}
              aria-label={`Preview Drop ${drop.title}`}
              onClick={() => setPreviewDrop(drop)}
            >
              <div className="text-base font-semibold text-white mb-2 truncate">{drop.title}</div>
              {drop.content && <div className="text-sm text-slate-300 line-clamp-3 mb-2 whitespace-pre-line">{drop.content}</div>}
              <div className="text-xs text-slate-400">by {drop.user || drop.author?.username || "unknown"}</div>
              <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button aria-label="Share" className="p-1 rounded-full bg-slate-800 hover:bg-purple-700 text-white"><Share2 size={14} /></button>
                <button aria-label="Report" className="p-1 rounded-full bg-slate-800 hover:bg-red-700 text-white"><Shield size={14} /></button>
              </div>
            </div>
          ))}
        </div>
        {visibleDrops.length < drops.length && <div className="text-center text-slate-400 py-2">Loading more drops...</div>}
      </div>
      {/* Drop Preview Sheet */}
      <DropPreviewSheet open={!!previewDrop} onClose={() => setPreviewDrop(null)} drop={previewDrop} />

      {/* House Preview Sheet */}
      <HousePreviewSheet open={!!previewHouse} onClose={() => setPreviewHouse(null)} house={previewHouse} />

      {/* User Preview Sheet */}
      <UserPreviewSheet open={!!previewUser} onClose={() => setPreviewUser(null)} user={previewUser} />
    </div>
  );
}
