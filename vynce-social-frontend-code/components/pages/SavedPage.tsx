"use client";

import { fetchSavedItems } from "@/lib/social";
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SavedItem {
  _id: string;
  content: string;
  createdAt: string;
  author: {
    username: string;
    displayName?: string;
    uid: string;
    avatar?: string;
  };
  media?: { url: string; type: string };
  type: "post" | "drop" | "capsule";
  likes?: number;
  dislikes?: number;
  commentsCount?: number;
  shares?: number;
}

export default function SavedPage() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadSavedItems();
  }, []);

  const loadSavedItems = async () => {
    try {
      setLoading(true);
      const response = await fetchSavedItems(page, 20);
      setSavedItems(response.items || []);
      setHasMore(response.hasMore || false);
    } catch (error) {
      console.error("Failed to load saved items:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInDays)}d ago`;
    }
  };

  return (
    <div className="animate-fadeIn pb-24 sm:pb-0 w-full">
      {/* Header */}
      <div className="px-4 sm:px-6 py-6 border-b border-slate-700/50 bg-slate-900">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-50 mb-2">Saved</h1>
        <p className="text-sm sm:text-base text-slate-400">Your saved posts, drops, and capsules</p>
      </div>

      {/* Saved Items */}
      <div className="max-w-2xl mx-auto w-full px-3 sm:px-6 py-6 space-y-1">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading saved items...</p>
          </div>
        ) : savedItems.length > 0 ? (
          savedItems.map((item, idx) => (
            <article
              key={item._id}
              className="clean-card animate-slideIn p-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Item Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0 flex items-center justify-center text-base font-bold">
                    {item.author.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-slate-50">
                        {item.author.displayName || item.author.username}
                      </span>
                      <span className="text-xs text-slate-400 capitalize px-2 py-0.5 bg-slate-800 rounded-full">
                        {item.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span>@{item.author.username}</span>
                      <span>·</span>
                      <span>saved {formatTimeAgo(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Item Content */}
              <div className="mb-3">
                <p className="text-sm text-slate-100 leading-relaxed">{item.content}</p>
              </div>

              {/* Media Display */}
              {item.media && (
                <div className="mb-3">
                  {item.media.type === "image" ? (
                    <img
                      src={item.media.url}
                      alt="Saved item media"
                      className="w-full rounded-xl max-h-64 object-cover shadow-lg"
                    />
                  ) : item.media.type === "video" ? (
                    <video
                      src={item.media.url}
                      controls
                      className="w-full rounded-xl max-h-64 object-cover shadow-lg"
                    />
                  ) : null}
                </div>
              )}

              {/* Engagement Stats */}
              {(item.likes || item.dislikes || item.commentsCount || item.shares) && (
                <div className="text-xs text-slate-400 flex gap-4 mb-3 pb-3 border-b border-slate-700/30">
                  {item.likes !== undefined && (
                    <button className="hover:text-slate-200 transition-colors">
                      {item.likes} Likes
                    </button>
                  )}
                  {item.dislikes !== undefined && (
                    <button className="hover:text-slate-200 transition-colors">
                      {item.dislikes} Dislikes
                    </button>
                  )}
                  {item.commentsCount !== undefined && (
                    <button className="hover:text-slate-200 transition-colors">
                      {item.commentsCount} Comments
                    </button>
                  )}
                  {item.shares !== undefined && (
                    <button className="hover:text-slate-200 transition-colors">
                      {item.shares} Shares
                    </button>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 py-2 px-1 rounded-md text-slate-400 hover:bg-slate-800/50 hover:text-red-300 transition-all duration-150 text-xs font-medium min-h-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500">
                  <Heart size={14} />
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 py-2 px-1 rounded-md text-slate-400 hover:bg-slate-800/50 hover:text-blue-300 transition-all duration-150 text-xs font-medium min-h-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500">
                  <MessageCircle size={14} />
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 py-2 px-1 rounded-md text-slate-400 hover:bg-slate-800/50 hover:text-green-300 transition-all duration-150 text-xs font-medium min-h-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500">
                  <Share2 size={14} />
                </button>
                <button className="flex-1 flex items-center justify-center py-2 px-1 rounded-md text-yellow-400 bg-slate-800 transition-all duration-150 text-xs font-medium min-h-[36px] min-w-[36px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500">
                  <Bookmark size={14} fill="currentColor" />
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-12">
            <Bookmark size={32} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-300 text-lg font-semibold">No saved items yet</p>
            <p className="text-slate-500 text-sm mt-1">Items you save will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
